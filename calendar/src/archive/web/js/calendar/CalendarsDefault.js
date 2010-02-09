/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.CalendarsDefault = zk.$extends(calendar.Calendars, {
	_scrollInfo: {},
	_drag: {},
	_ghost: {},
	_dateTime: [
		'00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
		'04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
		'08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
		'12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
		'16:00', '16:30', '17:00', '17:30',	'18:00', '18:30', '19:00', '19:30',
		'20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
		'00:00'
	],
	_dayEvents: [],
	_daylongEvents: [],
	_daylongSpace: [],
	_daySpace: [],	
	
	$define : {
		days: function(){
			if (!this.$n()) return;

			var days = this._days,
				header = this.$n("header"),
				hdRows = header.offsetParent.rows,
				hdLast = header.lastChild,
				row	= this.cntRows,
				daylongMoreRows = this.daylongMoreRows,
				ts =  this.ts,
				zcls = this.getZclass(),
				offset = days - daylongMoreRows.cells.length;
			
			jq(hdRows[1].firstChild).attr('colspan',days);
			jq(hdRows[2].firstChild).attr('colspan',days);
			jq(this.cntRows.previousSibling.lastChild).attr('colspan',days);

			if (offset > 0) {
				var titleRowHtml = '<th class="' + zcls + '-day-of-week"><div class="' + zcls+'-day-of-week-inner"><span class="'+zcls+'-day-of-week-cnt"></span></div></th>',
					daylongRowHtml = '<td class="' + zcls + '-daylong-evt ' + zcls + '-daylong-more">&nbsp;</td>',
					cntRowHtml ='<td class="' + zcls + '-week-day"><div class="' + zcls + '-week-day-cnt"/></td>';
				for(var i = offset; i--;) {
					jq(hdLast).before(titleRowHtml);
					jq(daylongMoreRows).append(daylongRowHtml);
					jq(row).append(cntRowHtml);
				}
			} else {
				for (var i = -offset; i--;) {
					jq(hdLast.previousSibling).remove();
					jq(daylongMoreRows.firstChild).remove();
					jq(row.lastChild).remove();
				}
			}
			if (zk.ie) {
				jq(document.body).append('<div id="' + this.uuid + '-tempblock"></div>');
				var temp = jq('#' + this.uuid + '-tempblock'), hdTable = header.offsetParent, parent = hdTable.parentNode
				cnt = this.$n('cnt'), cntTable = cnt.firstChild;

				temp.append(hdTable);
				temp.append(cntTable);
				jq(parent).append(hdTable);
				jq(cnt).append(cntTable);
				temp.remove();
			}
			this.title = jq(this.$n("header")).children().find('.' + this.getZclass() + '-day-of-week-cnt');
			this._updateDateRange();
		},
		readonly: function () {
			if (!this.$n()) return;
			var widget = this,
				cnt = this.$n("cnt");
			if (this._readonly) {
				// a trick for dragdrop.js
				cnt._skipped = false;
				jq(cnt).unbind('click');

				this._drag[cnt.id] = null;

				var daylong = this.$n("daylong");
				jq(daylong).unbind('click');

				// a trick for dragdrop.js
				daylong._skipped = false;
				this._drag[daylong.id] = null;
				jq(this.$n()).unbind('click', this.clearGhost);
			} else this._editMode();
		},
		events: function () {
			this._events = jq.evalJSON(this._events);
			if (!this.$n()) return;

			for (var i = this.nChildren; i--;) {
				var child = this.getChildAt(i),
					className = child.className;
				if (className == 'calendar.DayEvent' || className == 'calendar.DaylongEvent')
					this.removeChild(child);
			}

			this.createChildrenWidget_();
			this._rePositionDaylong();
			this._rePositionDay();
		},
		zones: function () {
			var oldZones;
			if (this.$n())
				oldZones = this._zonesOffset.$clone();

			this._zones = jq.evalJSON(this._zones);
			this._zonesOffset = jq.evalJSON(this.zonesOffset);
			this.ts = this._zones.length;
			for (var i = this._zonesOffset.length; i--;)
				this._zonesOffset[i] = zk.parseInt(this._zonesOffset[i]);

			if (!this.$n()) return;	

			this.updateDateOfBdAndEd_();
			
			var hdChildren = this.$n('header').children,
				timeRows = this.cntRows.cells;
			//reset time
			if (!oldZones || oldZones.$equals(this._zonesOffset)) return;

			this._captionByTimeOfDay = this.captionByTimeOfDay ? jq.evalJSON(this.captionByTimeOfDay): null;

			for (var i = this.ts; i--;) {
				var index = this.ts - i - 1,
					zoneText = jq(hdChildren[index]);

				if (zoneText.children().length) {
					var str = zoneText.html(),
						div = str.substr(str.indexOf('<'),str.length);
					zoneText.html(this._zones[index] + div);
					jq('#' + this.uuid + '-hdarrow').bind("click", this.onArrowClick);
				}
				else zoneText.html(this._zones[index]);

				//fist column is not need to redraw
				if (index == 0) continue;

				var current = new Date(),
					cell = jq(timeRows[index]).children();
				current.setMinutes(0);
				for (var k = 24; k--;) {
					current.setHours(k);
					var context = this._captionByTimeOfDay ?  this._captionByTimeOfDay[ index * 24 + k ]:
							zk.fmt.Date.formatDate(this.getTimeZoneTime(current,zk.parseInt(this._zonesOffset[index])),'HH:mm');

					jq(cell[k]).html(context);
				}
			}
		}
	},
	
	_prepareData: function () {
		this._captionByTimeOfDay = this.captionByTimeOfDay ? jq.evalJSON(this.captionByTimeOfDay): null;
		Date.prototype.getDOY = function() {//js day of year
			var onejan = new Date(this.getFullYear(),0,1);
			return Math.floor((this - onejan) / 86400000);
		}
	},
	
	bind_: function () {// after compose
		this.$supers('bind_', arguments);
		var widget = this,
			cnt = this.$n("cnt"),
			zcls = this.getZclass();
		
		//define all positions
		//put the title
		this.title = jq(this.$n("header")).children().find('.' + zcls + '-day-of-week-cnt');
		//put the daylong event
		this.daylongRows = this.$n('daylong').firstChild.firstChild;
		//put the daylong more space
		this.daylongMoreRows = this.daylongRows.firstChild;
		//put the day event
		this.cntRows = jq(cnt).contents().find("tr")[zk.ie ? 2: 1];
		
		this.weekDay = jq(this.cntRows).children('.'+ zcls +'-week-day');
		
		this.perHeight = this.cntRows.firstChild.firstChild.offsetHeight / 2;
		
		this.createChildrenWidget_();
		this._rePositionDaylong();
		this._rePositionDay();
		
/****************************** zone arrow ******************************/		
		var a = this.$n("hdarrow"),
			hd = this.$n("header"),
			title = this.title,
			ed = new Date(this._endDate.getTime());
		//store value in head tag
		for (var i = title.length; i--;) {
			ed.setTime(ed.getTime() - this.DAYTIME);
			title[i].time = ed.getTime();
		}
		//arrow position
		a.style.left = jq.px((a.parentNode.offsetWidth * this.ts - a.offsetWidth) - 5);		
		jq(a).bind("click", this.onArrowClick);
/************************** head event **************************************/		
		if (hd.childNodes.length > this.ts + 2)
			this.addDayClickEvent_(hd);

		jq(cnt).bind("scroll", function () {
			widget._scrollInfo[widget.uuid] = cnt.scrollTop;
		});
		
		if (!this._readonly)
			this._editMode();
	},
	
	unbind_ : function () {			
		this.title =  this.daylongRows =  this.daylongMoreRows = this.cntRows =null
		this.$supers('unbind_', arguments);
	},
	
	cleanEvtAry_: function () {
		this._daylongEvents = [];
		this._dayEvents = [];
	},
	
	processChildrenWidget_: function (isExceedOneDay, event) {
		var dayEvent = isExceedOneDay ?
						new calendar.DaylongEvent({event:event}):
						new calendar.DayEvent({event:event});
								
		this.appendChild(dayEvent);					
		this[isExceedOneDay ? '_daylongEvents': '_dayEvents'].push(dayEvent.$n());				
	},
		
	_resetDaylongPosition: function () {
		var daylongRows = jq(this.daylongRows),
			zcls = this.getZclass();		
		//clean all rows exclusive blank row 
		daylongRows.children().not(':last-child').remove();
		
		// append all rows		
		for (var i = this._daylongSpace.length; i--;) {
			daylongRows.prepend('<tr></tr>');
			var rowSpace = this._daylongSpace[i],
				tr = jq(daylongRows[0].firstChild);	
			//append events
			for (var k = 0, l = rowSpace.length; k < l; k++) {
				var childWgt = rowSpace[k],
					ce = childWgt;
					
				if (k == 0){//first		
					ce._days = childWgt._days;		
					this.drawEvent_(childWgt._preOffset, zcls + '-daylong-evt', tr, ce);
				} else {
					var preWidget = rowSpace[k-1],
						start = childWgt._preOffset,
						preEnd = preWidget._preOffset + preWidget._days,
						offset = start - preEnd;
					ce._days = childWgt._days;
					this.drawEvent_(offset, zcls + '-daylong-evt', tr, ce);
				}
				ce.style.visibility = "";//recover moving event
				if (k == l - 1) {//last
					var html = '';
					for (var n = childWgt._afterOffset; n--;) 
						html += '<td class="' + zcls + '-daylong-evt">&nbsp;</td>';
					tr.append(html);
				}
			}
		}
		jq('#' + this.uuid + '-hdarrow').removeClass(this.getZclass() + '-week-header-arrow-close');
	},	
	
	_rePositionDay: function () {	
		this._dayEvents.sort(this.dateSorting_);	
		this._daySpace = [];
			
		for (var i = this._days; i--;)
			this._daySpace.push([]);
				
		// all daylong event
		for (var i = 0 ,j = this._dayEvents.length; i < j; i++) {
			var dayEvent = this._dayEvents[i];
			this._daySpace[dayEvent._preOffset].push(dayEvent);
		}
		this.fixPosition();		
	},
	
	_rePositionDaylong: function () {	
		this._daylongEvents.sort(this.dateSorting_);
		this._daylongSpace = [];		
		
		jq(document.body).append(this.blockTemplate);		
		var temp = jq('#' + this.uuid + '-tempblock');
		
		// all daylong event
		for (var i = this._daylongEvents.length; i--;) {
			var daylongEvent = this._daylongEvents[i];
			temp.append(daylongEvent);
			this.putInDaylongSpace_(this._daylongSpace, daylongEvent);
		}
						
		this._resetDaylongPosition();
		temp.remove();
	},
	
	_editMode: function () {
		var widget = this,
			cnt = this.$n("cnt");
		// a trick for dragdrop.js
		cnt._skipped = true;
		jq(cnt).bind('click', function(evt) {
			if (!zk.dragging && !zk.processing) {
				widget.clearGhost();
				widget.onClick(cnt, evt);
			} else
				evt.stop() ;
		});			
			
		// day drag
		var caldef = this.$class,
			cal = calendar.Calendars;
		this._drag[cnt.id] = new zk.Draggable(this, cnt, {
			starteffect: widget.closeFloats,
			endeffect: caldef._enddrag,
			ghosting: caldef._ghostdrag,
			endghosting: caldef._endghostdrag,
			draw: caldef._drawdrag,
			ignoredrag: caldef._ignoredrag
		});

		var daylong = this.$n("daylong");
		jq(daylong).bind('click', function(evt) {
			if (!zk.dragging && !zk.processing) {
				widget.clearGhost();
				widget.onDaylongClick(daylong, evt);
			} else
				evt.stop();
		});

		// daylong drag
		daylong._skipped = true;
		this._drag[daylong.id] = new zk.Draggable(this,daylong, {
			starteffect: widget.closeFloats,
			endeffect: caldef._endDaylongDrag,
			ghosting: caldef._ghostDaylongDrag,
			endghosting: caldef._endghostDaylongDrag,
			change: cal._changedrag,
			draw: cal._drawdrag,
			ignoredrag: caldef._ignoreDaylongDrag
		});
		jq(this.$n()).bind('click', this.proxy(this.clearGhost));
	},
		
	_updateDateRange: function () {
		this.updateDateOfBdAndEd_();
			
		this._captionByDate = this.captionByDate ? jq.evalJSON(this.captionByDate): null;
		if(!this.$n())return;
		
		var hd = jq(this.$n("header")),
			cnt = jq(this.$n("cnt")),
			titles = this.title,
			ts = this.ts,				
			ed = new Date(this._endDate.getTime()),
			current = new Date(),
			week_day = this.getZclass() + "-week-day",
			week_today = this.getZclass() + "-week-today",		
			week_weekend = this.getZclass() + "-week-weekend",
			weekDay = this.cntRows.cells;
		
		//remove today and weekend class
		hd.children().find('.' + week_weekend).removeClass(week_weekend);
		hd.children().find('.' + week_today).removeClass(week_today);
		cnt.children().find('.' + week_weekend).removeClass(week_weekend);
		cnt.children().find('.' + week_today).removeClass(week_today);
		
		for (var i = this._days; i--;) {
			ed.setTime(ed.getTime() - this.DAYTIME);
			var title = titles[i],
				content = this._captionByDate ? this._captionByDate[i] : 
								zk.fmt.Date.formatDate(ed,'EEE MM/d');	
			jq(title).html(content);
			title.time = ed.getTime();
			if (ed.getDay() == 0 || ed.getDay() == 6) {//SUNDAY or SATURDAY
				jq(title.parentNode).addClass(week_weekend);
				jq(weekDay[i + ts]).addClass(week_weekend);
			}
		
			if (current.getFullYear() == ed.getFullYear() &&
					current.getDOY() == ed.getDOY()) {// today
				jq(title.parentNode).addClass(week_today);
				jq(weekDay[i + ts]).addClass(week_today);
			}
		}
	},
				
	setAddDayEvent: function (eventArray) {	 	
        eventArray = jq.evalJSON(eventArray);      
		if (!eventArray.length) return; 
		
		this.clearGhost();
		
		var addDay,
			addDaylong;		
		
        for (var event; (event = eventArray.shift());) {
        	event = this.processEvtData_(event);
        	var bd = event.zoneBd,
				ed = event.zoneEd;
			
			//over range
			if (bd > this.zoneEd || ed < this.zoneBd) continue;			
				
			if (this.isExceedOneDay_(bd,ed)){
				dayEvent = new calendar.DaylongEvent({event:event});
				this.appendChild(dayEvent);						
				this._daylongEvents.push(dayEvent.$n());	
				addDaylong = true;
			} else {
				dayEvent = new calendar.DayEvent({event:event});
				this.appendChild(dayEvent);	
				this._dayEvents.push(dayEvent.$n());	
				addDay = true;
			}           
					
        }
		if (addDay)			
			this._rePositionDay();
		
		if (addDaylong)
			this._rePositionDaylong();
    },
    
    setModifyDayEvent: function (eventArray) {      
        eventArray = jq.evalJSON(eventArray);      
        if (!eventArray.length) return;   
		     
		var modDay,
			modDaylong;	
			 
        for (var event; (event = eventArray.shift());) {
			var childWidget = zk.Widget.$(event.id);
			
			event = this.processEvtData_(event);
        	var bd = event.zoneBd,
				ed = event.zoneEd;
			
			//over range
			if (bd > this.zoneEd || ed < this.zoneBd) {
				if (childWidget.className == 'calendar.DayEvent') {
					this._dayEvents.$remove(childWidget);
					modDay = true;
				} else {
					this._daylongEvents.$remove(childWidget);	
					modDaylong = true;
				}
				this.removeChild(childWidget);     
				continue;
			}			
			
			if (this.isExceedOneDay_(bd,ed)) {
				if (childWidget.className == 'calendar.DayEvent'){//day to daylong
					this._dayEvents.$remove(childWidget);		
					this.removeChild(childWidget); 					
					
					var daylongEvent = new calendar.DaylongEvent({event:event});
					this.appendChild(daylongEvent);
					this._daylongEvents.push(daylongEvent.$n());	
					modDay = true;
					modDaylong = true;
				} else {//daylong update				
					childWidget.event = event;	
					childWidget.update();
					modDaylong = true;
				}					
			} else if (childWidget.className == 'calendar.DaylongEvent') {//daylong to day
					this._daylongEvents.$remove(childWidget);		
					this.removeChild(childWidget); 					
				
					var dayEvent = new calendar.DayEvent({event:event});
					this.appendChild(dayEvent);	
					this._dayEvents.push(dayEvent.$n());	
					modDay = true;
					modDaylong = true;
			} else {//day update
				childWidget.event = event;	
				childWidget.update();
				modDay = true;
			}     	
        }
		
		if (modDay)		
			this._rePositionDay();		
		
		if (modDaylong)
			this._rePositionDaylong();		
    },
    
    setRemoveDayEvent: function (eventArray) {       
        eventArray = jq.evalJSON(eventArray);      
        if (!eventArray.length) return;
		
		var rmDay,
			rmDaylong;	
			
        for (var event; (event = eventArray.shift());) {
			var childWidget = zk.Widget.$(event.id);
			
			if (childWidget.className == 'calendar.DayEvent') {
				this._dayEvents.$remove(childWidget);
				rmDay = true;
			} else {				
				this._daylongEvents.$remove(childWidget);	
				rmDaylong = true;
			}
			this.removeChild(childWidget);      
		}
		
		if(rmDay)			
			this._rePositionDay();			
		
		if (rmDaylong)			
			this._rePositionDaylong();		
    },
	
	onClick: function (cnt, evt) {
		var widget = zk.Widget.$(cnt),
			p = [evt.pageX,evt.pageY];

		if (!cnt._lefts || p[0] <= cnt._lefts[0]) return;

		var ce = zk.Widget.$(evt.target).event;
		
		if (ce) {
			widget.fire("onEventEdit",{
				data: [ce.id,p[0],p[1], jq.innerWidth(),jq.innerHeight()]});
		} else {
			var ts = widget.ts,
				row = widget.cntRows,
				cells = row.cells,
				width = row.cells[0].offsetWidth,
				offs = zk(cnt).revisedOffset(),
				ph = widget.perHeight;
				x = p[0],
				y = p[1],
				cIndex = cells.length - ts,
				rows = Math.floor((y + cnt.scrollTop - offs[1]) / ph);

			for (; cIndex--;)
				if (cnt._lefts[cIndex] <= x)
					break;

			if (cIndex < 0)
				cIndex = 0;

			jq(cells[ts + cIndex].firstChild).prepend(
				widget.ddTemplate.replace(new RegExp("%([1-2])", "g"), function (match, index) {
					return index < 2 ? widget.uuid + '-dd' : 'z-calevent';
				})
			);

			var faker = jq('#'+widget.uuid+'-dd')[0];
			jq(faker).addClass(widget.getZclass() + "-evt-ghost");

			faker.style.top = jq.px(rows * ph);

			var offsHgh = 0,
				body = jq('#'+widget.uuid+'-dd-body')[0],
				height = 0,
				inner = body.firstChild.firstChild;

			inner.firstChild.innerHTML = widget._dateTime[rows] + ' - ' + widget._dateTime[rows + 2];

			for (var child = jq(faker).children().get(0);child;child=child.nextSibling) {
				if (this.isLegalChild(child)) 
					height+=child.offsetHeight;
			}

			height += zk(body).padBorderHeight();
			height += zk(body.firstChild).padBorderHeight();
			height += zk(inner).padBorderHeight();
			height += 2;
			inner.style.height = jq.px((ph*2) - height);

			var days = cIndex * widget.DAYTIME,
				bd = new Date(widget._beginDate.getTime() + days),
				bd1 = new Date(widget.zoneBd.getTime() + days),
				ofs = widget._getTimeOffset(bd1, false, rows),
				ofs1 = widget._getTimeOffset(bd1, false, rows+2);				
			// clean
			bd.setMilliseconds(0);

			widget.fire("onEventCreate", {
   				 data: [
				 	bd.getTime() + ofs, 
					bd.getTime() + ofs1, 
					p[0], 
					p[1], 
				 	jq.innerWidth(), 
				 	jq.innerHeight()
				 ]});

			widget._ghost[widget.uuid] = function () {
				jq('#'+widget.uuid+'-dd').remove();
				delete widget._ghost[widget.uuid];
			};
		}
		widget.closeFloats();
		evt.stop();
	},
	
	onDaylongClick: function (daylong, evt) {
		
		var widget = zk.Widget.$(daylong),
			ce = zk.Widget.$(evt.target).event;
			
		if (ce) {		
			widget.fire("onEventEdit",{
				data: [ce.id,evt.pageX,evt.pageY, jq.innerWidth(),jq.innerHeight()]});				
		} else {
			var zcls = widget.getZclass(),
				html = '<div id="'+ widget.uuid + '-rope" class="' + zcls + '-daylong-dd">'
					 + '<div class="' + zcls + '-dd-rope"></div></div>';

			jq(document.body).prepend(html);

			var row = daylong.firstChild.firstChild.lastChild,
				width = row.firstChild.offsetWidth,
				offs = zk(daylong).revisedOffset(),
				p = [evt.pageX,evt.pageY],
				cols = Math.floor((p[0] - offs[0])/width),
				b = cols * widget.DAYTIME,
				bd = new Date(widget._beginDate.getTime() + b);

			var zinfo = [];
			for (var left = 0, n = row.firstChild; n;
					left += n.offsetWidth, n = n.nextSibling)
				zinfo.push({l: left, w: n.offsetWidth});

			var zoffs = {
				l: offs[0],
				t: offs[1],
				w: daylong.offsetWidth,
				h: daylong.offsetHeight,
				s: zinfo.length
			};

			widget.fixRope_(zinfo, jq('#'+widget.uuid+"-rope")[0].firstChild, cols,
				0, zoffs, {w: width, h: daylong.offsetHeight, hs:[daylong.offsetHeight]}, 1);

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
		
	onArrowClick: function (evt) {
		var a = evt.currentTarget,
			$a = jq(a),
			widget = zk.Widget.$(a),
			zcls = widget.getZclass(),
			cls = zcls + "-week-header-arrow-close";
			isClose = $a.hasClass(cls),
			daylong = widget.$n("daylong"),
			rows = daylong.firstChild.rows,			
			len = rows.length;
			
		widget.clearGhost();
		
		isClose ? $a.removeClass(cls): $a.addClass(cls);
				
		if (len < 2) return; // nothing to do

		if (!isClose) {
			var data = [],
				datas = rows[len-1].cells.length;
			for (var i = 0, c = datas; c--; i++)
				data[i] = [];

			for (var i = 0, j = len - 1; i < j; i++) {
				for (var k = 0, z = 0, cells = rows[i].cells,
						cl = cells.length; k < cl && z + k < datas; k++) {
					if (cells[k].firstChild.id)
						data[k+z].push(cells[k].firstChild);
					var cols = cells[k].colSpan;
					while (--cols > 0)
						data[k+ ++z].push(cells[k].firstChild);
				}
				rows[i].style.display = "none";
			}

			var faker = daylong.firstChild.insertRow(len - 1);
			for (var i = datas; i--;) {
				cell = faker.insertCell(0);
				cell.className = rows[len].cells[i].className;
				jq(cell).addClass(zcls + "-daylong-faker-more");
				if (data[i].length > 0) {
					var evts = data[i];
					cell.innerHTML = "+" + evts.length + "&nbsp;" + msgcal.MORE;
					jq(cell).bind("click", widget.onMoreClick);
				} else {
					cell.innerHTML = zk.ie ? "&nbsp;" : "";
					jq(cell).addClass(zcls + "-daylong-faker-nomore");
				}
			}
			widget._evtsData = data;
		} else {
			for (var i = 0, j = len - 1; i < j; i++)
				rows[i].style.display = "";
			jq(rows[len - 2]).remove();
		}

		// recalculate
		widget.beforeSize(widget.$n());
		widget.onSize(widget.$n());
		
		evt.stop();
	},
	
	onMoreClick: function (evt) {
		var cell = evt.target,
			widget = zk.Widget.$(cell),
			daylong = cell.parentNode.parentNode.parentNode.parentNode,
			uuid = widget.uuid,
			ci = cell.cellIndex,
			pp,
			table = jq('#'+widget.uuid+'-ppcnt')[0];		
		
		widget.clearGhost();	
		if (!widget._pp) {
			jq(document.body).append(widget.ppTemplate.replace(new RegExp("%([1-2])", "g"), function (match, index) {
					return index < 2 ? uuid : 'z-calpp';
			}));			
			pp = widget._pp = jq('#'+uuid+'-pp')[0];
			jq(document.body).bind('click', widget.proxy(widget.unMoreClick));
			table = jq('#'+uuid+'-ppcnt')[0]; 		
			
			if(!widget._readonly)
				jq(widget._pp).bind("click", widget.proxy(widget.onPopupClick));
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
		var offs= zk(cell).revisedOffset(),
			wd = daylong.offsetWidth,
			csz = cell.parentNode.cells.length,
			single = wd/csz;

		wd = csz > 2 ? single*3*0.9 : wd * 0.8;

		if (csz > 2 && ci > 0)
			if (csz > ci+1)
				pp.style.left = jq.px(offs[0] - (wd - single)/2);
			else
				pp.style.left = jq.px(offs[0] - (wd - single));
		else if (csz > 2)
			pp.style.left = jq.px(offs[0]);
		else pp.style.left = jq.px(offs[0] + (single * 0.1));

		pp.style.top = jq.px(offs[1] + zk(cell).offsetHeight() + 1);
		pp.style.width = jq.px(wd);

		//filling data
		var evts = widget._evtsData[ci],
			oneDay = widget.DAYTIME,
			bd = widget.zoneBd,
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
			cl.className = "z-calpp-evt-l";
			if (bd.getTime() + (oneDay * ci) - ce._bd.getTime() >= 1000) {
				var info = [
						ce.id + "-fl",
						zcls,
						zcls + "-left",
						ce._bd.getMonth() + 1 + "/" + ce._bd.getDate(),
						hc ? ' style="background:' + hc + '"' : '',
						cc ? ' style="background:' + cc + '"' : '',
						cc ? ' style="border-bottom-color:' + cc + ';border-top-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + '"' : '',
					];				
				cl.innerHTML = widget.evtTemplate.replace(new RegExp("%([1-8])", "g"), function (match, index) {
					return info[index - 1];
				});
			} else
				cl.innerHTML = "";
		
			cm.className = "z-calpp-evt-m";
			
			var faker = ce.cloneNode(true);
			jq(faker).addClass("z-calpp-evt-faker");
			cm.appendChild(faker);

			cr.className = "z-calpp-evt-r";
			if (ce._ed.getTime() - (ed.getTime() + (oneDay * ci)) >= 1000) {
				var d = new Date(ce._ed.getTime() - 1000),
					info = [
						ce.id + "-fr",
						zcls,
						zcls + "-right",
						d.getMonth() + 1 + "/" + d.getDate(),
						hc ? ' style="background:' + hc + '"' : '',
						cc ? ' style="background:' + cc + '"' : '',
						cc ? ' style="border-bottom-color:' + cc + ';border-top-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + '"' : ''
					];				
				cr.innerHTML = widget.evtTemplate.replace(new RegExp("%([1-8])", "g"), function (match, index) {
					return info[index - 1];
				});
			} else
				cr.innerHTML = "";			
		}
		zk(pp).cleanVisibility();		
		evt.stop();
	},
			
	unMoreClick: function (evt) {
		if (!zUtl.isAncestor(this._pp, evt.currentTarget))
			this.closeFloats();
	},
			
	getTimeIndex: function (date) {
		return (date.getHours() * 2) + (date.getMinutes() >= 30 ? 1 : 0);
	},
	
	_getTimeOffset: function (d, dur, dur2) {
		var d1 = new Date(d.getTime()),
			index = dur2 ? dur2 : this.getTimeIndex(d) + dur;

		d1.setHours(Math.floor(index/2));
		d1.setMinutes(index%2 ? 30: 0);
		d1.setMilliseconds(0);
		d.setMilliseconds(0);

		return dur2 ? d1.getTime() - d.getTime() : d.getTime() - d1.getTime();
	},	
	
	fixPosition: function () {		
		var cnt = this.$n("cnt"),
			row = this.cntRows,
			perHgh = this.perHeight * 2,
			weekDay = this.weekDay;		
		
		for (var i =  this._daySpace.length; i--;) {
			var list = this._daySpace[i];
			if (!list.length) continue;
			
			var data = [];
			for (var n = 48; n--;) 
				data[n] = [];

			for (var k = list.length; k--;) {
				var ce = list[k],
					childWidget = zk.Widget.$(ce),					
					target= weekDay[ce._preOffset].firstChild,
					event = childWidget.event,
					bd = new Date(event.zoneBd.getTime()), 
					ed = new Date(event.zoneEd.getTime());
					
				jq(target).append(ce);	
				ce.style.visibility = "";				
				
				ce._bd = bd;
				ce._ed = ed;
				
				// cross day
				if (ed.getDate() != bd.getDate())
					ed = new Date(ed.getTime() - 1000);
				
				// fix hgh
				var top = bd.getHours() * perHgh + (bd.getMinutes() * perHgh / 60), 
					bottom = ed.getHours() * perHgh + (ed.getMinutes() * perHgh / 60), 
					height = bottom - top, 
					body = childWidget.$n('body'), 
					hd = childWidget.$n('hd');
				
				ce.style.top = jq.px(top);
				
				for (var child = jq(ce).children()[0]; child; child = child.nextSibling) {
					if (this.isLegalChild(child)) 
						height -= child.offsetHeight;
				}
				
				height = zk(body).revisedHeight(height);
				height = zk(body.firstChild).revisedHeight(height);
				var inner = body.firstChild.firstChild;
				height = zk(inner).revisedHeight(height - 2);
				inner.style.height = jq.px(height);
				
				// width info
				var bi = this.getTimeIndex(bd), 
					ei = this.getTimeIndex(ed);
				
				ce._bi = bi;
				ce._ei = ei;
				
				for (var n = 0; bi < ei && bi < 48;) {
					var tmp = data[bi++];
					if (tmp[n]) {
						for (;;) {
							if (!tmp[++n]) 
								break;
						}
					}
					tmp[n] = ce;
				}
			}
			
			this.clearGhost();
			
			// fix width			
			var childWidget = list[list.length - 1],
				target = weekDay[childWidget._preOffset].firstChild;
				
			for (var ce = target.firstChild; ce; ce = ce.nextSibling) {
				var	bd = ce._bd, 
					bi = ce._bi, 
					ei = ce._ei, 
					maxSize = 0, 
					tmp = {};
				
				for (var m = bi; m < ei && m < 48; m++) {
					var len = data[m].length;
					if (maxSize < len) 
						maxSize = len;
					for (var n = 0; n < len; n++) {
						if (!data[m][n] || tmp[data[m][n].id]) 
							continue;
						tmp[data[m][n].id] = 1;
						var ei2 = data[m][n]._ei;
						if (ei < ei2) 
							ei = ei2;
					}
				}
				var len = maxSize? maxSize: 1, 
					width = 100 / len,
					index = data[bi].indexOf(ce);
				if (index == maxSize - 1) 
					ce.style.width = width + "%";
				else 
					ce.style.width = (width * 1.7) + "%";
				ce.style.left = width * index + "%";
				
				var fce = ce.previousSibling, 
					moved = false;				
				
				// adjust the order
				while (fce) {						
					if (data[fce._bi].indexOf(fce) > index) {
						fce = fce.previousSibling;
						moved = true;
					} else {
						if (moved) {
							var next = ce.nextSibling;
							jq(fce).after(jq(ce));
							ce = next ? next.previousSibling : ce;
						}
						break;
					}
				}				
			}
		}
	},	
		
	beforeSize: zk.ie6_ ? function (cmp) {
		var inner = this.$n("inner");
		inner.style.height = "0px";
		inner.lastChild.style.height = "0px";
	} : function () {return false;},
	
	onSize: _zkf = function () {
		var cmp = this.$n();
		this.clearGhost();
		var hgh = cmp.offsetHeight;
		if (!hgh) return;		
		
		for (var child = cmp.firstChild;child;child=child.nextSibling) {
			if (this.isLegalChild(child))
				hgh-=child.offsetHeight;
		}
		
		var inner = this.$n("inner");
		hgh = zk(inner.parentNode).revisedHeight(hgh);
		hgh = zk(inner).revisedHeight(hgh);
		inner.style.height = jq.px(hgh);
		hgh -= inner.firstChild.offsetHeight;
		hgh = zk(inner.lastChild).revisedHeight(hgh);
		inner.lastChild.style.height = jq.px(hgh);

		// sync scrollTop
		var cnt = this.$n("cnt"),
			row = this.cntRows;
		cnt.scrollTop = this._scrollInfo[cmp.id];

		var offs = zk(cnt).revisedOffset(),
			cells = row.cells,
			lefts = [];
		for (var s = this.ts, l = offs[0], n = cells[0]; n; n = n.nextSibling) {
			l += n.offsetWidth;
			if (--s <= 0)
				lefts.push(l);
		}
		cnt._lefts = lefts;

		this.closeFloats();

		// scrollbar width
		var width = cnt.offsetWidth - cnt.firstChild.offsetWidth,
			table = cnt.previousSibling.firstChild;
		table.rows[0].lastChild.style.width = jq.px(zk(table.rows[1].firstChild).revisedWidth(width));
	},
		
	onShow: _zkf
},{	
/********************** day drag ********************************************/
	
	_ignoredrag: function (dg, p, evt) {
		var cnt = dg.node,
			widget = dg.control;
		
		if (zk.processing || !cnt._lefts || p[0] <= cnt._lefts[0] || p[0] > cnt._lefts[cnt._lefts.length-1])
			return true;

		// clear ghost
		widget.clearGhost();
		var n = evt.domTarget,
			targetWidget = zk.Widget.$(n);			
			
		if (targetWidget.className == 'calendar.DayEvent' && (!n.parentNode || targetWidget.event.isLocked ))
			return true;				
		else if (n.nodeType == 1 && jq(n).hasClass("z-calevent-resizer-icon")) {		
			if (widget._drag[cnt.id])
				widget._drag[cnt.id]._zrz = true;
		}
		return false;
	},
	
	_ghostdrag: function (dg, ofs, evt) {
		var cnt = dg.node,
			widget = dg.control,
			targetWidget = zk.Widget.$(evt.domEvent),
			ce = targetWidget.className == 'calendar.DayEvent'? targetWidget.$n(): null,
			ts = widget.ts,
			row = widget.cntRows,
			cells = row.cells,
			ph = widget.perHeight;

		dg._zcells = cells;
		dg._zoffs = zk(cnt).revisedOffset();
		dg._zoffs = {
			t: dg._zoffs[1],
			h: cnt.offsetHeight,
			s: cells.length - ts, // the size of the event column
			b: ts, // begin index
			ph: ph, // per height
			th: cells[ts].firstChild.offsetHeight // total height
		}

		if (!ce) {
			var x = evt.pageX,
				y = evt.pageY,
				y1 = dg._zoffs.t,
				cIndex = dg._zoffs.s,
				begin = dg._zoffs.b;

			for (; cIndex--;)
				if (cnt._lefts[cIndex] <= x)
					break;
			if (cIndex < 0)
				cIndex = 0;
			jq(cells[begin + cIndex].firstChild).append(
				widget.ddTemplate.replace(new RegExp("%([1-2])", "g"), function (match, index) {
					return index < 2 ? widget.uuid + '-dd' : 'z-calevent';
			}));

			dg._zoffs.x = x;
			dg._zoffs.y = y;

			dg.node = jq('#'+widget.uuid+'-dd')[0];
			dg.node.parent = jq(cells[begin + cIndex].firstChild);

			dg._zecnt = dg.node.childNodes[2].firstChild.firstChild;
			jq(dg.node).addClass(widget.getZclass() + "-evt-ghost");
			var r = y + dg.handle.scrollTop - y1;
			r = Math.floor(r / ph);
			dg.node.style.top = jq.px(r * ph);

			var offsHgh = 0,
				body = jq('#'+widget.uuid+'-dd-body')[0],
				height = 0,
				inner = body.firstChild.firstChild;

			inner.firstChild.innerHTML = widget._dateTime[r] + ' - ' + widget._dateTime[r + 2];			
			
			for(var child = jq(dg.node).children().get(0);child;child=child.nextSibling){
				if(widget.isLegalChild(child)) 
					height+=child.offsetHeight;
			}

			height += zk(body).padBorderHeight();
			height += zk(body.firstChild).padBorderHeight();
			height += zk(inner).padBorderHeight();
			height += 2;
			dg._zrzoffs = height;

			// begin index
			dg._zoffs.bi = r;
			// end index
			dg._zoffs.ei = r + 2;

			inner.style.height = jq.px((ph * 2) - height);
			dg._zhd = inner.firstChild;
		} else {
			var faker = ce.cloneNode(true);
			faker.id = widget.uuid + '-dd';

			//reset
			ce.parentNode.appendChild(faker);
			ce.style.visibility = "hidden";
			dg.node = jq('#'+widget.uuid+'-dd')[0];

			dg._zevt = ce;
			dg._zhd = dg.node.childNodes[2].firstChild.firstChild.firstChild;
			if (dg._zrz) {
				dg._zrzoffs = dg.node.offsetHeight + 2 - dg._zhd.parentNode.offsetHeight;
				dg._zecnt = dg.node.childNodes[2].firstChild.firstChild;
			} else
				dg._zdelta = ce.offsetTop - (evt.pageY + dg.handle.scrollTop - dg._zoffs.t);

			// begin index
			dg._zoffs.bi = Math.floor(ce.offsetTop / ph);
			// end index
			dg._zoffs.ei = Math.ceil(ce.offsetHeight / ph);
		}		
		return dg.node;	
	},

	_drawdrag: function (dg, p, evt) {
		var widget = dg.control,
			h = dg.node.offsetHeight,
			x = evt.pageX,
			y = evt.pageY,
			y1 = dg._zoffs.t,
			h1 = dg._zoffs.h,
			cIndex = dg._zoffs.s,
			lefts = dg.handle._lefts,
			cells = dg._zcells,
			begin = dg._zoffs.b
			ph = dg._zoffs.ph,
			th = dg._zoffs.th,
			delta = dg._zevt && !dg._zrz ? ph : 0;

		// avoid the wrong mousemove event in IE6.
		if (zk.ie6_ && dg._zoffs.x && x == dg._zoffs.x && dg._zoffs.y == y) {
			dg._zoffs.x = null;
			return;
		}

		// fix scroll bar
		var move = 0, steps;
		if (y - ph < y1) {
			clearInterval(widget.run);
			move = dg.handle.scrollTop;
			steps = ph;
		} else if (y + ph > y1 + h1) {
			clearInterval(widget.run);
			move = dg.handle.scrollHeight - dg.handle.scrollTop - dg.handle.offsetHeight;
			steps = -ph;
		} else clearInterval(widget.run);

		if (move > 0)
			widget.run = setInterval(function () {
				if (move <= 0) {
					clearInterval(widget.run);
					return;
				}
				dg.handle.scrollTop -= steps;
				move -= (steps < 0 ? -steps : steps);
			}, 100);
		if (dg._zevt) {
			if (!dg._zrz) {
				for (; cIndex--;)
					if (lefts[cIndex] <= x)
						break;

				if (cIndex < 0)
					cIndex = 0;

				if (cells[begin + cIndex].firstChild != dg.node.parentNode) {
					cells[begin + cIndex].firstChild.appendChild(dg.node);
					if (!dg._zchanged) widget.$class._resetPosition(dg.node, widget);
					dg._zchanged = true;
				}

				if (y + dg._zdelta + dg.handle.scrollTop - y1 < 0) {
					y = 0 - dg.handle.scrollTop - dg._zdelta + y1;
				}
				if (y + dg._zdelta + h + dg.handle.scrollTop - y1 >= th) {
					y = (th - h - dg.handle.scrollTop) + y1 - dg._zdelta;
				}

				var r = y + dg._zdelta + 5 + dg.handle.scrollTop - y1;
				r = Math.floor(r / (ph));
				if (dg.node.offsetTop != r * ph) {
					dg.node.style.top = jq.px(r * ph);
					if (!dg._zchanged) widget.$class._resetPosition(dg.node, widget);
					dg._zchanged = true;
				}

				// Update header
				dg._zhd.innerHTML = widget._dateTime[r] + ' - ' + widget._dateTime[r + dg._zoffs.ei];
			} else {
				if (y + ph > y1 + h1)
					y = y1 + h1 - ph;

				var r = y + dg.handle.scrollTop - y1;

				r = Math.ceil(r / (ph));

				var height = (r * ph - dg.node.offsetTop) - dg._zrzoffs;

				if (height < 0) {
					height = ph - dg._zrzoffs;
					r = dg._zoffs.bi + 1;
				}
				if (dg._zecnt.offsetHeight != height) {
					dg._zecnt.style.height = jq.px(height);
					if (!dg._zchanged) widget.$class._resetPosition(dg.node, widget);
					dg._zchanged = true;
				}

				// Update header
				dg._zhd.innerHTML = widget._dateTime[dg._zoffs.bi] + ' - ' + widget._dateTime[r];
			}
		} else {
			if (y < y1)
				y = y1;
			else if (y + ph > y1 + h1)
				y = y1 + h1 - ph;

			var r = Math.ceil((y + dg.handle.scrollTop - y1) / ph),
				b = dg._zoffs.bi,
				e = dg._zoffs.ei;

			if (r < b)
				b = r;
			else if (r > b)
				e = r;

		 	if (dg.node.offsetTop != b * ph)
				dg.node.style.top = jq.px(b * ph);

			var hgh = ((e - b) * ph) - dg._zrzoffs;
			if (dg._zecnt.offsetHeight != hgh)
				dg._zecnt.style.height = jq.px(hgh);

			// Update header
			dg._zhd.innerHTML = widget._dateTime[b] + ' - ' + widget._dateTime[e];
		}
	},

	_endghostdrag: function (dg, origin){
        var widget = dg.control,
			cnt = dg.handle, 
			row = widget.cntRows,
			hgh = dg._zoffs.ph,
			gostNode = dg.node;
        
        if (dg._zevt) {
			gostNode.parent = jq(gostNode.parentNode);
            dg._zdata = {
                rows: (dg._zevt.offsetTop - dg.node.offsetTop) / hgh,
                cols: dg._zevt.parentNode.parentNode.cellIndex -
                dg.node.parentNode.parentNode.cellIndex,
				ghostNode: gostNode
            };
            if (dg._zrz) {
				dg._zdata.dur = Math.floor((dg.node.offsetHeight - dg._zevt.offsetHeight) / hgh);
            }
        }  else {
            dg._zdata = {
                rows: dg.node.offsetTop / hgh,
                cols: dg.node.parentNode.parentNode.cellIndex - widget.ts,
                dur: Math.ceil(dg.node.offsetHeight / hgh),
				ghostNode: gostNode
            };
        }
	},

	_enddrag: function (dg, evt) {
		var widget = dg.control;
		if (dg && dg._zdata) {
			clearInterval(widget.run);
			//keep ghostNode not be disappear
			var ghostNode = dg._zdata.ghostNode;
			ghostNode.parent.append(jq(ghostNode));
			
			if (dg._zrz) {
				if (dg._zdata.dur) {
					var ce = dg._zevt,
						event = zk.Widget.$(ce).event,
						bd = new Date(event.beginDate.getTime()),
						ed = new Date(event.endDate.getTime()),
						ofs = widget._getTimeOffset(new Date(event.zoneEd.getTime()), dg._zdata.dur);

					widget.fire("onEventUpdate", {
						data: [
							ce.id, 
							bd.getTime(),
							ed.getTime() - ofs,
							evt.pageX,
							evt.pageY,
							jq.innerWidth(),
							jq.innerHeight()]});

					widget._ghost[widget.uuid] = function () {						
						jq('#'+widget.uuid+'-dd').remove();
						delete widget._ghost[widget.uuid];
					};
				} else {
					dg._zevt.style.visibility = "";
					jq('#'+widget.uuid+'-dd').remove();
				}
				dg._zrz = false;
			} else if (dg._zevt) {
				var cols = dg._zdata.cols,
					rows = dg._zdata.rows;
				if (cols || rows) {
					var days = cols * widget.DAYTIME,
						ce = dg._zevt,
						event = zk.Widget.$(ce).event,
						bd = new Date(event.beginDate.getTime()),
						ed = new Date(event.endDate.getTime()),
						ofs = widget._getTimeOffset(new Date(event.zoneBd.getTime()), -rows) + days;

					widget.fire("onEventUpdate", {
						data: [
							ce.id, 
							bd.getTime() - ofs,
							ed.getTime() - ofs,
							evt.pageX,
							evt.pageY,
							jq.innerWidth(),
							jq.innerHeight()]});
					
					widget._ghost[widget.uuid] = function () {						
						jq('#'+widget.uuid+'-dd').remove();
						delete widget._ghost[widget.uuid];
					};
				} else {
					dg._zevt.style.visibility = "";
					jq('#'+widget.uuid+'-dd').remove();
				}
			} else {
				var cols = dg._zdata.cols,
					rows = dg._zdata.rows,
					dur = dg._zdata.dur + rows,
					days = cols * widget.DAYTIME,
					bd = new Date(widget._beginDate.getTime() + days),
					bd1 = new Date(widget.zoneBd.getTime() + days),
					ofs = widget._getTimeOffset(bd1, false, rows),
					ofs1 = widget._getTimeOffset(bd1, false, dur);

				widget.fire("onEventCreate",{
						data: [
							bd.getTime() + ofs,
							bd.getTime() + ofs1, 
							evt.pageX,
							evt.pageY,
							jq.innerWidth(), 
							jq.innerHeight()]});

				widget._ghost[widget.uuid] = function () {
					jq('#'+widget.uuid+'-dd').remove();
					delete widget._ghost[widget.uuid];
				};
			}
			// fix opera jumping
			if (zk.opera) dg.handle.scrollTop = widget._scrollInfo[widget.uuid];
			dg._zchanged = dg._zecnt = dg._zrzoffs = dg._zrs = dg._zdata = dg._zcells = dg._zoffs = dg._zevt = null;
		}
	},
	
	_resetPosition: function (faker, widget) {		
		faker.style.width = "100%";
		faker.style.left = "0px";
		jq(faker).addClass(widget.getZclass() + "-evt-ghost");
	},

/********************** daylong drag ********************************************/

	_ignoreDaylongDrag: function (dg, p, evt) {
		if (zk.processing) return true;
		var daylong = dg.node,
			widget = dg.control,
			zcls = widget.getZclass(),
			cls = zcls + "-daylong-faker-more",
			ncls = zcls + "-daylong-faker-nomore";

		// clear ghost
		widget.clearGhost();

		var n = evt.domTarget,
			targetWidget = zk.Widget.$(n);	
		
		if (n.nodeType == 1 && jq(n).hasClass(cls) && !jq(n).hasClass(ncls) || 
			(targetWidget.className == 'calendar.DaylongEvent'  && 
				(!n.parentNode || targetWidget.event.isLocked )))
			return true;
		return false;
	},
	
	_ghostDaylongDrag: function (dg, ofs, evt) {
		var daylong = dg.node,
			widget = dg.control,
			targetWidget = zk.Widget.$(evt.domEvent),
			ce = targetWidget.className == 'calendar.DaylongEvent'? targetWidget.$n(): null,				
			zcls = widget.getZclass(),
			html = '<div id="'+ widget.uuid + '-rope" class="' + zcls + '-daylong-dd">'
				 + '<div class="' + zcls + '-dd-rope"></div></div>';

		jq(document.body).prepend(html);

		var row = daylong.firstChild.firstChild.lastChild,
			width = row.firstChild.offsetWidth,
			p = [evt.pageX,evt.pageY];

		dg._zinfo = [];
		for (var left = 0, n = row.firstChild; n; left += n.offsetWidth, n = n.nextSibling)
			dg._zinfo.push({l: left, w: n.offsetWidth});

		dg._zoffs = zk(dg.handle).revisedOffset();
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
			faker.style.left = jq.px(p[0] - (width/2));
			faker.style.top = jq.px(p[1] + h);
			jq(ce).addClass(zcls + '-evt-dd');
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

			dg._zdur = Math.ceil((ed.getTime() - bd.getTime())/ widget.DAYTIME);
			dg._zevt = ce;
		}

		dg._zdim = {w: width, h: daylong.offsetHeight, hs:[daylong.offsetHeight]};
		dg._zrope = jq('#' + widget.uuid + '-rope')[0];

		var cols = Math.floor((p[0] - dg._zoffs.l)/dg._zdim.w);

		dg._zpos = [cols, 0];

		// fix rope
		widget.fixRope_(dg._zinfo, dg._zrope.firstChild, cols, 0, dg._zoffs, dg._zdim, dg._zdur);
			
		return dg.node;	
	},
							
	_endghostDaylongDrag: function (dg, origin) {
		// target is Calendar's event
		dg.node = dg.handle;		
	},
		
	_endDaylongDrag: function (dg, evt) {		
		var widget = dg.control,
			daylong = dg.node,
			dg = widget._drag[daylong.id];
		if (dg) {
			var ce;
			if (dg._zevt) {
				var zcls = widget.getZclass(),
					event = zk.Widget.$(dg._zevt).event,
					bd = new Date(widget.zoneBd.getTime() + dg._zpos1[0] * widget.DAYTIME),
					bd1 = new Date(event.zoneBd.getTime());
					
				jq(dg._zevt).removeClass(zcls + '-evt-dd');

				bd.setHours(bd1.getHours());
				bd.setMinutes(bd1.getMinutes());
				bd.setSeconds(bd1.getSeconds());
				bd1.setMilliseconds(0);
				bd.setMilliseconds(0);
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
					c1 = dg._zpos1[0],
					b = (c < c1 ? c : c1) * widget.DAYTIME,
					bd = new Date(widget._beginDate.getTime() + b),
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
			dg._zpos1 = dg._zpos = dg._zrope = dg._zdim = dg._zdur = dg._zevt = null;
		}
	}
	
});


