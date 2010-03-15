/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.CalendarsMonth = zk.$extends(calendar.Calendars, {		
	_ghost: {},
	_drag: {},
	
	$define : {		
		readonly: function () {
			if (!this.$n()) return;
			var widget = this,
				cnt = this.$n("cnt");
			if (this._readonly) {
				// a trick for dragdrop.js
				cnt._skipped = false;
				jq(cnt).unbind('click');			
		
				this._drag[cnt.id] = null;
				
				jq(this.$n()).unbind('click', this.clearGhost);				
				
			}else this._editMode();
		},
		events: function () {
			this._events = jq.evalJSON(this._events);
			if (!this.$n()) return;
			
			for (var i = this.nChildren; i--;) {
				var child = this.getChildAt(i),
					className = child.className;		
				if (className == 'calendar.DayOfMonthEvent' || className == 'calendar.DaylongOfMonthEvent')
					this.removeChild(child);		
			}			
			
			this.createChildrenWidget_();			
			this._rePositionDay();
			
			//reset evt data			
			this._evtsData = this._createEvtsData(false);
			this.onShow();
		},
		zones: function () {			
			this._zones = jq.evalJSON(this._zones);
			this._zonesOffset = jq.evalJSON(this.zonesOffset);
			this.ts = this._zones.length;
			for(var i = this._zonesOffset.length; i--;)
				this._zonesOffset[i] = zk.parseInt(this._zonesOffset[i]);
							
			if(!this.$n())return;	
			
			this.updateDateOfBdAndEd_();	
		}
	},

	_prepareDrawData : function () {		
		this.AWEEK = this.DAYTIME * 7;
		 
		Date.prototype.getWeek = function() {
			var onejan = new Date(this.getFullYear(),0,1);
			return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
		} 		
	},

	bind_ : function () {// after compose
		this.$supers('bind_', arguments);
		var widget = this,
			zcls = this.getZclass(),
			cnt = this.$n('cnt');
		
		//define all positions		
		//put the title
		this.title = this.$n('inner').firstChild.firstChild.rows[0].cells;
		//put week of year
		if(this.woy)
			this.woyCnt = jq(this.$n('woy')).contents().find('.' + zcls + '-week-of-year-text');
		//put all day title
		this.allDayTitle = jq(cnt).contents().find('.' + zcls +'-month-date-cnt');
		//put day event
		this.weekRows = jq(cnt).contents().find('.' + zcls + '-day-of-month-body');
		this.weekRowsBg = jq(cnt).contents().find('.' + zcls + '-day-of-month-bg');
		
		this._weekDates = [];

		var children = this.allDayTitle,
			captionByPopup = this._captionByPopup,
			ed = new Date(this.zoneEd.getTime()),
			rdata = [];


		this._createWeekSet();
		this.createChildrenWidget_();
		this._rePositionDay();

		//add time attr for click event
		for (var i = this.weekOfMonth * 7; i--;) {
			ed.setTime(ed.getTime() - this.DAYTIME);
			children[i].time = ed.getTime();
			if(captionByPopup)
				children[i].text = captionByPopup[i];
		}
		
		if (this.woy) {			
			var woy = jq(this.$n('woy')),			
				children = this.woyCnt;

			for (var i = this.weekOfMonth; i--;)
				children[i].time = this._weekDates[i].zoneBd.getTime();

			woy.bind('click', function (evt) {
				var target = evt.target;				
				if (target.tagName == "SPAN")
					widget.fire("onWeekClick",{data:[target.time]});
				evt.stop();
			});
		}		
		
		this._evtsData = this._createEvtsData(true);
		
		if (!this._readonly) 
			this._editMode();		
	},
	
	unbind_ : function () {
		this.title = this.woyCnt = this.allDayTitle = this.weekRows = null;
		this.$supers('unbind_', arguments);
	},
	
	_createEvtsData: function (isAddClkEvt) {
		var cnt = this.$n("cnt"),				
			rdata = [];
		for (var ri = 0, n = cnt.firstChild; n; n = n.nextSibling, ri++) {
			var table = n.lastChild,
				rows = table.rows,
				len = rows.length,
				data = [];

			for (var i = 0, c = 7; c--; i++)
				data[i] = [];

			for (var i = 1; i < len; i++) {
				for (var k = 0, z = 0, cells = rows[i].cells; z + k < 7; k++) {
					if (cells[k].firstChild.id)
						data[k+z].push(cells[k].firstChild);
					var cols = cells[k].colSpan;
					while(--cols > 0)
						data[k+ ++z].push(cells[k].firstChild);
				}
			}
			rdata[ri] = data;
			if (!isAddClkEvt) continue;
			this.addDayClickEvent_(rows[0]);
		}
		return rdata;
	},
	
	cleanEvtAry_: function () {
		this._eventWeekSet = [];
	},
	
	processChildrenWidget_: function (isExceedOneDay, event) {
		var dayEvent = isExceedOneDay ?
						new calendar.DaylongOfMonthEvent({event:event}):
						new calendar.DayOfMonthEvent({event:event});
		
		this.appendChild(dayEvent);
		this._putInMapList(dayEvent);			
	},
	
	_createWeekSet: function (ed) {
		var weekDates = [],
			bd = new Date(this.zoneBd.getTime()),
			ed = this.zoneEd,
			cur,
			previous;
		
		//calculate all begin and end of week
		while (bd < ed) {
			previous = new Date(bd.getTime());
			bd.setTime(bd.getTime() + this.AWEEK);
			cur = new Date(bd.getTime());
			weekDates.push({zoneBd: previous, zoneEd: cur});
		}
		
		this._weekDates = weekDates;
	},
	
	_putInMapList: function (dayEvent) {
		var node = dayEvent.$n(),
			list = this._eventWeekSet[this._weekDates.indexOf(node.startWeek)];				
		if (!list) {
			list = [];
			this._eventWeekSet[this._weekDates.indexOf(node.startWeek)] = list;
		}				
		list.push(node);
		//add cut node
		var cloneNodes = dayEvent.cloneNodes;	
		if (!cloneNodes) return;
		for (var n = cloneNodes.length; n--;) {
			var cloneNode = cloneNodes[n],
				index = this._weekDates.indexOf(cloneNode.startWeek);
			list = this._eventWeekSet[index];
			if (!list) {
				list = [];
				this._eventWeekSet[index] = list;
			}	
			list.push(cloneNode);
		}		
	},
		
	_resetDayPosition: function () {		
		var daySpace = this._daySpace,
			zcls = this.getZclass(),
			weekRows = this.weekRows;
		
		for (var i = weekRows.length; i--;) 
			jq(weekRows[i].firstChild).children().not(':first-child').remove();
		
		//all Week Row
		for (var i = daySpace.length; i--;) {
			var weekList = daySpace[i],
				weekIndex = this._weekDates.indexOf(weekList[weekList.length - 1][0].startWeek),
				title = weekRows[weekIndex].firstChild.firstChild;//tbody
			//all week inner row
			for (var k = weekList.length; k--;) {
				jq(title).after('<tr></tr>');	
				var allEvent = weekList[k],
					tr = jq(title.nextSibling);
				
				//all event
				for (var m = 0, n = allEvent.length; m < n; m++) {
					var dayNode = allEvent[m];				
				
					if(m == 0)//first
						this.drawEvent_(dayNode._preOffset, zcls + '-month-date-evt', tr, dayNode);
					else {
						var preDayNode = allEvent[m - 1],
							start = dayNode._preOffset,
							preEnd = preDayNode._preOffset + preDayNode._days,
							offset = start - preEnd;
							
						this.drawEvent_(offset, zcls + '-month-date-evt', tr, dayNode);
					}
					dayNode.style.visibility = "";
					if (m == n - 1) {//last
						var html = [];
						for (var x = dayNode._afterOffset; x--;) 
							html.push('<td class="' + zcls + '-month-date-evt">&nbsp;</td>');							
						tr.append(html.join(''));
					}
				}
			}
		}
	},	
		
	_rePositionDay: function(){	
		this._daySpace = [];
		
		var sortFunc = this.dateSorting_,
			daySpace = this._daySpace,
			eventWeekSet = this._eventWeekSet;
			
		jq(document.body).append(this.blockTemplate);		
		var temp = jq('#' + this.uuid + '-tempblock');
		
		// all day event
		for (var i = eventWeekSet.length; i--;) {
			var list = eventWeekSet[i],
				weekList = [];
			if (!list || !list.length) continue;
			list.sort(sortFunc);			
			daySpace.push(weekList);
			for (var k = list.length; k--;) {
				var node = list[k];
				temp.append(node);
				this.putInDaylongSpace_(weekList, node);
			}		
		}		
		this._resetDayPosition();
		temp.remove();
	},
		
	_editMode: function () {
		var	widget = this,
			cnt = this.$n('cnt'),
			calMon = this.$class,
			cal = calendar.Calendars;

		jq(cnt).bind('click',  function (evt) {
			if (!zk.dragging && !zk.processing) {
				widget.clearGhost();
				widget.onClick(cnt, evt);
			} else
				evt.stop();
		});
		
		// a trick for dragdrop.js
		cnt._skipped = true;
		this._drag[cnt.id] = new zk.Draggable(this, cnt, {
			starteffect: widget.closeFloats,
			endeffect: calMon._enddrag,
			ghosting: calMon._ghostdrag,
			endghosting: calMon._endghostDrag,
			change: cal._changedrag,
			draw: cal._drawdrag,
			ignoredrag: calMon._ignoredrag
		});
		jq(this.$n()).bind('click', this.proxy(this.clearGhost));
	},
		
	_updateDateRange: function () {
		this.updateDateOfBdAndEd_();
		this._captionByDayOfWeek = this.captionByDayOfWeek ? jq.evalJSON(this.captionByDayOfWeek) : null;
		this._captionByWeekOfYear = this.captionByWeekOfYear ? jq.evalJSON(this.captionByWeekOfYear) : null;
		this._captionByDateOfMonth = this.captionByDateOfMonth ? jq.evalJSON(this.captionByDateOfMonth) : null;
		this._captionByPopup = this.captionByPopup ? jq.evalJSON(this.captionByPopup) : null;
		
		if(!this.$n())return;
		
		var cnt = this.$n("cnt"),
			$cnt = jq(cnt),
			cntRows = $cnt.children(),
			woy = this.$n("woy"),
			woyRows = jq(woy).children(),
			weeks = this.weekOfMonth,
			zcls = this.getZclass(),
			number = 100 / weeks,
			offset = weeks - cntRows.length;
			
		if (offset > 0) {
			var cntRowHtml = [],
				woyRowHtml = '<div class="' + zcls + '-month-week"><span class="' + zcls + '-week-of-year-text"></span></div>';			
			
			cntRowHtml.push('<div class="' + zcls + '-month-week"><table cellspacing="0" cellpadding="0" class="' + zcls + '-day-of-month-bg"><tbody><tr>');
			
			for (var i =7; i--;)
				cntRowHtml.push('<td>&nbsp;</td>');
			cntRowHtml.push('</tr></tbody></table><table cellspacing="0" cellpadding="0" class="' + zcls + '-day-of-month-body"><tbody><tr>');
			for (var i =7; i--;)
				cntRowHtml.push('<td class="' + zcls + '-month-date"><span class="' + zcls + '-month-date-cnt"></span></td>');			
			cntRowHtml.push('</tr></tbody></table></div>');			
			
			
			for (var i = offset; i--;) {
				$cnt.append(cntRowHtml.join(''));
				if (this.woy)
					jq(woy).append(woyRowHtml);
					
				this.addDayClickEvent_(cnt.lastChild.lastChild.rows[0]);		
			}						
		} else {				
			for (var i = -offset; i--;) {
				jq(cnt.lastChild).remove();
				if (this.woy) 
					jq(woy.lastChild).remove();
			}				
		}
		
		this.allDayTitle = $cnt.contents().find('.' + zcls +'-month-date-cnt');
		this.weekRows = jq(cnt).contents().find('.' + zcls + '-day-of-month-body');
		this.weekRowsBg = $cnt.contents().find('.' + zcls + '-day-of-month-bg');
		cntRows = $cnt.children()
		if (this.woy)
			this.woyCnt = jq(this.$n('woy')).contents().find('.' + zcls + '-week-of-year-text');		
		
		var hd = jq(cnt.parentNode.firstChild),			
			captionByPopup = this._captionByPopup,
			captionByDayOfWeek = this._captionByDayOfWeek,
			captionByWeekOfYear = this._captionByWeekOfYear,
			captionByDateOfMonth = this._captionByDateOfMonth,				
			hdChildren = this.title,			
			cntChildren = this.allDayTitle,
			cntBg = this.weekRowsBg,				
			month_date_off = zcls + '-month-date-off',	
			week_today = zcls + "-week-today",				
			week_weekend = zcls + "-week-weekend",					
			bd = new Date(this.zoneBd.getTime()),
			ed = new Date(this.zoneEd.getTime()),
			current = new Date(),
			curMonth = this._currentDate.getMonth(),
			cur,
			previous,
			woyChildren;					
		
		this._createWeekSet();
		
		//reset rows height 	
		if (this.woy) 			
			woyChildren = this.woyCnt;		
		ed = new Date(this.zoneEd.getTime());
		for (var i = weeks; i--;) {
			var div = jq(cntRows[i]),
				top = number * i;
			
			div.css('top',top + '%');
			div.height(number + '%');
			
			if (this.woy) {
				ed.setTime(ed.getTime() - this.AWEEK);
				ed.setMilliseconds(0);
				var weekSpan = woyChildren[i],
					pNode = jq(weekSpan.parentNode),
					content = captionByWeekOfYear ? captionByWeekOfYear[i]: 
											ed.getWeek();
				weekSpan.time = this._weekDates[i].zoneBd.getTime();
				jq(weekSpan).html(content);				
				
				pNode.css('top',top + '%');
				pNode.height(number + '%');							
			}		
		}		
		
		//remove today and weekend class
		hd.children().find('.' + week_weekend).removeClass(week_weekend);
		$cnt.children().find('.' + month_date_off).removeClass(month_date_off);		
		$cnt.children().find('.' + week_weekend).removeClass(week_weekend);		
		$cnt.children().find('.' + week_today).removeClass(week_today);
				
		// reset week title
		ed = new Date(this.zoneEd.getTime());
		for (var i = 7; i--;) {
			ed.setTime(ed.getTime() - this.DAYTIME);			
			var th = jq(hdChildren[i]),
				content = captionByDayOfWeek ? captionByDayOfWeek[i] : 
												zk.fmt.Date.formatDate(ed,'EEE');			
			th.html(content);	
			if (bd.getDay() == 0 || bd.getDay() == 6) //SUNDAY or SATURDAY	
				th.addClass(week_weekend);		
		}
		
		//reset each day
		ed = new Date(this.zoneEd.getTime());			
		for (var i = this.weekOfMonth * 7; i--;) {
			ed.setTime(ed.getTime() - this.DAYTIME);
			var span = cntChildren[i],
				td =  jq(span.parentNode),
				content = captionByDateOfMonth? captionByDateOfMonth[i]: ed.getDate(),
				bgTD
				rowIndex = zk.parseInt(i/7);
			
			span.time = ed.getTime();
			if (captionByPopup)
				span.text = captionByPopup[i];
			if (ed.getDay() == 0 || ed.getDay() == 6) { //SUNDAY or SATURDAY	
				td.addClass(week_weekend);
				bgTD = jq(cntBg[rowIndex].rows[0].cells[td[0].cellIndex]);
				bgTD.addClass(week_weekend);
			}

			if (current.getFullYear() == ed.getFullYear() &&
				current.getDOY() == ed.getDOY()) {//today 
				td.addClass(week_today);
				bgTD = jq(cntBg[rowIndex].rows[0].cells[td[0].cellIndex]);
				bgTD.addClass(week_today);
			}
			if (curMonth != ed.getMonth())
				td.addClass(month_date_off);			
			
			if (ed.getDate() == 1 && !captionByDateOfMonth)
				content = zk.fmt.Date.formatDate(ed,'MMM d');		
			jq(span).html(content);									
		}	
	},
	
	reAlignEvents_: function (hasAdd) {
		this._rePositionDay();		
		this.onShow();
    },
        
    removeNodeInArray_: function (childWidget, hasAdd) {
		var node = childWidget.$n(),
			weekIndex = this._weekDates.indexOf(node.startWeek);
		this._eventWeekSet[weekIndex].$remove(node);
		
		var cloneNodes = childWidget.cloneNodes;
		if (!cloneNodes) return;
		weekIndex++;
		for (var n = cloneNodes.length; n--;) {
			var cloneNode = cloneNodes[n];
			this._eventWeekSet[weekIndex + n].$remove(cloneNode);
		}
    },
			
	getIndex: function (ele) {
		for (var i = 0, n = ele.parentNode.firstChild; n; n = n.nextSibling, ++i)
			if (n == ele) return i;
		return -1;
	},
	
	onClick: function (cnt, evt) {
		var widget = zk.Widget.$(cnt),
			zcls = widget.getZclass(),
			node = evt.target,
			ce = zk.Widget.$(node).event;		
		
		if (jq(node).hasClass(zcls + '-evt-faker-more') && node.parentNode.id.indexOf('-frow') > 0) return;
		
		if (ce) {
			widget.fire("onEventEdit", {
				data: [ce.id,evt.pageX,evt.pageY, jq.innerWidth(),jq.innerHeight()]});			
		} else {
			var cmp = widget.$n(),				
				html = '<div id="' + widget.uuid + '-rope" class="' + zcls + '-month-dd">'
					 + '<div class="' + zcls + '-dd-rope"></div></div>';

			jq(document.body).prepend(html);

			var td = cnt.firstChild.firstChild.rows[0].firstChild,
				width = td.offsetWidth,
				p = [evt.pageX,evt.pageY],
				height = cnt.firstChild.offsetHeight,
				offs = zk(cnt).revisedOffset(),
				x = p[0] - offs[0],
				y = p[1] - offs[1],
				cols = Math.floor(x/width),
				rows = Math.floor(y/height),
				bd = new Date(widget._beginDate.getTime() + (7 * rows + cols) * widget.DAYTIME),
				zinfo = [];
			
			for (var left = 0, n = td; n;
					left += n.offsetWidth, n = n.nextSibling)
				zinfo.push({l: left, w: n.offsetWidth});

			var zoffs = {
				l: offs[0],
				t: offs[1],
				w: cnt.offsetWidth,
				h: cnt.offsetHeight,
				s: zinfo.length
			};

			var hs = [];
			hs[rows] = cnt.childNodes[rows].offsetHeight;

			widget.fixRope_(zinfo, jq('#'+widget.uuid+"-rope")[0].firstChild,
				cols, rows, zoffs, {w: width, h: hs[rows], hs: hs}, 1);

			// clean
			bd.setMilliseconds(0);
				
			widget.fire("onEventCreate", {
   				 data: [bd.getTime(), bd.getTime() + widget.DAYTIME, p[0], p[1], jq.innerWidth(), jq.innerHeight()]});

			widget._ghost[widget.uuid] = function () {
				jq('#'+widget.uuid+"-rope").remove();
				delete widget._ghost[widget.uuid];
			};
		}
		widget.closeFloats();
		evt.stop();
	},
	
	onMoreClick: function (evt) {
		var cell = evt.target,
			widget = zk.Widget.$(cell),
			row = cell.parentNode.parentNode.parentNode.parentNode,
			uuid = widget.uuid,
			ci = cell.cellIndex,
			pp,
			table = jq('#'+widget.uuid+'-ppcnt')[0];

		widget.clearGhost();
		if (!widget._pp) {
			jq(document.body).append(widget.ppTemplate.replace(new RegExp("%([1-2])", "g"), function (match, index) {
					return index < 2 ? uuid : 'z-calpp-month';
			}));
			widget._pp = pp = jq('#'+widget.uuid+'-pp')[0];
			jq(document.body).bind('click', widget.proxy(widget.unMoreClick));
			table = jq('#'+widget.uuid+'-ppcnt')[0]; 

			if (!widget._readonly)
				jq(pp).bind("click", widget.proxy(widget.onPopupClick));
		} else {
			if (widget._pp.ci == ci) {
				// ignore onEventCreate
				evt.stop();
				return;
			}

			for (var i = table.rows.length; i--;)
				jq(table.rows[0]).remove();
			pp = widget._pp;
		}

		pp.ci = ci;	

		var date = cell.parentNode.parentNode.firstChild.cells[ci].firstChild,
			targetDate = new Date(date.time);
		
		jq('#'+widget.uuid+'-pphd')[0].innerHTML = date.text? date.text: 
			zk.fmt.Date.formatDate(targetDate,'EEE, MMM/d');

		if (zk.ie6_) {
			var close = jq('#'+widget.uuid+'-ppc');
			close.bind('mouseover', function() {close.addClass('z-calpp-month-close-over')});
			close.bind('mouseout', function() {close.removeClass('z-calpp-month-close-over')});
		}

		var offs= zk(row.lastChild.rows[0].cells[ci]).revisedOffset(),
			csz = cell.parentNode.cells.length,
			single = cell.offsetWidth,
			wd = single*3*0.9;

		if (ci > 0)
			if (csz != ci+1)
				pp.style.left = jq.px(offs[0] - (wd - single)/2);
			else
				pp.style.left = jq.px(offs[0] - (wd - single));
		else pp.style.left = jq.px(offs[0]);

		pp.style.top = jq.px(offs[1]);
		pp.style.width = jq.px(wd);

		//filling data
		var cmp = widget.$n(),
			evts = widget._evtsData[widget.getIndex(row)][ci],
			oneDay = widget.DAYTIME,
			bd = targetDate,
			ed = new Date(bd.getTime() + oneDay);
		for (var i = evts.length; i--;) {
			var tr = table.insertRow(0),
				cr = tr.insertCell(0),
				cm = tr.insertCell(0),
				cl = tr.insertCell(0),
				ce = evts[i],
				event = zk.Widget.$(ce).event,
				hc = event.headerColor,
				cc = event.contentColor,
				zcls = event.zclass;	

			ce._bd = ce._bd || event.zoneBd;
			ce._ed = ce._ed || event.zoneEd;
			cl.className = "z-calpp-month-evt-l";
			if (bd.getTime() - ce._bd.getTime() >= 1000) {
				var info = [
						ce.id + "-fl",
						zcls,
						zcls + "-left",
						ce._bd.getMonth() + 1 + "/" + ce._bd.getDate(),
						hc ? ' style="background:' + hc + '"' : '',
						cc ? ' style="background:' + cc + '"' : '',
						cc ? ' style="border-bottom-color:' + cc + ';border-top-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + ';border-left-color:' + cc + ';border-right-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + '"' : ''
					];
				cl.innerHTML = widget.evtTemplate.replace(new RegExp("%([1-9])", "g"), function (match, index) {
					return info[index - 1];
				});
			} else
				cl.innerHTML = "";
			cm.className = "z-calpp-month-evt-m";
			var faker = ce.cloneNode(true);
			jq(faker).addClass('z-calpp-month-evt-faker');
			cm.appendChild(faker);
			cr.className = "z-calpp-month-evt-r";

			if (ce._ed.getTime() - ed.getTime() >= 1000) {
				var d = new Date(ce._ed.getTime() - 1000),
					info = [
						ce.id + "-fr",
						zcls,
						zcls + "-right",
						d.getMonth() + 1 + "/" + d.getDate(),
						hc ? ' style="background:' + hc + '"' : '',
						cc ? ' style="background:' + cc + '"' : '',
						cc ? ' style="border-bottom-color:' + cc + ';border-top-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + ';border-left-color:' + cc + ';border-right-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + '"' : ''
					];
				cr.innerHTML = widget.evtTemplate.replace(new RegExp("%([1-9])", "g"), function (match, index) {
					return info[index - 1];
				});
			} else
				cr.innerHTML = "";
		}
		zk(pp).cleanVisibility();
		evt.stop();
	},
	
	unMoreClick: function (evt) {
		var target = evt.target;
		if (target.id.endsWith("-ppc") ||!zUtl.isAncestor(this._pp, target))
			this.closeFloats();
	},
		
	fixVisiHgh: function () {
		var widget = this,
			cnt = this.$n('cnt'),
			zcls = this.getZclass();

		for (var ri = 0, n = cnt.firstChild; n; n = n.nextSibling, ri++) {
			var h = n.offsetHeight,
				sh = n.lastChild.offsetHeight,
				table = n.lastChild,
				rows = table.rows,
				len = rows.length;
			if (len > 1 && (h < sh || rows[len-1].id)) {
				if (rows[len-1].id && rows[len-1].id.startsWith(this.uuid + "-frow")) {
					jq(rows[len-1]).remove();
					len--;
				}
				rows[1].style.display = "";
				var nh = zk(rows[1]).offsetHeight();
				h -= zk(rows[0]).offsetHeight() + nh;

				var vc = Math.floor(h/nh),
					vc1 = vc,
					data = this._evtsData[ri];

				for (var i = 1; i < len; i++)
					rows[i].style.display = --vc < 0 ? 'none' : '';

				var faker = table.insertRow(len);
				faker.id = this.uuid + "-frow" + ri;
				for (var i = 7; i--;) {
					cell = faker.insertCell(0);
					cell.className = zcls + "-month-date-evt";
					jq(cell).addClass(zcls + "-evt-faker-more");
					if (data[i].length - vc1 > 0) {
						var evts = data[i];
						cell.innerHTML = "+" + (evts.length - vc1) + "&nbsp;" + msgcal.MORE;
						jq(cell).bind('click', widget.onMoreClick);
					} else {
						cell.innerHTML = "";
						jq(cell).addClass(zcls + "-evt-faker-nomore");
					}
				}
			}
		}
	},
		
	onSize: _zkf = function () {
		var woy = this.woy? this.$n('woy'): null,
			cmp = this.$n(); 

		if (woy) {
			var w = woy.offsetWidth,
				cnt = this.$n('cnt'),
				cs = cnt.style,
				ts = woy.previousSibling.style;
				
			ts.left = cs.left = jq.px(w);
			ts.width = cs.width = "";
			ts.width = cs.width = jq.px(cnt.offsetWidth - w);
		}
		this.clearGhost();
		
		var hgh = cmp.offsetHeight;
		if (hgh === 0) return;
		
		
		for(var child = cmp.firstChild;child;child=child.nextSibling){
			if(this.isLegalChild(child))
				hgh-=child.offsetHeight;
		}
		
		var inner = this.$n('inner');
		hgh = zk(inner.parentNode).revisedHeight(hgh);
		hgh = zk(inner).revisedHeight(hgh);
		if (hgh < 250) hgh = 250;
		inner.style.height = jq.px(hgh);
		if (zk.ie6_) {
			var inn = inner.firstChild;
			hgh = zk(inn).revisedHeight(hgh);
			hgh -= inn.firstChild.offsetHeight;
			hgh = zk(inn.lastChild).revisedHeight(hgh);
			inn.lastChild.style.height = jq.px(hgh);
			if (woy)
				woy.style.height = jq.px(hgh);
		}
		inner.style.overflowY = "visible";
		this.fixVisiHgh();
		this.closeFloats();
	},
	
	onShow: _zkf
},{
	_ignoredrag: function (dg, p, evt) {
		if (zk.processing) return true;
		var cnt = dg.node,
			widget = dg.control,
			zcls = widget.getZclass(),
			cls = zcls + "-evt-faker-more",
			ncls = zcls + "-evt-faker-nomore";

		widget.clearGhost();
		var n = evt.domTarget,
			targetWidget = zk.Widget.$(n),
			className = targetWidget.className;
			
		if (n.tagName == 'SPAN')
			if (jq(n).hasClass(zcls + "-month-date-cnt"))
				return true;

		if (n.nodeType == 1 && jq(n).hasClass(cls) && !jq(n).hasClass(ncls) || 
			((className == 'calendar.DaylongOfMonthEvent'|| className == 'calendar.DayOfMonthEvent')&& 
				(!n.parentNode || targetWidget.event.isLocked )))
				return true;

		return false;
	},
	
	_ghostdrag: function (dg, ofs, evt) {		
		var cnt = dg.node,
			widget = dg.control,
			targetWidget = zk.Widget.$(evt.domEvent),
			className = targetWidget.className,			
			ce = (className == 'calendar.DaylongOfMonthEvent'|| 
					className == 'calendar.DayOfMonthEvent')? targetWidget.$n(): null,
			zcls = widget.getZclass(),
			html = '<div id="' + widget.uuid + '-rope" class="' + zcls + '-month-dd">',
			rope = '<div class="' + zcls + '-dd-rope"></div>',
			hs = [];

		for (var n = cnt.firstChild; n; n = n.nextSibling) {
			html += rope;
			hs.push(n.offsetHeight);
		}

		html += '</div>';

		jq(document.body).prepend(html);

		var td = cnt.firstChild.firstChild.rows[0].firstChild,
			width = td.offsetWidth,
			p = [evt.pageX,evt.pageY];

		dg._zinfo = [];
		for (var left = 0, n = td; n; left += n.offsetWidth, n = n.nextSibling)
			dg._zinfo.push({l: left, w: n.offsetWidth});

		dg._zoffs = zk(cnt).revisedOffset();
		dg._zoffs = {
			l: dg._zoffs[0],
			t: dg._zoffs[1],
			w: dg.handle.offsetWidth,
			h: dg.handle.offsetHeight,
			s: dg._zinfo.length
		};

		if (ce) {
			var faker = ce.cloneNode(true), 
				event = targetWidget.event;
			faker.id = widget.uuid + '-dd';
			jq(faker).addClass(zcls + '-evt-faker-dd');
			
			var h = ce.offsetHeight;
			faker.style.width = jq.px(width);
			faker.style.height = jq.px(h);
			faker.style.left = jq.px(p[0] - (width / 2));
			faker.style.top = jq.px(p[1] + h);
			
			jq(targetWidget.$n()).addClass(zcls + '-evt-dd');
			
			var cloneNodes = targetWidget.cloneNodes;
			if (cloneNodes) 
				for (var n = cloneNodes.length; n--;) 
					jq(cloneNodes[n]).addClass(zcls + '-evt-dd');
			
			jq(document.body.firstChild).before(jq(faker));
			dg.node = jq('#' + widget.uuid + '-dd')[0];
			
			var bd = new Date(event.zoneBd.getTime()), 
				ed = new Date(event.zoneEd.getTime());
			
			if (ed.getHours() == 0 && ed.getMinutes() == 0 && ed.getSeconds() == 0) 
				ed = new Date(ed.getTime() - 1000);
			
			bd.setHours(0);
			bd.setMinutes(0);
			bd.setSeconds(0);
			bd.setMilliseconds(0);
			ed.setHours(23);
			ed.setMinutes(59);
			ed.setSeconds(59);
			ed.setMilliseconds(0);			
			
			dg._zdur = Math.ceil((ed.getTime() - bd.getTime()) / widget.DAYTIME);
			dg._zevt = ce;
		}
			
		dg._zdim = {w: width, h: hs[0], hs: hs};
		dg._zrope = jq('#' + widget.uuid + '-rope')[0];

		var x = p[0] - dg._zoffs.l,
			y = p[1] - dg._zoffs.t,
			cols = Math.floor(x/dg._zdim.w),
			rows = Math.floor(y/dg._zdim.h);

		dg._zpos = [cols, rows];

		// fix rope
		widget.fixRope_(dg._zinfo, dg._zrope.firstChild, cols, rows, dg._zoffs, dg._zdim, dg._zdur);
		return dg.node;	
	},
	
	_drawdrag: function (dg, p, evt) {
		if (dg.node.id.endsWith('-dd')) {
			var w = dg.node.offsetWidth,
				h = dg.node.offsetHeight,
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
			dg.node.style.left = jq.px(x);
			dg.node.style.top = jq.px(y);
		}
	},
	
	_changedrag: function (dg, p, evt) {		
		var widget = dg.control,
			x = p[0]
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
	
	_endghostDrag: function (dg, origin) {
		// target is Calendar's event
		dg.node = dg.handle;
	},
	
	_enddrag: function (dg, evt) {
		var widget = dg.control,
			cnt = dg.node,
			dg = widget._drag[cnt.id];
			
		if (dg) {
			var ce;
			if (dg._zevt) {
				var zcls = widget.getZclass(),
					targetWidget = zk.Widget.$(dg._zevt),
					event = targetWidget.event,
					bd = new Date(widget.zoneBd.getTime() + (dg._zoffs.s * dg._zpos1[1] + dg._zpos1[0]) * widget.DAYTIME),
					bd1 = new Date(event.zoneBd.getTime()),
					ddClass = zcls + '-evt-dd';

				jq(targetWidget.$n()).removeClass(ddClass);
				var cloneNodes = targetWidget.cloneNodes;
				if (cloneNodes) 
					for (var n = cloneNodes.length; n--;) 
						jq(cloneNodes[n]).removeClass(ddClass);
				
				bd.setHours(bd1.getHours());
				bd.setMinutes(bd1.getMinutes());
				bd.setSeconds(bd1.getSeconds());
				bd.setMilliseconds(0);
				bd1.setMilliseconds(0);				
				var offs = bd.getTime() - bd1.getTime();

				if (offs) {
					ce = dg._zevt;
					ce.style.visibility = "hidden";

					var ed = new Date(event.endDate.getTime());
					ed.setMilliseconds(0);					
					
					widget.fire("onEventUpdate", {
						data: [
							dg._zevt.id,
							event.beginDate.getTime() + offs,
							ed.getTime() + offs,
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
				var c = dg._zpos[0],
					r = dg._zpos[1],
					c1 = dg._zpos1[0],
					r1 = dg._zpos1[1],
					c2 = c < c1 ? c : c1,
					r2 = r < r1 ? r : r1,
					b = (dg._zoffs.s * r2 + c2) * widget.DAYTIME;

				var bd = new Date(widget._beginDate.getTime() + b),
					ed = new Date(bd.getTime() + dg._zpos1[2] * widget.DAYTIME);

				// clean
				bd.setMilliseconds(0);
				ed.setMilliseconds(0);
				widget.fire("onEventCreate", {
					data: [
						bd.getTime(),
						ed.getTime(),
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