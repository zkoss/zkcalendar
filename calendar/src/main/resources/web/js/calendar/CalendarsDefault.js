/* CalendarsDefault.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
(function () {

calendar.CalendarsDefault = zk.$extends(calendar.Calendars, {
	/**
	 * Begin time
	 */
	_bt: 0,
	/**
	 * End time
	 */
	_et: 24,
	/**
	 * the number of timeslots in one hour
	 * 2 means each time slot is 30 min
	 *  */ 
	_timeslots: 2,
	/**
	 * Drag and Drop element template
	 *  */
	ddTemplate: ['<div id="%1" class="%2" style="left:0px;width:100%;" >',
			  '<div class="%2-body" id="%1-body"><div class="%2-inner"><dl id="%1-inner"><dt class="%2-header"></dt><dd class="%2-cnt"></dd></dl></div></div>'].join(''),
	getDragAndDropTemplate(domId, domClass){
		return `<div id="${domId}" class="${domClass}" style="left:0px;width:100%;" ><div class="${domClass}-body" id="${domId}-body"><div class="${domClass}-inner"><dl id="${domId}-inner"><dt class="${domClass}-header"></dt><dd class="${domClass}-cnt"></dd></dl></div></div>`
	},
	$init: function(){
		this.$supers('$init', arguments);
		this._mold = 'default';
	},
	$define: {
		/**
		 * set the number of days to be displayed.
		 * 7 displays the full week  
		 */
		days: function () {
			if (!this.desktop)
				return;

			var days = this._days,
				header = this.$n('header'),
				cnt = this.$n('cnt'),
				daylongMoreRows = this.daylongMoreRows,
				zcls = this.getZclass(),
				oldRowCount = daylongMoreRows.cells.length,
				offset = days - oldRowCount;
			
			if (zk.ie) {
				jq(header.offsetParent).find('td:not(.z-calendars-daylong-evt)').attr('colspan',days);
				jq(cnt).find('tr:eq(1) td:last').attr('colspan',days);
			} else jq(this.$n('inner')).find('[colspan]').attr('colspan',days);

			if (offset > 0) {
				var daylongRowHtml = '<td class="' + zcls + '-daylong-evt ' + zcls + '-daylong-more">&nbsp;</td>',
					cntRowHtml = '<td class="' + zcls + '-week-day"><div class="' + zcls + '-week-day-cnt"/></td>',
					html1 = [],
					html2 = [],
					html3 = [];
				
				for (var i = offset; i--;) {
					html1.push(this.$class.TEMPLATE.weekDayHeader(zcls));
					html2.push(daylongRowHtml);
					html3.push(cntRowHtml);
				}
				jq(header.lastChild).before(html1.join(''));
				jq(daylongMoreRows).append(html2.join(''));
				jq(this.cntRows).append(html3.join(''));
			} else if (offset < 0) {
				jq(this.$n('daylong')).find('.z-calendars-daylong-more:gt(' + (days - 1) + ')').remove();
				jq(header).children('.z-calendars-day-of-week:gt(' + (days - 1) + ')').remove();
				jq(this.cntRows).children('.z-calendars-week-day:gt(' + (days - 1) + ')').remove();
			}
			
			if (zk.ie || zk.opera)
				this._reputContent();
			
			this.title = jq(header).find('.' + this.getZclass() + '-day-of-week-cnt');
			this.updateDateRange_();
		},
		/**
		 * sets items as JSON data from server 
		 */
		items: function () {
			this._items = jq.evalJSON(this._items);
			if (!this.$n()) return;

			for (var i = this.nChildren; i--;) {
				var child = this.getChildAt(i),
					className = child.className;
				if (className == 'calendar.DayItem' || className == 'calendar.DaylongItem')
					this.removeChild(child);
			}

			this.createChildrenWidget_();
			this._rePositionDaylong();
			this._rePositionDay();
			// recalculate
			this.beforeSize();
			this.onSize();
		},
		/**
		 * sets time zones to display from server
		 */
		zones: function () {
			var oldZones;
			if (this.desktop)
				oldZones = this._zonesOffset.$clone();

			this._zones = jq.evalJSON(this._zones);
			this._zonesOffset = jq.evalJSON(this.zonesOffset);
			for (var i = this._zonesOffset.length; i--;)
				this._zonesOffset[i] = zk.parseInt(this._zonesOffset[i]);

			if (!this.desktop) return;

			this.updateDateOfBdAndEd_();

			if (!oldZones || oldZones.$equals(this._zonesOffset)) return;

			this.updateTimeZoneCol_({ignoreFirstCol: true});
		},
		/**
		 * set timeslots
		 * timeslots: number of segments per hours 
		 *  */
		timeslots: function () {
			if (!this.desktop) return;
			var hourSepRowHtml = '<div class="z-calendars-hour-sep"></div>',
				html = [];
				
			for (var i = this._timeslots / 2; i--;)
				html.push(hourSepRowHtml);
				
			hourSepRowHtml = html.join('');
			html = [];
			
			for (var k = this._bt; k < this._et; k++)
				html.push(hourSepRowHtml);
			jq(this.cntRows.previousSibling.lastChild).find('.z-calendars-hour-inner').html(html.join(''));
			this._updateCntHeight();
			// recalculate
			this.beforeSize();
			this.onSize();
		},
		bt: _zkf = function () {
			if (!this.desktop) return;
			this.updateTimeZoneCol_(this);
		},
		et: _zkf
	},
	/**
	 * readable accessor for beginTime,
	 * ToDo: refactor server-side code to send readable values
	 * 
	 * @returns beginTime
	 */
	getBeginTime(){
		return this.bt;
	},
	/**
	 * readable accessor for endTime,
	 * ToDo: refactor server-side code to send readable values
	 * 
	 * @returns beginTime
	 */
	getEndTime(){
		return this.et;
	},
	/**
	 * Bind calendar widget to DOM node
	 */
	bind_: function () {
		this.$supers('bind_', arguments);
		
		this._scrollInfo = {};
		this._dayItems = [];
		this._daylongItems = [];
		this._daylongSpace = [];
		this._daySpace = [];
		
		var zcls = this.getZclass();
		this.params._fakerMoreCls = zcls + '-daylong-faker-more';
		this.params._fakerNoMoreCls = zcls + '-daylong-faker-nomore';
		
		var widget = this,
			$cnt = jq(this.$n('cnt')),
			zcls = this.getZclass();
		
		//define all positions
		//put the title
		this.title = jq(this.$n('header')).find('.' + zcls + '-day-of-week-cnt');
		//put the daylong event
		this.daylongTbody = this.$n('daylong-tbody');
		//put the daylong more space
		this.daylongMoreRows = this.$n('daylong-morerows');
		//put the day event
		this.cntRows = $cnt.find('tr')[zk.ie ? 2 : 1];
		
		this.weekDay = jq(this.cntRows).children('.' + zcls + '-week-day');
		
		/**
		 * header arrow
		 * collapses the daylong display
		 *   */
		var	headerNode = this.$n('header'),
			title = this.title,
			endDate = new Date(this.zoneEd);
		//store date value of day-of-the-week header in header DomElement
		for (var i = title.length; i--;) {
			endDate = calUtil.addDay(endDate, -1);
			title[i].time = this.fixTimeZoneFromClient(endDate);
		}
		jq(this.$n('hdarrow')).bind('click', this.onArrowClick);
		/** 
		 * head event
		 *  */
		if (headerNode.childNodes.length > this._zones.length + 2)
			this.addDayClickEvent_(headerNode);

		$cnt.bind('scroll', function () {
			widget._scrollInfo[widget.uuid] = $cnt[0].scrollTop;
		});
		
		if (!this._readonly)
			this.editMode(true);
	},
	/**
	 * unbinds calendar widget
	 * cleanup values
	 */
	unbind_: function () {
		this.title = this.daylongTbody = this.daylongMoreRows = this.cntRows =
		this._scrollInfo = this._dayItems = this._daylongItems =
		this._daylongSpace = this._daySpace = null;
		this.$supers('unbind_', arguments);
	},
	
	/**
	 * reset all daylong items positions by redrawing them
	 */
	_resetDaylongPosition: function () {
		var daylongTbody = jq(this.daylongTbody),
			zcls = this.getZclass();
		/* removes existing content, doesn't clear the row dedicated for the more... anchors */
		daylongTbody.children().not('.z-calendars-daylong-morerows').remove();
		
		/* append all rows from bottom to top */
		for (var dayLongRowIndex = this._daylongSpace.length; dayLongRowIndex--;) {
			daylongTbody.prepend('<tr></tr>');
			var rowSpace = this._daylongSpace[dayLongRowIndex],
				/* row node is the last added tr dom node, since added through prepend */
				daylongRowNode = jq(daylongTbody[0].firstChild);
			/* insert events into the new row node */
			for (var daylongItemIndex = 0; daylongItemIndex < rowSpace.length; daylongItemIndex++) {
				var calendaritemNode = rowSpace[daylongItemIndex];
					
				if (daylongItemIndex == 0) {//first item in row
					calendaritemNode._days = calendaritemNode._days;
					this.drawItem_(calendaritemNode._preOffset, zcls + '-daylong-evt', daylongRowNode, calendaritemNode);
				} else { //other items in row (not first)
					var previousWidget = rowSpace[daylongItemIndex - 1],
						start = calendaritemNode._preOffset,
						previousEnd = previousWidget._preOffset + previousWidget._days,
						offset = start - previousEnd;
						calendaritemNode._days = calendaritemNode._days;
					this.drawItem_(offset, zcls + '-daylong-evt', daylongRowNode, calendaritemNode);
				}
				/*recover moving event
				  items receive visibility none style when dragged
				  restore to no visibility style */
				calendaritemNode.style.visibility = '';
				if (daylongItemIndex == rowSpace.length - 1 //last item in row, put a spacer to fill remaining colspans after last item
					&& this.getDays()>1) { //1-day view, no need spacer
					var html = '';
					for (var n = calendaritemNode._afterOffset; n--;)
						html += '<td class="' + zcls + '-daylong-evt">&nbsp;</td>';
					daylongRowNode.append(html);
				}
			}
		}
		jq('#' + this.uuid + '-hdarrow').removeClass(this.getZclass() + '-week-header-arrow-close');
	},
	
	/*
	 * reposition all day items
	 */
	_rePositionDay: function () {
		this._dayItems.sort(this.dateSorting_);
		this._daySpace = [];
			
		for (var i = this._days; i--;) //unused variable i used for reverse order
			this._daySpace.push([]);
				
		// all daylong event
		for (var itemIndex = 0; itemIndex < this._dayItems.length; itemIndex++) {
			var dayItem = this._dayItems[itemIndex];
			this._daySpace[dayItem._preOffset].push(dayItem);
		}
		this.fixPosition();
	},
	
	/**
	 * reposition all daylong items
	 * */
	_rePositionDaylong: function () {
		this._daylongItems.sort(this.dateSorting_);
		this._daylongSpace = [];

		// all daylong event
		for (var itemIndex = 0 ; itemIndex < this._daylongItems.length; itemIndex++) {
			var daylongEvent = this._daylongItems[itemIndex];
			this.putInDaylongSpace_(this._daylongSpace, daylongEvent);
		}
						
		this._resetDaylongPosition();
	},
	/**
	 * redraw the timezone columns
	 * 
	 * @param {Object}} opts 
	 */
	updateTimeZoneCol_: function (opts) {
		var headerChildren = this.$n('header').children,
			timeRows = this.cntRows.cells,
			zones = this._zones,
			beginHour = this.getBeginTime(),
			endHour = this.getEndTime(),
			timeZonesLenght = this._zones.length,
			captionByTimeOfDay = this._captionByTimeOfDay;
		
		this._updateHourColSize(this);
		
		if (this._updateTimeZoneColSize())
			opts = {ignoreFirstCol: false};
		
		//update texts
		for (var reverseTimeZoneIndex = timeZonesLenght; reverseTimeZoneIndex--;) {
			var timeZoneIndex = timeZonesLenght - reverseTimeZoneIndex - 1,
				zoneText = jq(headerChildren[timeZoneIndex]);

			if (zoneText.children().length) {
				var str = zoneText.html(),
					div = str.substr(str.indexOf('<'),str.length);
				zoneText.html(zones[timeZoneIndex] + div);
				this.clearCache();
				jq(this.$n('hdarrow')).bind('click', this.onArrowClick);
			} else zoneText.html(zones[timeZoneIndex]);

			//fist column doesn't need to redraw
			if (timeZoneIndex == 0 && opts && opts.ignoreFirstCol) continue;

			var current = new Date(),
				cell = jq(timeRows[timeZoneIndex]).children();
			current.setMinutes(0);
			for (var k = beginHour; k < endHour; k++) {
				current.setHours(k);
				var context = captionByTimeOfDay ? captionByTimeOfDay[ timeZoneIndex * 24 + k ] :
					zk.fmt.Date.formatDate(this.getTimeZoneTime(current,zk.parseInt(this._zonesOffset[timeZoneIndex])),'HH:mm');
				jq(cell[k - beginHour]).html(context);
			}
		}
	},
	
	/**
	 * change the displayed date range
	 */
	updateDateRange_: function () {
		this.updateDateOfBdAndEd_();
		
		this._captionByDate = this.captionByDate ? jq.evalJSON(this.captionByDate) : null;
		//ZKCAL-54: Fix setting time label format by DateFormatter not working
		this._captionByTimeOfDay = this.captionByTimeOfDay ? jq.evalJSON(this.captionByTimeOfDay) : null;
		if (!this.$n())
			return;
		
		var zcls = this.getZclass();
		this.weekDay = jq(this.cntRows).children('.' + zcls + '-week-day');
		
		var headerNode = jq(this.$n('header')),
			contentNode = jq(this.$n('cnt')),
			titles = this.title,
			endDate = new Date(this.zoneEd),
			current = new Date(),
			week_day = zcls + '-week-day',
			week_today = zcls + '-week-today',
			week_weekend = zcls + '-week-weekend',
			weekDay = this.weekDay;
		
		//remove today and weekend class
		headerNode.children().find('.' + week_weekend).removeClass(week_weekend);
		headerNode.children().find('.' + week_today).removeClass(week_today);
		contentNode.children().find('.' + week_weekend).removeClass(week_weekend);
		contentNode.children().find('.' + week_today).removeClass(week_today);
		
		//update titles
		for (var reverseDayIndex = this._days; reverseDayIndex--;) {
			var originalEndDayOfDisplayRange = endDate.getDate();
			endDate = calUtil.addDay(endDate, -1);
			var previousEndDayOfDisplayRange = endDate.getDate(),
				realEndDate = endDate;
			if (originalEndDayOfDisplayRange - previousEndDayOfDisplayRange == 2) //ZKCAL-50: DST time happens on 00:00 AM
				endDate.setHours(endDate.getHours() + 2); //adjust to correct date
			
			var title = titles[reverseDayIndex],
				content = this._captionByDate ? this._captionByDate[reverseDayIndex] :
								zk.fmt.Date.formatDate(realEndDate, 'EEE ') +
								'<div class="' + this.getZclass() + '-day-of-week-fmt' + '">' + zk.fmt.Date.formatDate(realEndDate, this.weekFmt) + '</div>';
			jq(title).html(content);
			title.time = this.fixTimeZoneFromClient(endDate);
			if (endDate.getDay() == 0 || endDate.getDay() == 6) {//SUNDAY or SATURDAY
				jq(title.parentNode).addClass(week_weekend);
				jq(weekDay[reverseDayIndex]).addClass(week_weekend);
			}
		
			if (calUtil.isTheSameDay(current, endDate)) {// today
				jq(title.parentNode).addClass(week_today);
				jq(weekDay[reverseDayIndex]).addClass(week_today);
			}
		}
	},

	cleanItemArray_: function () {
		this._itemKey = {};
		this._daylongItems = [];
		this._dayItems = [];
	},

	/**
	 * 
	 * Creates calendar DayItem and DayLongitem widgets based on the CalendarItemData
	 * 
	 * @param {boolean} isExceedOneDay 
	 * @param {*} item 
	 */
	processChildrenWidget_: function (isExceedOneDay, CalendarItemData) {
		var dayItem = isExceedOneDay ?
				new calendar.DaylongItem({item: CalendarItemData}) :
				new calendar.DayItem({item: CalendarItemData}),
			zoneBeginDate = CalendarItemData.zoneBd,
			zoneEndDate = CalendarItemData.zoneEd;
		if (!isExceedOneDay &&
			(zoneBeginDate.getHours() >= this.getEndTime() ||
			(zoneEndDate.getHours() <= this.getBeginTime() && zoneEndDate.getHours() != 0 && zoneEndDate.getMinutes() == 0)))
			return;
		this.appendChild(dayItem);
		this[isExceedOneDay ? '_daylongItems' : '_dayItems'].push(dayItem.$n());
	},

	getDragDataObj_: function () {
		if (!this._dragDataObj)
			this._dragDataObj = {
				getRope: function (widget, cnt, hs) {
					var zcls = widget.getZclass(),
						html = [widget.ropeTemplate.replace(new RegExp("%([1-2])", "g"), function (match, index) {
									return index < 2 ? widget.uuid : zcls;
								})];
			
					html.push(widget.ddRopeTemplate.replace(new RegExp("%1", "g"), function (match, index) {
						return zcls;
					}));
					html.push('</div>');
					hs.push(cnt.firstChild.offsetHeight);
					return html.join('');
				},
				
				/**
				 * 
				 * @param {*} cnt daylong content node
				 * @returns first cell of the "more..." row
				 */
				getRow: function (draggable) {
					return draggable.control.$n("daylong-morerows").firstChild;
				},
				/**
				 * 
				 * @param {Object} mousePosition {x,y}
				 * @param {zk.DnD.Draggable} draggable 
				 * @returns 
				 */
				getCols: function (mousePosition, draggable) {
					return Math.floor((mousePosition.x - draggable._zoffs.left) / draggable._zdimensions.width);
				},
				/**
				 * get the calendar row position of an event
				 * only month calendar has multiple row, so calendarsDefault always returns index 0, since it always has one line
				 * @returns 
				 */
				getRows: function () {
					return 0;
				},
				/**
				 * 
				 * @param {zk.DnD.Draggable} draggable 
				 * @returns lenght of the dragged object in days
				 */
				getDur: function (draggable) {
					return draggable._lastDraggedPosition.cols;
				},
				getNewDate: function (widget, draggable) {
					var colsIndex = draggable._zposition.x,
						draggedColsIndex = draggable._lastDraggedPosition.cols,
						offs = colsIndex < draggedColsIndex ? colsIndex : draggedColsIndex,
						beginDate = new Date(widget.zoneBd),
						endDate = new Date(widget.zoneBd);
					
					beginDate.setDate(beginDate.getDate() + offs);
					endDate.setDate(beginDate.getDate() + draggable._lastDraggedPosition.draggedDuration);
					return {beginDate: beginDate, endDate: endDate};
				}
			};
		return this._dragDataObj;
	},

	/**
	 * called by add, modify or delete calendarItem
	 * @param {Object{day, daylong}} updated {day: update in-day items, daylong: update daylong items}
	 */
	reAlignItems_: function (updated) {
		if (updated.day)
			this._rePositionDay();
		
		if (updated.daylong)
			this._rePositionDaylong();
			
		// recalculate
		this.beforeSize();
		this.onSize();
	},

	removeNodeInArray_: function (childWidget, updated) {
		var isDayItem = childWidget.className == 'calendar.DayItem';
		this[isDayItem ? '_dayItems' : '_daylongItems'].$remove(childWidget.$n());
		updated[isDayItem ? 'day' : 'daylong'] = true;
	},

	/**
	 * Triggers on mouse click (not drag) on calendar content and event
	 * 
	 * @param {DomElement} contentNode 
	 * @param {MouseEvent} evt 
	 * @returns 
	 */
	onClick: function (contentNode, evt) {
		var calendarWidget = zk.Widget.$(contentNode),
			mousePosition = {x:Math.round(evt.pageX), y:Math.round(evt.pageY)}; //ZKCAL-42: sometimes it returns float number in IE 10

		/* returns if clicking time zone or not body */
		if (!contentNode._lefts || mousePosition.x <= contentNode._lefts[0]) return;

		var calendarItemData = zk.Widget.$(evt.target).item;
		if (this.isClickExistingItem(calendarItemData)) {
			calendarWidget.fire('onItemEdit', {
				data: [calendarItemData.id,mousePosition.x,mousePosition.y, jq.innerWidth(),jq.innerHeight()]});
		} else {
			this.clickToCreateItem(calendarWidget, contentNode, mousePosition, evt);
		}
		calendarWidget.closeFloats();
		evt.stop();
	},
	isClickExistingItem: function (item) {
		return !!item;
	},
	clickToCreateItem: function (calendarWidget, contentNode, mousePosition, event) {
		var timezonesLength = calendarWidget._zones.length,
			cells = calendarWidget.cntRows.cells,
			offsets = zk(contentNode).revisedOffset(),
			heightPerRow = calendarWidget.perHeight;
		var columnIndex = cells.length - timezonesLength;
		columnIndex = this.updateColumnIndex(contentNode, mousePosition, offsets, columnIndex);
		var rowIndex = Math.floor((mousePosition.y + contentNode.scrollTop - offsets[1]) / heightPerRow),
			timeslots = calendarWidget._timeslots,
			timeslotTime = 60 / timeslots;

		this.renderNewItemDragGhost(calendarWidget, cells, timezonesLength, columnIndex, rowIndex, heightPerRow, timeslotTime);

		var beginDate = this.calculateNewItemBeginDate(event, columnIndex, rowIndex, timeslotTime);
		var endDate = this.calculateNewItemEndDate(beginDate, timeslots, rowIndex, timeslotTime);
		calendarWidget.fireCalEvent(beginDate, endDate, event);
	},
	/**
	 * @param event for future customization requirement
 	 */
	calculateNewItemBeginDate: function (event, columnIndex, rowIndex, timeslotTime) {
		var beginDate = new Date(this.zoneBd);
		beginDate.setDate(beginDate.getDate() + columnIndex);
		beginDate.setMilliseconds(0);// clean
		beginDate.setMinutes(beginDate.getMinutes() + rowIndex * timeslotTime);
		return beginDate;
	},

	calculateNewItemEndDate: function(beginDate, timeslots, rows, timeslotTime) {
		var endDate = new Date(beginDate);
		endDate.setMinutes(endDate.getMinutes() + this.getNewItemTimeSlots_() * timeslotTime);
		//ZKCAL-50: available to click on DST day start from 01:00
		if (beginDate.getTime() == endDate.getTime() && rows == timeslots) {
			beginDate.setHours(beginDate.getHours() + 1);
			endDate.setHours(endDate.getHours() + 2);
		}
		return endDate;
	},

	renderNewItemDragGhost: function (widget, cells, timezonesLength, columnIndex, rows, heighsPerRow, timeslotTime) {
		/* cells[timezonesLength + columnIndex].firstChild is the column for the target day in the calendar content */
		/* create drag ghost from template and temporarily adds it as part of the same column */
		jq(cells[timezonesLength + columnIndex].firstChild).prepend(
			this.getDragAndDropTemplate(widget.uuid + '-dd', 'z-calitem')
		);

		var draggedGhost = jq('#' + widget.uuid + '-dd')[0];
		jq(draggedGhost).addClass(widget.getZclass() + '-evt-ghost');

		draggedGhost.style.top = jq.px(rows * heighsPerRow);

		var draggedGhostBody = jq('#' + widget.uuid + '-dd-body')[0],
			draggedGhostHeight = 0,
			inner = draggedGhostBody.firstChild.firstChild;
		rows += widget.beginIndex;
		var beginIndex = rows * widget._slotOffs,
			itemTimeSlot = this.getNewItemTimeSlots_();
		endIndex = beginIndex + (itemTimeSlot * timeslotTime / 5);
		inner.firstChild.innerHTML = widget.getDateTime(beginIndex, 5) + ' - ' + widget.getDateTime(endIndex, 5);

		for (var child = jq(draggedGhost).children().get(0);child;child = child.nextSibling) {
			if (this.isLegalChild(child))
				draggedGhostHeight += child.offsetHeight;
		}

		draggedGhostHeight += zk(draggedGhostBody).padBorderHeight();
		draggedGhostHeight += zk(draggedGhostBody.firstChild).padBorderHeight();
		draggedGhostHeight += zk(inner).padBorderHeight();
		draggedGhostHeight += 2;
		inner.style.height = jq.px((heighsPerRow * itemTimeSlot) - draggedGhostHeight);
	},
	updateColumnIndex: function(contentNode, mousePosition, offsets, columnIndex) {
		for (; columnIndex--;) {
			//Fix ZKCAL-55: Problems with horizontal scrollbar
			//should consider cnt offset position if it is wrapped by a scrollable container
			if (contentNode._lefts[columnIndex] <= (mousePosition.x - offsets[0] + this._initLeft))
				break;
		}
		if (columnIndex < 0)
			columnIndex = 0;
		return columnIndex;
	},
	//Feature ZKCAL-51: override to define default item time duration
	getNewItemTimeSlots_: function () {
		return this._timeslots;
	},
	
	/**
	 * Triggers on mouse click (not drag) on calendar daylong rows
	 * 
	 * @param {DomElement} daylongRowNode 
	 * @param {MouseEvent} evt 
	 */
	onDaylongClick: function (daylongRowNode, evt) {
		var calendarsWidget = zk.Widget.$(daylongRowNode),
			calendarItemData = zk.Widget.$(evt.target).item,
			mousePosition = {x:Math.round(evt.pageX), y: Math.round(evt.pageY)}; //ZKCAL-42: sometimes it returns float number in IE 10
			
		if (calendarItemData) {
			calendarsWidget.fire('onItemEdit', {
				data: [calendarItemData.id, mousePosition.x, mousePosition.y, jq.innerWidth(), jq.innerHeight()]});
		} else {
			var zcls = calendarsWidget.getZclass(),
				html = '<div id="' + calendarsWidget.uuid + '-rope" class="' + zcls + '-daylong-dd">'
					 + '<div class="' + zcls + '-dd-rope"></div></div>';

			jq(document.body).prepend(html);

			var moreRow = calendarsWidget.$n("daylong-morerows"),
				moreCellWidth = moreRow.firstChild.offsetWidth,
				offs = zk(daylongRowNode).revisedOffset(),
				columnIndex = Math.floor(( mousePosition.x - offs[0]) / moreCellWidth),
				beginDate = new Date(calendarsWidget.zoneBd);
			if (calendarsWidget.zoneBd.getHours() == 23) //ZKCAL-50: DST cross between week
				beginDate.setHours(beginDate.getHours() + 2);
			beginDate.setDate(beginDate.getDate() + columnIndex);
			if (columnIndex != 0)
				beginDate.setHours(0);
			
			var zinfo = [];
			for (var left = 0, moreRowCell = moreRow.firstChild; moreRowCell;
					left += moreRowCell.offsetWidth, moreRowCell = moreRowCell.nextSibling)
				zinfo.push({l: left, w: moreRowCell.offsetWidth});

			var zoffs = {
				left: offs[0],
				top: offs[1],
				moreCellWidth: daylongRowNode.offsetWidth,
				height: daylongRowNode.offsetHeight,
				size: zinfo.length
			};

			calendarsWidget.fixRope_(zinfo, calendarsWidget.$n("rope").firstChild, columnIndex,
				0, zoffs, {width: moreCellWidth, height: daylongRowNode.offsetHeight, heighsPerRow: [daylongRowNode.offsetHeight]}, 1);

			var endDate = new Date(beginDate);
			endDate = calUtil.addDay(endDate, 1);
			endDate.setHours(0); //DST case
			calendarsWidget.fire('onItemCreate', {
				data: [
					calendarsWidget.fixTimeZoneFromClient(beginDate),
					calendarsWidget.fixTimeZoneFromClient(endDate),
					mousePosition.x,
					mousePosition.y,
					jq.innerWidth(),
					jq.innerHeight()
				]
			});

			calendarsWidget._ghost[calendarsWidget.uuid] = function () {
				jq('#' + calendarsWidget.uuid + '-rope').remove();
				delete calendarsWidget._ghost[calendarsWidget.uuid];
			};
		}
		calendarsWidget.closeFloats();
		evt.stop();
	},
	
	/**
	 * Triggers on mouse click (not drag) on calendar time zones arrow button
	 * 
	 * @param {MouseEvent} evt 
	 * @returns 
	 */
	onArrowClick: function (evt) {
		var $a = jq(evt.currentTarget),
			calendarsWidget = zk.Widget.$(evt.currentTarget),
			zcls = calendarsWidget.getZclass(),
			closedClass = zcls + '-week-header-arrow-close';
			isClosed = $a.hasClass(closedClass),
			daylongRow = calendarsWidget.$n('daylong'),
			daylongRowsArray = daylongRow.firstChild.rows,
			rowCount = daylongRowsArray.length;
			
			calendarsWidget.clearGhost();
		
		isClosed ? $a.removeClass(closedClass) : $a.addClass(closedClass);
				
		if (rowCount < 2) return; // nothing to do

		if (!isClosed) {
			var data = [],
				rowCellCount = daylongRowsArray[rowCount - 1].cells.length;
			for (var cellIndex = 0; cellIndex < rowCellCount; cellIndex++)
				data[cellIndex] = [];

			for (var rowIndex = 0; rowIndex < (rowCount - 1); rowIndex++) {
				/*
					colspanEventPaddingIndex: virtual column space occupied by colspaned items
				*/
				for (var cellLookupIndex = 0, colspanEventPaddingIndex = 0, daylongEventCells = daylongRowsArray[rowIndex].cells;
					cellLookupIndex < daylongEventCells.length && colspanEventPaddingIndex + cellLookupIndex < rowCellCount; cellLookupIndex++) {
					var dayLongCalendarEvent = daylongEventCells[cellLookupIndex].firstChild;
					if (dayLongCalendarEvent.id)
						data[cellLookupIndex + colspanEventPaddingIndex].push(dayLongCalendarEvent);
					var eventColspan = daylongEventCells[cellLookupIndex].colSpan;
					while (--eventColspan > 0)
						data[cellLookupIndex + ++colspanEventPaddingIndex].push(dayLongCalendarEvent);
				}
				daylongRowsArray[rowIndex].style.display = 'none';
			}

			var faker = daylongRow.firstChild.insertRow(rowCount - 1);
			for (var reverseCellIndex = rowCellCount; reverseCellIndex--;) {
				/* insert a new TD in the faker TR at index 0, and returns the new TD */
				cell = faker.insertCell(0);
				cell.className = daylongRowsArray[rowCount].cells[reverseCellIndex].className;
				jq(cell).addClass(zcls + '-daylong-faker-more');
				if (data[reverseCellIndex].length > 0) {
					/* if have data, add more... message and click event */
					var evts = data[reverseCellIndex];
					cell.innerHTML = calUtil.format(msgcal.dayMORE, [evts.length]);
					jq(cell).bind('click', calendarsWidget.onMoreClick);
				} else {
					/* if no data: empty cell text and add nomore class */
					cell.innerHTML = zk.ie ? '&nbsp;' : '';
					jq(cell).addClass(zcls + '-daylong-faker-nomore');
				}
			}
			calendarsWidget._itemsData = data;
		} else {
			for (var rowIndex = 0; rowIndex < (rowCount - 1); rowIndex++)
				daylongRowsArray[rowIndex].style.display = '';
			jq(daylongRowsArray[rowCount - 2]).remove();
		}

		// recalculate
		calendarsWidget.beforeSize();
		calendarsWidget.onSize();
		
		evt.stop();
	},
	
	/**
	 * more... cell event hander
	 * Opens the more... dropdown menu
	 * 
	 * @param {MouseEvent} evt 
	 * @returns 
	 */
	onMoreClick: function (evt) {
		var clickedCell = evt.target,
			calendarsWidget = zk.Widget.$(clickedCell),
			daylong = calendarsWidget.$n("daylong"),
			uuid = calendarsWidget.uuid,
			cellIndex = clickedCell.cellIndex,
			pp,
			table;
		
		calendarsWidget.clearGhost();
		if (!calendarsWidget._pp) {
			jq(document.body).append(calendarsWidget.getPopupTemplate(uuid, 'z-calpp'));
			pp = calendarsWidget._pp = calendarsWidget.$n("pp");
			jq(document.body).bind('click', calendarsWidget.proxy(calendarsWidget.unMoreClick));
			table = calendarsWidget.$n("ppcnt");
			
			if (!calendarsWidget._readonly)
				jq(calendarsWidget._pp).bind('click', calendarsWidget.proxy(calendarsWidget.onPopupClick));
		} else {
			if (calendarsWidget._pp.cellIndex == cellIndex) {
				// ignore onItemCreate
				evt.stop();
				return;
			}
			table = calendarsWidget.$n("ppcnt");
			for (var rowIndex = table.rows.length; rowIndex--;)
				jq(table.rows[0]).remove();
			pp = calendarsWidget._pp;
		}

		pp.cellIndex = cellIndex;

		var dateColumnHeader = jq(calendarsWidget).find('.z-calendars-day-of-week-cnt')[cellIndex],
			targetDate = new Date(dateColumnHeader.time);
		if (targetDate)
			calendarsWidget.$n('pphd').innerHTML = zk.fmt.Date.formatDate(targetDate, 'EEE, MMM/d');

		var offs = zk(clickedCell).revisedOffset(),
			cellCount = clickedCell.parentNode.cells.length,
			cellWidth = daylong.offsetWidth / cellCount,
			popupWidth = cellCount > 2 ? cellWidth * 3 * 0.9 : popupWidth * 0.8;

		if (cellCount > 2 && cellIndex > 0)
			if (cellCount > cellIndex + 1)
				pp.style.left = jq.px(offs[0] - (popupWidth - cellWidth) / 2);
			else
				pp.style.left = jq.px(offs[0] - (popupWidth - cellWidth));
		else if (cellCount > 2)
			pp.style.left = jq.px(offs[0]);
		else pp.style.left = jq.px(offs[0] + (cellWidth * 0.1));

		pp.style.top = jq.px(offs[1] + zk(clickedCell).offsetHeight() + 1);
		pp.style.width = jq.px(popupWidth);

		//filling data
		var evts = calendarsWidget._itemsData[cellIndex],
			oneDay = calUtil.DAYTIME,
			beginDate = calendarsWidget.zoneBd;
			endDate = new Date(beginDate);
		endDate = calUtil.addDay(endDate, 1);
			
		for (var eventIndex = evts.length; eventIndex--;) {
			var eventTrElement = table.insertRow(0),
				cellRight = eventTrElement.insertCell(0),
				cellMiddle = eventTrElement.insertCell(0),
				cellLeft = eventTrElement.insertCell(0),
				currentEvent = evts[eventIndex],
				calendarItemData = zk.Widget.$(currentEvent).item,
				headerColor = calendarItemData.headerColor,
				contentColor = calendarItemData.contentColor,
				itemZclass = calendarItemData.zclass;
				
			currentEvent._bd = currentEvent._bd || calendarItemData.zoneBd;
			currentEvent._ed = currentEvent._ed || calendarItemData.zoneEd;
			cellLeft.className = 'z-calpp-evt-l';
			if (beginDate.getTime() + (oneDay * cellIndex) - currentEvent._bd.getTime() >= 1000) {
				/** marked %i legacy info object for easier read
				* %1 elementId
				* %2 elementClass
				* %3 elementSubClass
				* %4 itemText
				* %5 bodyAttributes
				* %6 contentAttributes
				* %7 ! removed ! - wasn't used in itemTemplate
				* %8 bodyInnerAttributes
				 */
				cellLeft.innerHTML = calendarsWidget.getItemTemplate(
					currentEvent.id + '-fl', //%1 elementId
					itemZclass,//%2 elementClass
					itemZclass + '-left', //%3 elementSubClass
					currentEvent._bd.getMonth() + 1 + '/' + currentEvent._bd.getDate(),//%4 itemText
					headerColor ? ' style="background:' + headerColor + '"' : '',//%5 bodyAttributes
					contentColor ? ' style="background:' + contentColor + '"' : '',//%6 contentAttributes
					contentColor ? ' style="background:' + contentColor + '"' : ''//%8 bodyInnerAttributes
				);
			} else
				cellLeft.innerHTML = '';
		
			cellMiddle.className = 'z-calpp-evt-m';
			
			var faker = currentEvent.cloneNode(true);
			jq(faker).addClass('z-calpp-evt-faker');
			cellMiddle.appendChild(faker);

			cellRight.className = 'z-calpp-evt-r';
			if (currentEvent._ed.getTime() - (endDate.getTime() + (oneDay * cellIndex)) >= 1000) {
				var d = new Date(currentEvent._ed.getTime() - 1000);
				
				/** marked %i legacy info object for easier read
				* %1 elementId
				* %2 elementClass
				* %3 elementSubClass
				* %4 itemText
				* %5 bodyAttributes
				* %6 contentAttributes
				* %7 ! removed ! - wasn't used in itemTemplate
				* %8 bodyInnerAttributes
				 */
				cellRight.innerHTML = calendarsWidget.getItemTemplate(
					currentEvent.id + '-fr', //%1 elementId
					itemZclass, //%2 elementClass
					itemZclass + '-right', //%3 elementSubClass
					d.getMonth() + 1 + '/' + d.getDate(), //%4 itemText
					headerColor ? ' style="background:' + headerColor + '"' : '',//%5 bodyAttributes
					contentColor ? ' style="background:' + contentColor + '"' : '', //%6 contentAttributes
					contentColor ? ' style="background:' + contentColor + '"' : ''); //%8 bodyInnerAttributes
			} else
				cellRight.innerHTML = '';
		}
		zk(pp).cleanVisibility();
		evt.stop();
	},
	onDrop_: function (draggable, evt) {
		let itemId = this.locateCalendarItemId(evt);
		let time = this.locateDroppedDateTime(evt);
		if (!time){
			//if users drop on a place that cannot determine the date, ignore it
			return;
		}
		this.fire('onDrop', this.constructCalendarItemDropData(draggable, evt, itemId, time), null, zk.Widget.auDelay);
	},
	constructCalendarItemDropData(draggable, evt, itemId, time) {
		let calendarItemData = zk.copy({dragged: draggable.control}, evt.data);
		calendarItemData.ce = itemId;
		calendarItemData.time = time;
		return calendarItemData;
	},
	locateCalendarItemId(event) {
		let targetWidget = zk.Widget.$(event.domTarget);
		if (this.$class.isCalendarItem(targetWidget)) {
			return targetWidget.item.id;
		}
		return null;
	},
	locateDroppedDateTime: function(event){
		let targetWidget = zk.Widget.$(event.domTarget);
		let target = this.$class.isCalendarItem(targetWidget) ? targetWidget.$n().parentNode : event.domTarget;

		if (jq.nodeName(target, 'td') &&
			jq(target.offsetParent).hasClass('z-calendars-daylong-cnt')) {
			return this.locateDayLongDroppedDateTime(target)
		} else if (jq(target).hasClass('z-calendars-week-day-cnt')) {
			return this.locateWeekDayDroppedDateTime(target, event)
		}
		return null;
	},
	locateDayLongDroppedDateTime(target) {
		let time = new Date(this.zoneBd);
		time.setDate(time.getDate() + target.cellIndex);
		time = this.fixTimeZoneFromClient(time);
		return time;
	},
	locateWeekDayDroppedDateTime(target, event) {
		let time = new Date(this.zoneBd);
		target = target.parentNode;
		time.setDate(time.getDate() + target.cellIndex - this._zones.length);

		var contentNode = this.$n('cnt'),
			offs = zk(contentNode).revisedOffset(),
			rows = Math.floor((event.pageY + contentNode.scrollTop - offs[1]) / this.perHeight)
				+ this.beginIndex;
		time.setMinutes(time.getMinutes() + rows * 60 / this._timeslots);
		time = this.fixTimeZoneFromClient(time);
		return time;
	},
	unMoreClick: function (evt) {
		if (!zUtl.isAncestor(this._pp, evt.currentTarget))
			this.closeFloats();
	},
	
	fireCalEvent: function (beginDate, endDate, evt, id) {
		var uuid = this.uuid;
		if (beginDate.getMinutes() == endDate.getMinutes() && beginDate.getHours() == endDate.getHours()) {
			jq.alert('The DST begin time and end time cannot be equal', {icon: 'ERROR'});
			jq('#' + uuid + '-dd').remove();
			delete this._ghost[uuid];
			if (id)
				jq(id, zk)[0].style.visibility = '';
		} else {
			//ZKCAL-50: add event on DST start day
			var zoneBegingDate = this.zoneBd,
				DST = zoneBegingDate.getHours() == 23 ? 1 : 0;
			beginDate.setHours(beginDate.getHours() + (beginDate.getTime() == zoneBegingDate.getTime() ? DST * 2 : DST));
			endDate.setHours(endDate.getHours() + DST);
			var widget = this,
				data = [
					this.fixTimeZoneFromClient(beginDate),
					this.fixTimeZoneFromClient(endDate),
					evt.pageX,
					evt.pageY,
					jq.innerWidth(),
					jq.innerHeight()
				],
				eventName = 'onItemCreate';
			if (id) {
				data.unshift(id);
				eventName = 'onItemUpdate';
			}
			this.fire(eventName, {data: data});
			var widget = this;
			this._ghost[uuid] = function () {
				jq('#' + uuid + '-dd').remove();
				delete widget._ghost[uuid];
			};
		}
	},
	/**
	 * If _timeslots is 2, the returned index is between 0 ~ 47.
	 * @returns {number} - The time slot index for the specified date.
	 * */
	getTimeIndex: function (date) {
		var timeslots = this._timeslots,
			timeslotTime = 60 / timeslots,
			// ZKCAL-70: index out of number of total slots index
			index = Math.max(((date.getHours() - this._bt) * timeslots) +
						Math.floor(date.getMinutes() / timeslotTime), 0),
			maxAvailableTimeslotIndex = (this._et - this._bt) * timeslots - 1;
		
		return Math.min(index, maxAvailableTimeslotIndex);
	},
	
	_getTimeOffset: function (date, duration, duration2) {
		var clonedDate = new Date(date),
			index = duration2 ? duration2 : this.getTimeIndex(date) + duration,
			timeslots = this._timeslots;

		clonedDate.setHours(this._bt + Math.floor(index / timeslots), (index % timeslots) * (60 / timeslots), 0, 0);
		date.setMilliseconds(0);

		return duration2 ? clonedDate - date : date - clonedDate;
	},

	fixPosition: function () {
		var perRowHeight = this.perHeight,
			weekDay = this.weekDay,
			hourCount = this._et - this._bt,
			timeslots = this._timeslots,
			slotCount = hourCount * this._timeslots;

		for (var daySpaceIndex = 0; daySpaceIndex < this._daySpace.length; daySpaceIndex++) {
			var calItemlist = this._daySpace[daySpaceIndex];
			if (!calItemlist.length) continue;
			var calItemsOneDay = [];
			for (var timeSlotIndex = slotCount; timeSlotIndex--;)
				calItemsOneDay[timeSlotIndex] = [];
			/*  position .calitem according to timeslot into a 2D-array
                Item A's timeslot index 5 ~ 7
                Item B's timeslot index 6 ~ 8
                calItemsOneDay[5] = [A]
                calItemsOneDay[6] = [A, B]
                calItemsOneDay[7] = [A, B]
                calItemsOneDay[8] = [B]
             */
			for (var calItemIndex = 0; calItemIndex < calItemlist.length; calItemIndex++) {
				var calendarItemNode = calItemlist[calItemIndex],
					calendarItemWidget = zk.Widget.$(calendarItemNode),
					target = weekDay[calendarItemNode._preOffset].firstChild,
					calendarItemData = calendarItemWidget.item,
					beginDate = new Date(calendarItemData.zoneBd),
					endDate = new Date(calendarItemData.zoneEd),
					isCrossDay = endDate.getDate() != beginDate.getDate();
				jq(target).append(calendarItemNode);
				calendarItemNode.style.visibility = '';

				calendarItemNode._bd = beginDate;
				calendarItemNode._ed = endDate;
				// cross day
				if (isCrossDay)
					endDate = new Date(endDate.getTime() - 1000);

				// fix hgh
				var beginTimeIndex = this.getTimeIndex(beginDate),
					endTimeIndex = this.getTimeIndex(endDate),
					top = beginTimeIndex * perRowHeight,
					timeslots = this._timeslots,
					beginDateHeightOffs = 0,
					endDateHeightOffs = 0;

				if (beginTimeIndex) {
					var beginDateTimeslot = this.$class._getHightOffsPercent(beginDate, timeslots);
					beginDateHeightOffs = beginDateTimeslot ? perRowHeight * beginDateTimeslot : 0;
				}
				if (endTimeIndex) {
					var endDateTimeslot = this.$class._getHightOffsPercent(endDate, timeslots);
					endDateHeightOffs = endDateTimeslot ? perRowHeight * endDateTimeslot : 0;
					if (isCrossDay)//ZKCAL-29
						endDate = new Date(endDate.getTime() + 1000);
				}

				calendarItemNode._bi = beginTimeIndex;
				calendarItemNode._ei = endTimeIndex;
				calendarItemNode.style.top = jq.px(top + beginDateHeightOffs);
				this.$class._setItemWgtHeight(this, calendarItemNode, calendarItemNode.id, ((endTimeIndex - beginTimeIndex) * perRowHeight) - beginDateHeightOffs + endDateHeightOffs);

				if (beginIndex < 0) continue;

				// width info
				for (var timeIndex = 0; beginTimeIndex <= endTimeIndex && beginTimeIndex < slotCount;) {
					var tmp = calItemsOneDay[beginTimeIndex++];
					if (tmp[timeIndex]) {
						for (;;) {
							if (!tmp[++timeIndex])
								break;
						}
					}
					tmp[timeIndex] = calendarItemNode;
				}
			}

			this.clearGhost();

			var calendarItemWidget = calItemlist[calItemlist.length - 1],
				target = weekDay[calendarItemWidget._preOffset].firstChild;

			for (var currentItem = target.firstChild; currentItem; currentItem = currentItem.nextSibling) {
				var	beginDate = currentItem._bd,
					beginIndex = currentItem._bi,
					endIndex = currentItem._ei,
					maxOverlappingItemCount = 0,
					checkedItems = {}; // item ID been checked

				if (beginIndex < 0) continue;
				// count max overlapping items by checking each timeslot
				for (var slotIndex = beginIndex; slotIndex <= endIndex && slotIndex < slotCount; slotIndex++) {
					let nItemOneSlot = calItemsOneDay[slotIndex].length; // >1 means there is overlapping items
					let overlappingItemCount = 1 < nItemOneSlot ? nItemOneSlot : 1;
					if (nItemOneSlot <=0 ){ continue; }
					for (let slotItemIndex = 0; slotItemIndex < nItemOneSlot; slotItemIndex++) {
						let sameSlotItem = calItemsOneDay[slotIndex][slotItemIndex]; //another item in the same timeslot
						if (!sameSlotItem){ //empty slot
							overlappingItemCount--;
							continue;
						}
						if (currentItem == sameSlotItem || checkedItems[sameSlotItem.id]){ //same one or checked item
							continue;
						}
						//when an item's end time equals to another one's start time, treat these items as non-overlapped items
						if (!this.$class.isTimeOverlapping(currentItem, sameSlotItem)){
							overlappingItemCount--;
							continue;
						}
						checkedItems[sameSlotItem.id] = 1;
						var endIndex2 = sameSlotItem._ei;
						if (endIndex < endIndex2)
							endIndex = endIndex2;
					}
					maxOverlappingItemCount = maxOverlappingItemCount > overlappingItemCount? maxOverlappingItemCount : overlappingItemCount;
				}
				var concurentItemCount = maxOverlappingItemCount ? maxOverlappingItemCount : 1,
					width = 100 / concurentItemCount,
					index = calItemsOneDay[beginIndex].indexOf(currentItem);
				let nEmptyPosition = calItemsOneDay[beginIndex].length > maxOverlappingItemCount;
				index = nEmptyPosition > 0 ? index - nEmptyPosition : index;

				if (!this.$class.isOverlapping(maxOverlappingItemCount) || index == maxOverlappingItemCount - 1)
					currentItem.style.width = width + '%';
				else
					currentItem.style.width = (width * 1.7) + '%';

				if (this.$class.isOverlapping(maxOverlappingItemCount) && index > 0){
					currentItem.style.left = width * index + '%';
				}else{
					currentItem.style.left = '';
				}

				var fce = currentItem.previousSibling,
					moved = false;

				// adjust the order
				while (fce) {
					if (calItemsOneDay[fce._bi].indexOf(fce) > index) {
						fce = fce.previousSibling;
						moved = true;
					} else {
						if (moved) {
							var next = currentItem.nextSibling;
							jq(fce).after(jq(currentItem));
							currentItem = next ? next.previousSibling : currentItem;
						}
						break;
					}
				}
			}
		}
	},
		
	beforeSize: function () {
		if(zk.ie6_){
			return false;
		}
		var inner = this.$n('inner');
		inner.style.height = '0px';
		inner.lastChild.style.height = '0px';
	},
	
	onSize: _zkf = function () {
		this._updateCntHeight();
		if (!this.perHeight) {
			this.perHeight = this.cntRows.firstChild.firstChild.offsetHeight / this._timeslots;
			this.createChildrenWidget_();
			this._rePositionDaylong();
			this._rePositionDay();
			var a = this.$n('hdarrow');
			//arrow position
			a.style.left = jq.px((a.parentNode.offsetWidth * this._zones.length - a.offsetWidth) - 5);
		}
		
		var calendarDomNode = this.$n(),
			calendarHeight = calendarDomNode.offsetHeight;
		this.clearGhost();
		if (!calendarHeight) return;
			
		var innerNode = this.$n('inner'),
			contentNode = this.$n('cnt'),
			cntHeight = zk(innerNode.parentNode).padBorderHeight() +
						zk(innerNode).padBorderHeight() +
						zk(contentNode).padBorderHeight() +
						jq(contentNode).find('.z-calendars-week-cnt').outerHeight() +
						jq(innerNode).find('.z-calendars-week-header').height(),
			row = this.cntRows;
		for (var child = calendarDomNode.firstChild; child; child = child.nextSibling) {
			if (this.isLegalChild(child))
				calendarHeight -= child.offsetHeight;
		}
		
		if (calendarHeight > cntHeight)
			calendarHeight = cntHeight;
		
		calendarHeight = zk(innerNode.parentNode).revisedHeight(calendarHeight);
		calendarHeight = zk(innerNode).revisedHeight(calendarHeight);
		innerNode.style.height = jq.px0(calendarHeight);
		calendarHeight -= innerNode.firstChild.offsetHeight;
		calendarHeight = zk(innerNode.lastChild).revisedHeight(calendarHeight);
		innerNode.lastChild.style.height = jq.px(calendarHeight);

		// sync scrollTop
		contentNode.scrollTop = this._scrollInfo[calendarDomNode.id];


		var offs = zk(contentNode).revisedOffset(),
			contentOffsetLeft = offs[0],
			cells = row.cells,
			lefts = [];
		for (var reverseZoneIndex = this._zones.length, currentLeft = contentOffsetLeft, currentCell = cells[0]; currentCell; currentCell = currentCell.nextSibling) {
			currentLeft += currentCell.offsetWidth;
			if (--reverseZoneIndex <= 0)
				lefts.push(currentLeft);
		}
		contentNode._lefts = lefts;
		//Fix ZKCAL-55: Problems with horizontal scrollbar
		//get the initial offset left value
		this._initLeft = contentOffsetLeft;

		this.closeFloats();

		// scrollbar width
		var width = contentNode.offsetWidth - contentNode.firstChild.offsetWidth,
			table = contentNode.previousSibling.firstChild;
		table.rows[0].lastChild.style.width = jq.px(zk(table.rows[1].firstChild).revisedWidth(width));
	},

	_updateCntHeight: function() {
		var $cnt = jq(this.$n('cnt')),
			timeslots = this._timeslots,
			hourCount = this._et - this._bt, //end time minus begin time
			$firstSlot = $cnt.find('.z-calendars-hour-sep')[0], //fine tune if user customize height by CSS
			slotHeight = $firstSlot ?
				($firstSlot.offsetHeight + zk($firstSlot).sumStyles('tb', jq.margins) + 1) : 46, //default slot height 46px?
			totalHeight = hourCount * slotHeight * timeslots / 2;
		$cnt.find('.z-calendars-week-cnt').height(totalHeight);
		jq(this.cntRows).find('.z-calendars-week-day-cnt').height(totalHeight).css('margin-bottom', -totalHeight);
		jq(this.cntRows).find('.z-calendars-hour-of-day').height(slotHeight * timeslots / 2 - 1);
		this._slotOffs = 12 / timeslots;
		this.beginIndex = this._bt * timeslots;
	},
	_updateHourColSize: function() {
		var cntRows = this.cntRows,
			timeRows = cntRows.cells,
			ts = this._zones.length,
			timeslots = this._timeslots,
			hourCount = this._et - this._bt,
			offset = hourCount - timeRows[0].childNodes.length;
		
		if (!offset) return;
		
		if (offset > 0) {
			var hourRowHtml = '<div class="z-calendars-hour-of-day"></div>',
				hourSepRowHtml = '<div class="z-calendars-hour-sep"></div>',
				html = [];
			for (var i = offset; i--;)
				html.push(hourRowHtml);
			html = html.join('');
			for (var i = ts; i--;)
				jq(timeRows[ts - i - 1]).append(html);
			
			html = [];
			for (var i = offset * timeslots / 2; i--;)
				html.push(hourSepRowHtml);
			jq(cntRows.previousSibling.lastChild).find('.z-calendars-hour-inner').append(html.join(''));
		} else if (offset < 0) {
			for (var i = ts; i--;)
				jq(timeRows[ts - i - 1]).children('.z-calendars-hour-of-day:gt(' + (hourCount - 1) + ')').remove();
			jq(cntRows.previousSibling.lastChild).find('.z-calendars-hour-sep:gt(' + (hourCount * timeslots / 2 - 1) + ')').remove();
		}
		
		this._updateCntHeight();
		// recalculate
		this.beforeSize();
		this.onSize();
	},
	_updateTimeZoneColSize: function() {
		var cntRows = this.cntRows,
			ts = this._zones.length,
			offset = ts - (cntRows.previousSibling.childNodes.length - 1);
		
		if (!offset) return;
		
		var header = this.$n('header'),
			a = this.$n('hdarrow');
		a.style.left = jq.px((a.parentNode.offsetWidth * ts - a.offsetWidth) - 5);
		if (offset > 0) {
			var zoneTH = '<th class="z-calendars-timezone" rowspan="3"></th>',
				zoneTD = '<td class="z-calendars-timezone"></td>',
				zoneHourTD = '<td class="z-calendars-timezone">' + jq(cntRows).children('.z-calendars-timezone-end').html() + '</td>',
				html1 = [], html2 = [], html3 = [];
			
			for (var i = offset; i--;) {
				html1.push(zoneTH);
				html2.push(zoneTD);
				html3.push(zoneHourTD);
			}
			jq(header).children('.z-calendars-timezone-end').before(html1.join(''));
			jq(cntRows.previousSibling).children('.z-calendars-timezone-end').before(html2.join(''));
			jq(cntRows).children('.z-calendars-timezone-end').before(html3.join(''));
		} else if (offset < 0) {
			jq(header).children('.z-calendars-timezone-end').prevAll().slice(ts - 1).remove();
			jq(cntRows.previousSibling).children('.z-calendars-timezone-end').prevAll().slice(ts - 1).remove();
			jq(cntRows).children('.z-calendars-timezone-end').prevAll().slice(ts - 1).remove();
		}
		if (zk.ie || zk.opera)
			this._reputContent();
		return true;
	},
	_reputContent: function() {
		var uuid = this.uuid;
				
		jq(document.body).append(this.blockTemplate.replace(new RegExp("%1", "g"), function (match, index) {
			return uuid;
		}));
		var temp = jq('#' + uuid + '-tempblock'),
			hdTable = this.$n('header').offsetParent,
			parent = hdTable.parentNode,
			cnt = this.$n('cnt'),
			cntTable = cnt.firstChild;

		temp.append(hdTable);
		temp.append(cntTable);
		jq(parent).append(hdTable);
		jq(cnt).append(cntTable);
		temp.remove();
	},
	/**
	 * Builds a display time of day string
	 * ex. 00:00
	 * Time == increment * index minutes from 00:00 
	 * 
	 * @param {Int} index index of the time to display
	 * @param {Int} step step size in minutes
	 * @returns displayTime
	 */
	getDateTime(index, step){
		var rawMinutes = index * step,
			minutes = rawMinutes % 60,
			hours = Math.floor(rawMinutes / 60),
			displayTime = '' + ('' + hours).padStart(2,'0') + ":" + ('' + minutes).padStart(2,'0');
		return displayTime;
	},
		
	onShow: _zkf
},{













	_ignoreDaydrag: function (dg, p, evt) {
		var cnt = dg.node,
			widget = dg.control;
		
		if (zk.processing || !cnt._lefts || p[0] <= cnt._lefts[0] || p[0] > cnt._lefts[cnt._lefts.length - 1])
			return true;

		// clear ghost
		widget.clearGhost();
		var n = evt.domTarget,
			targetWidget = zk.Widget.$(n);
		if (targetWidget.className == 'calendar.DayItem' && (!n.parentNode || targetWidget.item.isLocked))
			return true;
		else if (n.nodeType == 1 && (jq(n).hasClass('z-calitem-resizer-icon')) || jq(n).hasClass('z-calitem-resizer')) {
			if (widget._dragItems[cnt.id])
				widget._dragItems[cnt.id]._zrz = true;
		}
		return false;
	},
	
	_ghostDaydrag: function (dg, ofs, evt) {
		
		var cnt = dg.node,
			targetWidget = dg.control._resizing ? dg.control._resizing : zk.Widget.$(evt.domTarget),
			ce = targetWidget.className == 'calendar.DayItem' ? targetWidget.$n() : null,
			widget = dg.control,
			ts = widget._zones.length,
			dayColumns = widget.cntRows.cells,
			perWidgetHeight = widget.perHeight;
		dg._zcells = dayColumns;
		dg._zoffs = {
			top: zk(cnt).revisedOffset()[1],
			height: cnt.offsetHeight,
			size: dayColumns.length - ts, // the size of the event column
			beginColIndex: ts, // begin index
			perWidgetHeight: perWidgetHeight, // per height
			totalHeight: dayColumns[ts].firstChild.offsetHeight // total height
		};
		if (!ce) widget.$class._createDragStart(dg, evt);
		else {
			var timeslotTime = 60 / widget._timeslots,
				bdOffs = ce._bd.getMinutes() % timeslotTime,
				edOffs = ce._ed.getMinutes() % timeslotTime;
			
			if (bdOffs || edOffs) {
				jq.alert('Only allowed to move within fitted timeslot', {icon: 'ERROR'});
				ce._error = true;
				ce.style.visibility = '';
				jq('#' + widget.uuid + '-dd').remove();
			}
			
			var draggedGhost = ce.cloneNode(true),
				uuid = widget.uuid,
				beginIndex = widget.beginIndex;
			
				
			draggedGhost.id = uuid + '-dd';

			//reset
			ce.parentNode.appendChild(draggedGhost);
			ce.style.visibility = 'hidden';
			dg.node = jq('#' + uuid + '-dd')[0];

			dg._zcalendarItemNode = ce;
			dg._zhd = dg.node.childNodes[0].firstChild.firstChild.firstChild;
			
			if (dg._zrz) widget.$class._resizeDragStart(dg);
			else widget.$class._updateDragStart(dg, evt, ce, draggedGhost);
			
			// begin index
			dg._zoffs.beginCellIndex = beginIndex + Math.floor(ce.offsetTop / perWidgetHeight);
			// end index
			dg._zoffs.endCellIndex = beginIndex + Math.ceil(ce.offsetHeight / perWidgetHeight);
		}
		return dg.node;
	},

	_drawDaydrag: function (dg, p, evt) {
		if (dg._zcalendarItemNode && dg._zcalendarItemNode._error) return;
		
		var widget = dg.control,
			zoffs = dg._zoffs,
			y = evt.pageY,
			y1 = zoffs.top,
			cnt = dg.handle,
			ph = zoffs.perWidgetHeight;

		// avoid the wrong mousemove event in IE6.
		if (zk.ie6_ && zoffs.x &&
			evt.pageX == zoffs.x &&
				zoffs.y == y) {
			zoffs.x = null;
			return;
		}

		// fix scroll bar
		var move = 0, steps;
		if (y - ph < y1) {
			clearInterval(widget.run);
			move = cnt.scrollTop;
			steps = ph;
		} else if (y + ph > y1 + zoffs.height) {
			clearInterval(widget.run);
			move = cnt.scrollHeight - cnt.scrollTop - cnt.offsetHeight;
			steps = -ph;
		} else clearInterval(widget.run);

		if (move > 0)
			widget.run = setInterval(function () {
				if (move <= 0) {
					clearInterval(widget.run);
					return;
				}
				cnt.scrollTop -= steps;
				move -= (steps < 0 ? -steps : steps);
			}, 100);
			
		if (!dg._zcalendarItemNode) widget.$class._createDragging(dg, evt);
		else if (dg._zrz) widget.$class._resizeDragging(dg, evt);
		else widget.$class._updateDragging(dg, evt);
	},

	_endghostDaydrag: function (dg, origin) {
		var wgt = dg.control;
		if (dg._zcalendarItemNode) {
			wgt.$class._updateDragEndghost(dg);
			if (dg._zrz)
				wgt.$class._resizeDragEndghost(dg);
		} else wgt.$class._createDragEndghost(dg);
	},

	_endDaydrag: function (dg, evt) {
		if (!dg || !dg._zdata) return;
		var widget = dg.control,
			ghostNode = dg._zdata.ghostNode;
		
		if (widget._resizing) {
			widget._resizing = null;
		}
			
		if (dg._zcalendarItemNode && dg._zcalendarItemNode._error) {
			dg._zcalendarItemNode._error = false;
			dg._zcalendarItemNode.style.visibility = '';
			jq('#' + widget.uuid + '-dd').remove();
			return;
		}
		clearInterval(widget.run);
		//keep ghostNode not be disappear
		ghostNode.parent.append(jq(ghostNode));

		if (!dg._zcalendarItemNode) widget.$class._createDragEnd(dg, evt);
		else if (dg._zrz) widget.$class._resizeDragEnd(dg, evt);
		else widget.$class._updateDragEnd(dg, evt);
		
		// fix opera jumping
		if (zk.opera)
			dg.handle.scrollTop = widget._scrollInfo[widget.uuid];
			
		dg._zchanged = dg._zecnt = dg._zrzoffs =
		dg._zrs = dg._zdata = dg._zcells =
		dg._zoffs = dg._zcalendarItemNode = null;
	},
	
	_resetPosition: function (draggedGhost, widget) {
		draggedGhost.style.width = '100%';
		draggedGhost.style.left = '0px';
		jq(draggedGhost).addClass(widget.getZclass() + '-evt-ghost');
	},

	isOverlapping(overlappingCount){
		return overlappingCount > 1;
	},

	_getHightOffsPercent: function(date, timeslots) {
		var timeslotTime = 60 / timeslots,
			beginDateTimeslot = date.getMinutes() % timeslotTime;
		
		if (!beginDateTimeslot) return 0;
		return beginDateTimeslot / timeslotTime;
	},
	
	_setItemWgtHeight: function(calendarWidget, calitem, id, height) {
		var body = jq(calitem).find('#' + id + '-body')[0],
			inner = body.firstChild.firstChild;
		
		for (var child = jq(calitem).children()[0]; child; child = child.nextSibling) {
			if (calendarWidget.isLegalChild(child))
				height -= child.offsetHeight;
		}
		height = zk(body).revisedHeight(height);
		height = zk(body.firstChild).revisedHeight(height);
		height = zk(inner).revisedHeight(height - 2);
		if (height > calendarWidget.$class.HALF_HOUR_HEIGHT){
			inner.style.height = jq.px(height);
		}
	},

	_getSlotCount: function(bd, ed, timeslots) {
		var timeslotTime = 60 / timeslots,
			bdHour = (typeof bd) == 'number' ? bd : bd.getHours(),
			edHour = (typeof ed) == 'number' ? ed : ed.getHours(),
			bdMinu = (typeof bd) == 'number' ? 0 : bd.getMinutes(),
			edMinu = (typeof ed) == 'number' ? 0 : ed.getMinutes();
		return (edHour - bdHour) * timeslots +
						(edMinu - bdMinu) / timeslotTime;
	},
	
	_createDragStart: function(dg, evt) {
		var cnt = dg.node,
			widget = dg.control,
			uuid = widget.uuid,
			cells = widget.cntRows.cells,
			ph = widget.perHeight,
			x = evt.pageX,
			y = evt.pageY,
			y1 = dg._zoffs.top,
			cIndex = dg._zoffs.size,
			begin = dg._zoffs.beginColIndex,
			timeslots = widget._timeslots;
			
		widget._dragItems[cnt.id]._zrz = false;
		for (; cIndex--;) {
			//Fix ZKCAL-55: Problems with horizontal scrollbar
			//should consider cnt offset position if it is wrapped by a scrollable container 
			if (cnt._lefts[cIndex] <= (x - zk(cnt).revisedOffset()[0] + widget._initLeft))
				break;
		}
		if (cIndex < 0)
			cIndex = 0;
		jq(cells[begin + cIndex].firstChild).append(
			widget.getDragAndDropTemplate(widget.uuid + '-dd', 'z-calitem')
		);

		dg._zoffs.x = x;
		dg._zoffs.y = y;

		dg.node = jq('#' + uuid + '-dd')[0];
		dg.node.parent = jq(cells[begin + cIndex].firstChild);

		dg._zecnt = dg.node.childNodes[0].firstChild.firstChild;
		jq(dg.node).addClass(widget.getZclass() + '-evt-ghost');
		var r = y + dg.handle.scrollTop - y1;
		r = Math.floor(r / ph);
		dg.node.style.top = jq.px(r * ph);

		var offsHgh = 0,
			body = jq('#' + uuid + '-dd-body')[0],
			height = 0,
			inner = body.firstChild.firstChild;
		inner.firstChild.innerHTML =
			widget.getDateTime(r * widget._slotOffs, 5) + ' - ' +
				widget.getDateTime(r * widget._slotOffs + 12, 5);
		
		for (var child = jq(dg.node).children().get(0);child;child = child.nextSibling) {
			if (widget.isLegalChild(child))
				height += child.offsetHeight;
		}

		height += zk(body).padBorderHeight();
		height += zk(body.firstChild).padBorderHeight();
		height += zk(inner).padBorderHeight();
		height += 2;
		dg._zrzoffs = height;

		// begin index
		dg._zoffs.beginCellIndex = r;
		// end index
		dg._zoffs.endCellIndex = r + timeslots;

		inner.style.height = jq.px((ph * timeslots) - height);
		dg._zhd = inner.firstChild;
	},
	
	_createDragging: function(draggable, evt) {
		var widget = draggable.control,
			draggedGhost = draggable.node,
			cnt = draggable.handle,
			zoffs = draggable._zoffs,
			mouseTop = evt.pageY,
			draggedTop = zoffs.top,
			draggedHeight = zoffs.height,
			perWidgetHeight = zoffs.perWidgetHeight,
			draggedBeginIndex = zoffs.beginCellIndex,
			endIndex = zoffs.endCellIndex;
		
		if (mouseTop < draggedTop)
			mouseTop = draggedTop;
		else if (mouseTop + perWidgetHeight > draggedTop + draggedHeight)
			mouseTop = draggedTop + draggedHeight - perWidgetHeight;

		var r = Math.ceil((mouseTop + cnt.scrollTop - draggedTop) / perWidgetHeight);
			
		if (r < draggedBeginIndex)
			draggedBeginIndex = r;
		else if (r > draggedBeginIndex)
		endIndex = r;

		if (draggedGhost.offsetTop != draggedBeginIndex * perWidgetHeight)
			draggedGhost.style.top = jq.px(draggedBeginIndex * perWidgetHeight);

		var hgh = ((endIndex - draggedBeginIndex) * perWidgetHeight) - draggable._zrzoffs,
			beginIndex = widget.beginIndex;
		if (draggable._zecnt.offsetHeight != hgh)
		draggable._zecnt.style.height = jq.px(hgh);

		// Update header
		draggable._zhd.innerHTML =
			widget.getDateTime((beginIndex + draggedBeginIndex) * widget._slotOffs, 5) + ' - ' +
				widget.getDateTime((beginIndex + endIndex) * widget._slotOffs, 5);
	},
	
	_createDragEndghost: function(dg) {
		var widget = dg.control,
			hgh = dg._zoffs.perWidgetHeight;
			
		dg._zdata = {
			rows: dg.node.offsetTop / hgh,
			cols: dg.node.parentNode.parentNode.cellIndex - widget._zones.length,
			dur: Math.ceil(dg.node.offsetHeight / hgh),
			ghostNode: dg.node
		};
	},
	
	_createDragEnd: function(dg, evt) {
		var widget = dg.control,
			rows = dg._zdata.rows,
			bd = new Date(widget.zoneBd),
			timeslotTime = 60 / widget._timeslots;
			
		bd.setDate(bd.getDate() + dg._zdata.cols);
		bd.setMilliseconds(0);// clean
		var ed = new Date(bd);
		rows += widget.beginIndex;
		bd.setMinutes(bd.getMinutes() + rows * timeslotTime);
		ed.setMinutes(ed.getMinutes() + (rows + dg._zdata.dur) * timeslotTime);
		
		widget.fireCalEvent(bd, ed, evt);
	},
	
	_resizeDragStart: function(dg) {
		dg._zrzoffs = dg.node.offsetHeight + 2 - dg._zhd.parentNode.offsetHeight;
		dg._zecnt = dg.node.childNodes[0].firstChild.firstChild;
	},
	
	_resizeDragging: function(dg, evt) {
		var widget = dg.control,
			draggedGhost = dg.node,
			cnt = dg.handle,
			zoffs = dg._zoffs,
			y = evt.pageY,
			y1 = zoffs.top,
			h1 = zoffs.height,
			ph = zoffs.perWidgetHeight,
			ce = dg._zcalendarItemNode;
		
		if (y + ph > y1 + h1)
			y = y1 + h1 - ph;

		var r = y + cnt.scrollTop - y1;

		r = Math.ceil(r / (ph));

		var height = (r * ph - draggedGhost.offsetTop) - dg._zrzoffs;

		if (height < 0) {
			height = ph - dg._zrzoffs;
			r = dg._zoffs.beginCellIndex + 1;
		}
		if (dg._zecnt.offsetHeight != height) {
			dg._zecnt.style.height = jq.px(height);
			if (!dg._zchanged) widget.$class._resetPosition(draggedGhost, widget);
			dg._zchanged = true;
		}
		// Update header
		r += widget.beginIndex;
		dg._zhd.innerHTML =
			widget.getDateTime(zoffs.beginCellIndex * widget._slotOffs, 5) + ' - ' +
				widget.getDateTime(r * widget._slotOffs, 5);
	},
	
	_resizeDragEndghost: function(dg) {
		dg._zdata.dur = Math.round((dg.node.offsetHeight - dg._zcalendarItemNode.offsetHeight) / dg._zoffs.perWidgetHeight);
	},
	
	_resizeDragEnd: function(dg, evt) {
		var widget = dg.control,
			dur = dg._zdata.dur,
			timeslots = widget._timeslots,
			ce = dg._zcalendarItemNode,
			bd = new Date(ce._bd),
			ed = new Date(ce._ed),
			edHour = ed.getHours(),
			bt = widget._bt,
			et = widget._et,
			isOverEndTime = edHour > et || (edHour == et && ed.getMinutes() > 0);
			
		if (dur || isOverEndTime) {
			//reset in time range
			if (isOverEndTime)
				ed.setHours(widget._et, 0);
			ed.setMinutes(ed.getMinutes() + dur * (60 / widget._timeslots));
			//reset in time range
			if (bd.getHours() < bt)
				bd.setHours(bt);
			
			widget.fireCalEvent(bd, ed, evt, ce.id);
			widget._restoreCalendarItemNode = ce;
		} else {
			jq('#' + widget.uuid + '-dd').remove();
			ce.style.visibility = '';
		}
		dg._zrz = false;
	},
	
	_updateDragStart: function(dg, evt, ce, draggedGhost) {
		var widget = dg.control,
			targetWgt = zk.Widget.$(ce),
			bd = new Date(ce._bd),
			ed = new Date(ce._ed),
			edHour = ed.getHours(),
			bt = widget._bt,
			et = widget._et,
			timeslots = widget._timeslots,
			timeslotTime = 60 / timeslots,
			perWidgetHeight = dg._zoffs.perWidgetHeight,
			isOverBeginTime = bd.getHours() < bt,
			isOverEndTime = edHour > et || (edHour == et && ed.getMinutes() > 0);
			
		dg._overIndex = 0;
		if (isOverBeginTime || isOverEndTime) {
			var minutes = (ed - bd) / 60000,
				id = draggedGhost.id;
			widget.$class._setItemWgtHeight(widget, draggedGhost, targetWgt.uuid,(minutes / 60 * timeslots * perWidgetHeight));
			
			if (isOverEndTime)
				dg._overIndex = widget.$class._getSlotCount(et, ed, timeslots);
			
			if (isOverBeginTime)
				dg._overIndex = widget.$class._getSlotCount(bd, bt, timeslots);
		}
		dg._zdelta = ce.offsetTop - (evt.pageY + dg.handle.scrollTop - dg._zoffs.top);
	},
	
	_updateDragging: function(dg, evt) {
		var widget = dg.control,
			draggedGhost = dg.node,
			h = dg.node.offsetHeight,
			x = evt.pageX,
			y = evt.pageY,
			y1 = dg._zoffs.top,
			cnt = dg.handle,
			zdelta = dg._zdelta,
			cellIndex = dg._zoffs.size,
			lefts = cnt._lefts,
			cells = dg._zcells,
			begin = dg._zoffs.beginColIndex,
			perWidgetHeight = dg._zoffs.perWidgetHeight,
			totalHeight = dg._zoffs.totalHeight;
		
		for (; cellIndex--;)
			if (lefts[cellIndex] <= x)
				break;
	
		if (cellIndex < 0)
		cellIndex = 0;
	
		if (cells[begin + cellIndex].firstChild != draggedGhost.parentNode) {
			cells[begin + cellIndex].firstChild.appendChild(draggedGhost);
			if (!dg._zchanged) widget.$class._resetPosition(draggedGhost, widget);
			dg._zchanged = true;
		}
	
		if (y + zdelta + cnt.scrollTop - y1 < 0)
			y = 0 - cnt.scrollTop - zdelta + y1;
		
		if (y + zdelta + h + cnt.scrollTop - y1 >= totalHeight)
			y = (totalHeight - h - cnt.scrollTop) + y1 - zdelta;
	
		var r = y + zdelta + 5 + cnt.scrollTop - y1;
		r = Math.floor(r / (perWidgetHeight));
		if (draggedGhost.offsetTop != r * perWidgetHeight) {
			draggedGhost.style.top = jq.px(r * perWidgetHeight);
			if (!dg._zchanged) widget.$class._resetPosition(draggedGhost, widget);
			dg._zchanged = true;
		}
	
		// Update header
		dg._zhd.innerHTML =
			widget.getDateTime((r + widget.beginIndex) * widget._slotOffs, 5) + ' - ' +
				widget.getDateTime((r + dg._zoffs.endCellIndex + dg._overIndex) * widget._slotOffs, 5);
	},
	
	_updateDragEndghost: function(dg) {
		var gostNode = dg.node,
			ce = dg._zcalendarItemNode;
		
		gostNode.parent = jq(gostNode.parentNode);
		dg._zdata = {
			rows: (ce.offsetTop - gostNode.offsetTop) / dg._zoffs.perWidgetHeight,
			cols: ce.parentNode.parentNode.cellIndex -
					gostNode.parentNode.parentNode.cellIndex,
			ghostNode: gostNode
		};
	},
	
	_updateDragEnd: function(dg, evt) {
		var widget = dg.control,
			cols = dg._zdata.cols,
			rows = dg._zdata.rows,
			ce = dg._zcalendarItemNode;
		if (cols || rows) {
			var timeslots = widget._timeslots,
				timeslotTime = 60 / timeslots,
				bd = new Date(ce._bd),
				ed = new Date(ce._ed),
				beginDateTimeslot = widget.$class._getHightOffsPercent(bd, timeslots),
				edOffset = ed.getTimezoneOffset(),
				bt = widget._bt,
				et = widget._et,
				offset = [cols, rows * timeslotTime];
				
			//adjust time in time range
			if (bd.getHours() < bt) {
				var slotCount = widget.$class._getSlotCount(bd, bt, timeslots);
				bd.setMinutes(bd.getMinutes() +
					slotCount * timeslotTime);
				ed.setMinutes(ed.getMinutes() +
					slotCount * timeslotTime);
			}
			bd.setDate(bd.getDate() - offset[0]);
			bd.setMinutes(bd.getMinutes() - offset[1]);
			ed.setDate(ed.getDate() - offset[0]);
			ed.setMinutes(ed.getMinutes() - offset[1]);
			var bdOffset = bd.getTimezoneOffset(),
				edOffset2 = ed.getTimezoneOffset();
			//DST: Fixed different offset after update time
			if (edOffset != edOffset2 && ed.getHours() == bd.getHours()) {
				ed = new Date(bd);
				ed.setUTCMinutes(ed.getUTCMinutes() + widget.$class._getSlotCount(bd, ed, timeslots) * timeslotTime);
			}
			widget.fireCalEvent(bd, ed, evt, ce.id);
			widget._restoreCalendarItemNode = ce;
		} else {
			jq('#' + widget.uuid + '-dd').remove();
			ce.style.visibility = '';
		}
	},
	/**
	 * Checks if the given widget is DayItem or DaylongItem
	 */
	isCalendarItem: function(widget){
		return widget?.widgetName.endsWith('item') || false;
	},
	HALF_HOUR_HEIGHT: 30, //the same in _variable.less
	TEMPLATE:{
		weekDayHeader: function(zclass){
			return`<th class="${zclass}-day-of-week"><div class="${zclass}-day-of-week-inner"><div class="${zclass}-day-of-week-cnt"></div></div></th>`
		},
	},
});
})();
