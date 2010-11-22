/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
(function () {
	
	function _compareDays(x , y) {
		var xDays = x._days,
			yDays = y._days;
		if (xDays > yDays) return 1;
		else if (xDays == yDays) return 0;		
		return -1;
	}
	
	function _compareStartTime(x , y) {
		var isDaylongMonX = zk.Widget.$(x).className == 'calendar.DaylongOfMonthEvent',
			isDaylongMonY = zk.Widget.$(y).className == 'calendar.DaylongOfMonthEvent',
			xBd = isDaylongMonX ? Math.min(x.upperBoundBd, x.zoneBd): x.zoneBd,
			yBd = isDaylongMonY ? Math.min(y.upperBoundBd, y.zoneBd): y.zoneBd,
			xEd = x.zoneEd,
			yEd = y.zoneEd;
		
		if (xBd < yBd)
			return 1;
		else if (xBd == yBd) {
			if (xEd < yEd)
				return -1;
			else if (xEd == yEd) 
				return 0;
			return 1				
		}				
		return -1;
	}
	
	function _getEventPeriod(ce){
		var bd = new Date(ce.zoneBd),
			ed = new Date(ce.zoneEd);
			
		if (_isZeroTime(ed))
			ed = new Date(ed.getTime() - 1000);
		
		bd.setHours(0,0,0,0);
		ed.setHours(23,59,59,0);

		return Math.ceil((ed - bd)/ calUtil.DAYTIME);
	}
	
	function _isExceedOneDay(wgt, ce){
		var bd = new Date(ce.zoneBd),
			ed = new Date(ce.zoneEd);
			
		if (bd < wgt.zoneBd || bd.getFullYear() != ed.getFullYear() ||
			(!calUtil.isTheSameDay(bd, ed) && (ed.getHours() != 0 ||ed.getMinutes() != 0)) ||
			(calUtil.getPeriod(ed, bd) >= 1 && calUtil.getPeriod(ed, wgt.zoneBd) >= 1))
	 		return true;	
	}
	
	function _isZeroTime(date){
		return (date.getHours() + date.getMinutes() + 
			date.getSeconds() + date.getMilliseconds() == 0);
	}
	
	
calendar.Calendars = zk.$extends(zul.Widget, {	
	ppTemplate: ['<div id="%1-pp" class="%2" style="position:absolute; top:0;left:0;"><div class="%2-t1"></div><div class="%2-t2"><div class="%2-t3"></div></div>',
			  '<div class="%2-body"><div class="%2-inner">',
			  '<div class="%2-header"><div id="%1-ppc" class="%2-close"></div><div id="%1-pphd" class="%2-header-cnt"></div></div>',
			  '<div class="%2-cnt"><div class="%2-evts"><table id="%1-ppcnt" class="%2-evt-cnt" cellpadding="0" cellspacing="0"><tbody></tbody></table></div></div>',
			  '</div></div>',
			  '<div class="%2-b2"><div class="%2-b3"></div></div><div class="%2-b1"></div></div>'].join(''),

	evtTemplate: ['<div id="%1" class="%2 %3-more-faker"><div class="%2-t1" %5></div><div class="%2-t2" %5><div class="%2-t3" %9></div></div>',
			  '<div class="%2-body" %5><div class="%2-inner" %8>',
			  '<div class="%2-cnt %3-arrow" %6><div class="%3-arrow-icon" %7></div><div class="%2-text">%4</div></div>',
			  '</div></div>',
			  '<div class="%2-b2" %5><div class="%2-b3" %9></div></div><div class="%2-b1" %5></div></div>'].join(''),
	blockTemplate: '<div id="%1-tempblock"></div>',
	ropeTemplate: '<div id="%1-rope" class="%2-month-dd">',
	ddRopeTemplate: '<div class="%1-dd-rope"></div>',
	
	$define : {
		readonly: function () {
			if (!this.$n()) return;			
			this.editMode(!this._readonly);
		},		
		cd: function(){
			this._currentDate = new Date(this._cd);
			this.updateDateRange_();			
		},
		firstDayOfWeek: function(){
			this.updateDateRange_();
		},
		escapeXML: null		
	},

	$init: function () {
		this.$supers('$init', arguments);		
		this._drag = {};
		this._ghost = {};
		this._eventKey = {};
		this.params = {};
	},

	bind_ : function() {
		this.$supers('bind_', arguments);
		zWatch.listen({onSize: this, onShow: this});
	},
	
	unbind_ : function() {
		this.clearGhost();
		// just in case
		this.closeFloats();
		zWatch.unlisten({onSize: this, onShow: this});
		this._drag = this._ghost = this._eventKey = this.params = null;
		this.$supers('unbind_', arguments);
	},
	
	getZclass: function() {
		var zcls = this._zclass;
		return zcls ? zcls : "z-calendars";
	},

	setCleardd: function(cleardd) {
		if (cleardd)
			this.clearGhost();
	},

	processEvtData_: function(event){
		event.isLocked = event.isLocked == 'true' ? true: false;		
		event.beginDate = new Date(zk.parseInt(event.beginDate));
		event.endDate = new Date(zk.parseInt(event.endDate));				
		
		event.zoneBd = this.fixTimeZoneFromServer(event.beginDate);
		event.zoneEd = this.fixTimeZoneFromServer(event.endDate);
		
		var key = event.key,
			period = this._eventKey[key],
			inMon = this.mon;
		
		if (!period) {			
			var keyDate = zk.fmt.Date.parseDate(key);
			keyDate.setHours(0,0,0,0);
			keyDate = calUtil.getPeriod(keyDate, this.zoneBd);
			
			period = {day:inMon ? keyDate % 7: keyDate};
			
			if (inMon)
				period.week = Math.floor(keyDate/7);
			
			this._eventKey[key] = period;
		}
		event._preOffset = period.day;
		if (inMon)
			event.startWeek = this._weekDates[period.week];
		
		return event;
	},
	
	createChildrenWidget_: function () {
		this.cleanEvtAry_();
		//append all event be widget children
		for (var i = 0, j = this._events.length; i < j; i++) {
			var events = this._events[i];
			for (var k = events.length; k--;) {
				var event = this.processEvtData_(events[k]);
				if (event.zoneBd > this.zoneEd || event.zoneEd < this.zoneBd) continue;				
				
				this.processChildrenWidget_(_isExceedOneDay(this, event), event);
			}
		}
	},
	
	processChildrenWidget_: function (isExceedOneDay, event) {
	},
	
	drawEvent_: function(preOffset, className, tr, dayNode){
		var html = [],
			s = '<td class="' + className + '">&nbsp;</td>';
		for (var n = preOffset; n--;) 
			html.push(s);
		
		html.push('<td class="' + className + '" colspan="' + dayNode._days + '"></td>');		
		tr.append(html.join(''));			
		jq(tr[0].lastChild).append(dayNode);
	},	
		
	putInDaylongSpace_: function(list, node) {
		var bd = node.upperBoundBd,
			ed = node.lowerBoundEd,
			rowSpace,
			findSpace;
		//find space from first row
		for (var k = 0, l = list.length; k < l; k++) {
			rowSpace = list[k];
			// compare with all daylong event in row and find space
			for (var m = 0, n = rowSpace.length; m < n; m++) {
				findSpace = false;
				var evt = rowSpace[m],
					preBd = evt.upperBoundBd,
					preEd = evt.lowerBoundEd;
					
				if (bd >= preEd || ed <= preBd)
					findSpace = true;
			}
			if (findSpace) break;
		}		
			
		//not row space
		if (findSpace)			
			rowSpace.push(node);		
		else list.push([node]);
	},	
	
	updateDateOfBdAndEd_: function(){
		this._beginDate = new Date(this.bd);
		this._endDate = new Date(this.ed);
		this.zoneBd = this.fixTimeZoneFromServer(this._beginDate);
		this.zoneEd = this.fixTimeZoneFromServer(this._endDate);
	},
	
	editMode: function (enable) {
		var	widget = this,
			inMon = this.mon,
			daylong = inMon ? this.$n('cnt'): this.$n("daylong"),
			cls = this.$class;
		// a trick for dragdrop.js
		daylong._skipped = enable;
		jq(daylong)[enable ? 'bind': 'unbind']('click',  function (evt) {
			if (!zk.dragging && !zk.processing) {
				widget.clearGhost();
				widget[inMon ? 'onClick': 'onDaylongClick'](daylong, evt);
			} else
				evt.stop();
		});
		
		this._drag[daylong.id] = enable ? new zk.Draggable(this, daylong, {
			starteffect: widget.closeFloats,
			endeffect: cls._enddrag,
			ghosting: cls._ghostdrag,
			endghosting: cls._endghostdrag,
			change: cls._changedrag,
			draw: cls._drawdrag,
			ignoredrag: cls._ignoredrag
		}): null;
		jq(this.$n())[enable ? 'bind': 'unbind']('click', this.proxy(this.clearGhost));
		
		if (inMon) return;
		
		var cnt = this.$n("cnt");
		jq(cnt)[enable ? 'bind': 'unbind']('click', function(evt) {
			if (!zk.dragging && !zk.processing) {
				widget.clearGhost();
				widget.onClick(cnt, evt);
			} else
				evt.stop();
		});

		// daylong drag
		cnt._skipped = enable;
		this._drag[cnt.id] = enable ? new zk.Draggable(this,cnt, {
			starteffect: widget.closeFloats,
			endeffect: cls._endDaydrag,
			ghosting: cls._ghostDaydrag,
			endghosting: cls._endghostDaydrag,
			change: cls._changeDaydrag,
			draw: cls._drawDaydrag,
			ignoredrag: cls._ignoreDaydrag
		}): null;		
	},
	
	addDayClickEvent_: function (element) {
		var widget = this,
			zcls = this.getZclass();
		jq(element).bind('mouseover', function (evt) {
			var target = evt.target;				
			if (target.tagName == "SPAN")
				jq(target).addClass(zcls + "-day-over");
		}).bind('mouseout', function (evt) {
			var target = evt.target;				
			if (target.tagName == "SPAN")
				jq(target).removeClass(zcls + "-day-over");
		}).bind('click', function (evt) {
			var target = evt.target;
			if (target.tagName == "SPAN")
				widget.fire("onDayClick",{data:[target.time]});
			evt.stop();
		});
	},
	
	setAddDayEvent: function (eventArray) {	 	
        eventArray = jq.evalJSON(eventArray);      
		if (!eventArray.length) return;		
		this.clearGhost();
		
		var hasAdd = {day:false,daylong:false};
		
        for (var event; (event = eventArray.shift());) {
			if (zk.Widget.$(event.id)) continue;
			event = this.processEvtData_(event);
			//over range
			if (event.zoneBd > this.zoneEd || event.zoneEd < this.zoneBd) continue;
			
			var isExceedOneDay = _isExceedOneDay(this, event);
			this.processChildrenWidget_(isExceedOneDay, event);
			hasAdd[isExceedOneDay ? 'daylong': 'day'] = true;
        }
		
		this.reAlignEvents_(hasAdd);
    },
	
	setModifyDayEvent: function (eventArray) {    
        eventArray = jq.evalJSON(eventArray);      
        if (!eventArray.length) return;   
		this.clearGhost();
		
		var hasAdd = {day:false,daylong:false};
			 
        for (var event; (event = eventArray.shift());) {
			var childWidget = zk.Widget.$(event.id),
				inMon = this.mon;;
			
			event = this.processEvtData_(event);
			
			if (inMon)
				this.removeNodeInArray_(childWidget);
			
			//over range
			if (event.zoneBd > this.zoneEd || event.zoneEd < this.zoneBd) {
				if (!inMon)
					this.removeNodeInArray_(childWidget, hasAdd);
				this.removeChild(childWidget);
				continue;
			}
			
			var isExceedOneDay = _isExceedOneDay(this, event),			
				isDayEvent = inMon ? childWidget.className == 'calendar.DayOfMonthEvent':
									childWidget.className == 'calendar.DayEvent',
				isChangeEvent = isExceedOneDay ? (isDayEvent ? true : false):
													(isDayEvent ? false: true);
			if (isChangeEvent) {
				if (!inMon)
					this[isDayEvent ? '_dayEvents': '_daylongEvents'].$remove(childWidget.$n());
				this.removeChild(childWidget);
				this.processChildrenWidget_(isExceedOneDay, event);
				hasAdd.day = hasAdd.daylong = true;
			} else {
				childWidget.event = event;	
				childWidget.update();
				inMon ? this._putInMapList(childWidget): 
						hasAdd[isExceedOneDay ? 'daylong': 'day'] = true;
			}
        }

		this.reAlignEvents_(hasAdd);
    },
	
	setRemoveDayEvent: function (eventArray) {       
        eventArray = jq.evalJSON(eventArray);      
        if (!eventArray.length) return;

		var hasAdd = {day:false,daylong:false};

        for (var event; (event = eventArray.shift());) {
			var childWidget = zk.Widget.$(event.id);
			if (!childWidget) continue;
			
			this.removeNodeInArray_(childWidget, hasAdd);
			this.removeChild(childWidget);
		}
		this.reAlignEvents_(hasAdd);
    },
	
	dateSorting_: function(x, y) {
		var compareStartTime;
		if (compareStartTime = _compareStartTime(x , y))
			return compareStartTime;
		return _compareDays(x , y);
	},
	
	fixTimeZoneFromServer: function (date, tzOffset) {
		return new Date(date.getTime() + (date.getTimezoneOffset() + (tzOffset || this.tz)) * 60000);
	},
	
	getTimeZoneTime: function (date, tzOffset) {
		return new Date(date.getTime() + (tzOffset - this.tz)  * 60000);
	},
	
	fixTimeZoneFromClient: function (date) {
		return date.getTime() - (date.getTimezoneOffset() + this.tz) * 60000;
	},
	
	fixRope_: function (infos, n, cols, rows, offs, dim, dur) {
		if (!n || !offs || !dim) return;

		n.style.top = jq.px(dim.hs[rows] * rows + offs.t);
		n.style.left = jq.px(infos[cols].l + offs.l);
		n.style.height = jq.px(dim.hs[rows]);

		if (!dur)
			n.style.width = jq.px(dim.w);
		else {
			var i =	offs.s - cols;
			if (dur < i)
				i = dur;

			var w = 0;
			for (var len = 0; len < i; len++)
				w += infos[cols + len].w;

			n.style.width = jq.px(w);
			dur -= i;

			if (dur && ++rows < dim.hs.length)
				this.fixRope_(infos, n.nextSibling, 0, rows, offs, dim, dur);
			else
				for (var e = n.nextSibling; e; e = e.nextSibling)
					e.style.cssText = "";
		}
	},
	
	clearGhost: function () {	
		if (this.$n()) {
			if (this._ghost[this.uuid])
				this._ghost[this.uuid]();
		} else {
			for (var f in this._ghost)
				this._ghost[f]();				
		}
	},

	closeFloats: function () {
		if (this._pp) {
			jq(document.body).unbind("click", this.unMoreClick);
			jq(this._pp).remove();
			this._pp = null;
		}		
	},
	
	onPopupClick: function (evt) {	
		var childWidget = zk.Widget.$(evt.target);
		if (childWidget.$instanceof(calendar.Event)) {
			this.fire("onEventEdit",{data:[childWidget.uuid,evt.pageX,evt.pageY,jq.innerWidth(),jq.innerHeight()]});
			evt.stop();
		}
	},
	
	isLegalChild: function (n) {
		if (!n.id.endsWith("-body"))
			return n;
	}

},{
	_ignoredrag: function (dg, p, evt) {
		if (zk.processing) return true;
		var cnt = dg.node,
			widget = dg.control,
			p = widget.params;

		widget.clearGhost();
		var n = evt.domTarget,
			targetWidget = zk.Widget.$(n);			
		if (widget.mon && n.tagName == 'SPAN' && 
			jq(n).hasClass(widget.getZclass() + "-month-date-cnt"))
				return true;
		if (n.nodeType == 1 && jq(n).hasClass(p._fakerMoreCls) && !jq(n).hasClass(p._fakerNoMoreCls) || 
			(targetWidget.$instanceof(calendar.Event)&& 
				(!n.parentNode || targetWidget.event.isLocked )))
				return true;
		return false;
	},

	_ghostdrag: function (dg, ofs, evt) {		
		var cnt = dg.node,
			widget = dg.control,
			uuid = widget.uuid,
			zcls = widget.getZclass(),
			inMon = widget.mon,
			dataObj = widget.getDragDataObj_(),
			targetWidget = zk.Widget.$(evt.domEvent),
			ce = targetWidget.$instanceof(calendar.Event)? targetWidget.$n(): null,
			hs = [];

		jq(document.body).prepend(dataObj.getRope(widget, cnt, hs));

		var row = dataObj.getRow(cnt),
			width = row.offsetWidth,
			p = [evt.pageX,evt.pageY];
		dg._zinfo = [];
		for (var left = 0, n = row; n; left += n.offsetWidth, n = n.nextSibling)
			dg._zinfo.push({l: left, w: n.offsetWidth});

		dg._zoffs = zk(inMon? cnt: dg.handle).revisedOffset();
		dg._zoffs = {
			l: dg._zoffs[0],
			t: dg._zoffs[1],
			w: dg.handle.offsetWidth,
			h: dg.handle.offsetHeight,
			s: dg._zinfo.length
		};

		if (ce) {
			var faker = ce.cloneNode(true),
				h = ce.offsetHeight;
			faker.id = uuid + '-dd';
			jq(faker).addClass(zcls + '-evt-faker-dd');
			
			faker.style.width = jq.px(width);
			faker.style.height = jq.px(h);
			faker.style.left = jq.px(p[0] - (width/2));
			faker.style.top = jq.px(p[1] + h);
			
			jq(ce).addClass(zcls + '-evt-dd');
			
			if (inMon) {
				var cloneNodes = targetWidget.cloneNodes;
				if (cloneNodes)
					for (var n = cloneNodes.length; n--;)
						jq(cloneNodes[n]).addClass(zcls + '-evt-dd');
			}
			
			jq(document.body.firstChild).before(jq(faker));
			dg.node = jq('#' + uuid + '-dd')[0];
			
			dg._zdur = _getEventPeriod(targetWidget.event);
			dg._zevt = ce;
		}
			
		dg._zdim = {w: width, h: hs[0], hs: hs};
		dg._zrope = jq('#' + widget.uuid + '-rope')[0];

		var cols = dataObj.getCols(p, dg),
			rows = dataObj.getRows(p, dg);

		dg._zpos = [cols, rows];

		// fix rope
		widget.fixRope_(dg._zinfo, dg._zrope.firstChild, cols, rows, dg._zoffs, dg._zdim, dg._zdur);
		return dg.node;	
	},
	
	_drawdrag: function (dg, p, evt) {
		var node = dg.node;
		if (node.id.endsWith('-dd')) {
			var w = node.offsetWidth,
				h = node.offsetHeight,
				x = evt.pageX - (w/2),
				y = evt.pageY - h,
				x1 = dg._zoffs.l,
				y1 = dg._zoffs.t,
				w1 = dg._zoffs.w,
				h1 = dg._zoffs.h;
			if (x < x1)
				x = x1;
			else if (x + w > x1 + w1)
				x = x1 + w1 - w;

			if (y < y1)
				y = y1;
			else if (y + h > y1 + h1)
				y = y1 + h1 - h;
			node.style.left = jq.px(x);
			node.style.top = jq.px(y);
		}
	},
	
	_changedrag: function(dg, p, evt) {		
		var widget = dg.control,
			x = p[0],
			y = p[1],
			x1 = dg._zoffs.l,
			y1 = dg._zoffs.t,
			w1 = dg._zoffs.w,
			h1 = dg._zoffs.h;
		if (x < x1)
			x = x1;
		else if (x > x1 + w1)
			x = x1 + w1;

		if (y < y1)
			y = y1;
		else if (y > y1 + h1)
			y = y1 + h1;

		x -= x1;
		y -= y1;

	 	var cols = Math.floor(x/dg._zdim.w),
			rows = Math.floor(y/dg._zdim.h),
			dur = dg._zdur,
			size = dg._zrope.childNodes.length;

		if (rows == size)
			--rows
		if (cols == dg._zoffs.s)
			cols = dg._zoffs.s - 1;

		if (!dg._zevt) {
		 	var c = dg._zpos[0],
				r = dg._zpos[1],
				b = dg._zoffs.s * r + c,
				e = dg._zoffs.s * rows + cols;

			dur = (b < e ? e - b: b - e) + 1;
			cols = b < e ? c : cols;
			rows = b < e ? r : rows;

		 } else {
		 	var total = dg._zoffs.s * size,
				count = dg._zoffs.s * rows + cols + dur;

			if (total < count)
				dur = total - (dg._zoffs.s * rows + cols);
		 }
		 if (!dg._zpos1 || dg._zpos1[2] != dur || dg._zpos1[0] != cols || dg._zpos1[1] != rows) {
		 	dg._zpos1 = [cols, rows, dur];
		 	widget.fixRope_(dg._zinfo, dg._zrope.firstChild, cols, rows, dg._zoffs, dg._zdim, dur);
		 }
	},
	
	_endghostdrag: function (dg, origin) {
		// target is Calendar's event
		dg.node = dg.handle;
	},
	
	_enddrag: function (dg, evt) {
		var widget = dg.control,
			cnt = dg.node,
			dg = widget._drag[cnt.id];
		if (dg) {
			var ce,
				dataObj = widget.getDragDataObj_();
			if (dg._zevt) {
				var zcls = widget.getZclass(),
					targetWidget = zk.Widget.$(dg._zevt),
					event = targetWidget.event,
					bd = new Date(widget.zoneBd),
					ebd = new Date(event.zoneBd),
					ddClass = zcls + '-evt-dd',
					inMon = widget.mon;
				bd = calUtil.addDay(bd, dataObj.getDur(dg));
				ebd.setFullYear(bd.getFullYear());
				ebd.setDate(1);
				ebd.setMonth(bd.getMonth());
				ebd.setDate(bd.getDate());

				jq(targetWidget.$n()).removeClass(ddClass);
				
				if (inMon) {
					var cloneNodes = targetWidget.cloneNodes;
					if (cloneNodes)
						for (var n = cloneNodes.length; n--;) 
							jq(cloneNodes[n]).removeClass(ddClass);					
				}
				
				if (!calUtil.isTheSameDay(ebd, event.zoneBd)) {
					ce = dg._zevt;
					ce.style.visibility = "hidden";

					var ed = new Date(event.zoneEd);
					ed.setFullYear(bd.getFullYear());
					ed.setDate(1);
					ed.setMonth(bd.getMonth());
					ed.setDate(bd.getDate() + _getEventPeriod(event) - (_isZeroTime(ed) ? 0:1));	
					
					widget.fire("onEventUpdate", {
						data: [
							dg._zevt.id,
							widget.fixTimeZoneFromClient(ebd),
							widget.fixTimeZoneFromClient(ed),
							evt.pageX,
							evt.pageY,
							jq.innerWidth(),
							jq.innerHeight()
						]
					});
				}
				jq('#' + widget.uuid + '-rope').remove();
				jq('#' + widget.uuid + '-dd').remove();
			} else {
				var newData = dataObj.getNewDate(widget, dg);

				widget.fire("onEventCreate", {
					data: [
						widget.fixTimeZoneFromClient(newData.bd),
						widget.fixTimeZoneFromClient(newData.ed),
						evt.pageX,
						evt.pageY,
						jq.innerWidth(),
						jq.innerHeight()
					]
				});
			}

			widget._ghost[widget.uuid] = function () {
				jq('#' + widget.uuid + '-rope').remove();
				delete widget._ghost[widget.uuid];
			};
			dg._zinfo = dg._zpos1 = dg._zpos = dg._zrope = dg._zdim = dg._zdur = dg._zevt = null;
		}
	}
});
})();