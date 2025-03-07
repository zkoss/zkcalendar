/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
(function() {
	calendar.Calendars = zk.$extends(zul.Widget, {
		/**
		 * "More..." popup container template 
		 */
		ppTemplate: ['<div id="%1-pp" class="%2" style="position:absolute; top:0;left:0;">',
			'<div class="%2-body"><div class="%2-inner">',
			'<div class="%2-header"><div id="%1-ppc" class="%2-close"></div><div id="%1-pphd" class="%2-header-cnt"></div></div>',
			'<div class="%2-cnt"><div class="%2-evts"><table id="%1-ppcnt" class="%2-evt-cnt" cellpadding="0" cellspacing="0"><tbody></tbody></table></div></div>',
			'</div></div>',
			'</div>'
		].join(''),
		/**
		 * "More..." popup container template 
		 * 
		 * @param {string} domId 
		 * @param {string} domClass 
		 * @returns 
		 */
		getPopupTemplate(domId, domClass){
			return [`<div id="${domId}-pp" class="${domClass}" style="position:absolute; top:0;left:0;">`,
				`<div class="${domClass}-body"><div class="${domClass}-inner">`,
				`<div class="${domClass}-header"><div id="${domId}-ppc" class="${domClass}-close"></div><div id="${domId}-pphd" class="${domClass}-header-cnt"></div></div>`,
				`<div class="${domClass}-cnt"><div class="${domClass}-evts"><table id="${domId}-ppcnt" class="${domClass}-evt-cnt" cellpadding="0" cellspacing="0"><tbody></tbody></table></div></div>`,
				'</div></div>',
				'</div>'
			].join('')
		},

		/**
		 * "More..." popup item template
		 */
		itemTemplate: ['<div id="%1" class="%2 %3-more-faker">',
			'<div class="%2-body %3-arrow" %5><div class="%2-inner" %8>',
			'<div class="%2-cnt" %6><div class="%2-text">%4</div></div>',
			'</div></div>',
			'</div>'
		].join(''),
		/**
		 *  ???
		 */
		blockTemplate: '<div id="%1-tempblock"></div>',
		/**
		 * Rope container (container for floating blue drag-n-drop area)
		 */
		ropeTemplate: '<div id="%1-rope" class="%2-month-dd">',
		/**
		 * Rope cell (cell for floating blue drag-n-drop area)
		 */
		ddRopeTemplate: '<div class="%1-dd-rope"></div>',

		$define: {
			readonly: function() {
				if (!this.$n()) return;
				this.editMode(!this._readonly);
			},
			cd: function() {
				this._currentDate = new Date(this._cd);
				this.updateDateRange_();
			},
			firstDayOfWeek: function() {
				this.updateDateRange_();
			},
			escapeXML: null
		},

		bind_: function() {
			this.$supers('bind_', arguments);
			this._dragItems = {};
			this._ghost = {};
			this._itemKey = {};
			this.params = {};
			zWatch.listen({
				onSize: this,
				onShow: this,
				onResponse: this
			});
		},

		unbind_: function() {
			this.clearGhost();
			// just in case
			this.closeFloats();
			zWatch.unlisten({
				onSize: this,
				onShow: this,
				onResponse: this
			});
			if (this._dragItems) {
				for (var i in this._dragItems) {
					var dragItem = this._dragItems[i];
					//ZKCAL-40: should check dragItem exist or not
					if (dragItem && dragItem.destroy) {
						dragItem.destroy();
						dragItem = this._dragItems[i] = null;
					}
				}
			}
			this._dragItems = this._ghost = this._itemKey = this.params = this._restoreCalendarItemNode = null;
			this.$supers('unbind_', arguments);
		},

		getZclass: function() {
			var zcls = this._zclass;
			return zcls ? zcls : 'z-calendars';
		},

		/**
		 * Clear drag and drop from server-side
		 * 
		 * Arguments: Boolean cleardd 
		 */
		setCleardd: function(cleardd) {
			if (cleardd)
				this.clearGhost();
		},

		/**
		 * Parse item data for display
		 * 
		 * Arguments: Java CalendarItem parsed as ['id', 'key', 'title', 'style', 'contentStyle', 'headerStyle', 'content', 'beginDate', 'endDate', 'isLocked', 'sclass', 'zclass']
		 * 
		 */

		processItemData_: function(item) {
			item.isLocked = item.isLocked == 'true' ? true : false;
			item.beginDate = new Date(zk.parseInt(item.beginDate));
			item.endDate = new Date(zk.parseInt(item.endDate));

			/* item start date in local timezone */
			item.zoneBd = this.fixTimeZoneFromServer(item.beginDate);
			/* item end date in local timezone */
			item.zoneEd = this.fixTimeZoneFromServer(item.endDate);

			var key = item.key,
				period = this._itemKey[key],
				inMonthMold = this.mon;
			if (!period) {
				/* keyDate: first day of event */
				var keyDate = zk.fmt.Date.parseDate(key);
				//keyDate.setHours(0,0,0,0);
				keyDate = calUtil.getPeriod(keyDate, this.zoneBd);

				/* period: 
					day: day index of first day in displayed timespan
					week: week index in displayed month, if month mold */
				period = {
					day: inMonthMold ? keyDate % 7 : keyDate
				};

				if (inMonthMold)
					period.week = Math.floor(keyDate / 7);

				this._itemKey[key] = period;
			}
			/* item._preOffset: number of columns before current item */
			item._preOffset = period.day;
			if (inMonthMold)
				item.startWeek = this._weekDates[period.week];

			return item;
		},

		createChildrenWidget_: function() {
			this.cleanItemArray_();
			//append all items as calendar children
			for (var i = 0, j = this._items.length; i < j; i++) {
				var oneDayItems = this._items[i];
				for (var k = 0, l = oneDayItems.length; k < l; k++) {
					var item = this.processItemData_(oneDayItems[k]);
					// if (item.zoneBd <= this.zoneEd && item.zoneEd >= this.zoneBd){
					if (this.$class.isTimeOverlapping(item, this)) {
						this.processChildrenWidget_(this.$class._isExceedOneDay(this, item), item);
					}
				}
			}
		},

		/**
		 * Clean calendar children
		 * Implemented in CalendarsDefault and CalendarsMonth
		 */

		cleanItemArray_: function(){
			//does nothing by default, replace in extended class
		},

		/**
		 * Create matching widgets for CalendarItems based on mold
		 * 
		 * @param {Boolean} isExceedOneDay item is longer than one day
		 * @param {CalendarItem} item Json object build from Java CalendarItem
		 */
		processChildrenWidget_: function(isExceedOneDay, item) {
			//does nothing, implemented in CalendarsDefault or CalendarsMonth
		},

		/**
		 * render item HTML in daylong mode, including empty columns before current object
		 * 
		 * @param {int} preOffset offset before current item (in columns)
		 * @param {*} className 
		 * @param {*} tr jq node, tr element hosting the items
		 * @param {*} dayNode calItem div element, has some extra attributes containing calendar item data
		 */
		drawItem_: function(preOffset, className, tr, dayNode) {
			var html = [],
				s = '<td class="' + className + '">&nbsp;</td>';
			for (var n = preOffset; n--;)
				html.push(s);

			html.push('<td class="' + className + '" colspan="' + dayNode._days + '"></td>');
			tr.append(html.join(''));
			jq(tr[0].lastChild)
				.append(dayNode);
		},

		/**
		 * find empty slot in the daylong grid (must have empty columns on all days of rendered calendar item)
		 *  
		 * @param {Array} rows from calendars._daylongSpace, contains currently displayed daylong calItem div elements
		 * @param {DomElement} node calItem div element, has some extra attributes containing calendar item data
		 */
		putInDaylongSpace_: function(rows, node) {
			var itemBeginDate = node.upperBoundBd,
				itemEndDate = node.lowerBoundEd,
				//currently searched row
				row,
				//boolean, found suitable space
				foundSpace;
			//find space from first row
			for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
				row = rows[rowIndex];
				// compare with all daylong event in row and find space
				for (var eventIndex = 0; eventIndex < row.length; eventIndex++) {
					foundSpace = false;
					var existingEvent = row[eventIndex],
						preBd = existingEvent.upperBoundBd,
						preEd = existingEvent.lowerBoundEd;

					/* if before or after current event */
					if (itemBeginDate >= preEd || itemEndDate <= preBd)
						foundSpace = true;
				}
				if (foundSpace) break;
			}


			if (foundSpace) {
				/* have space, add to current row */
				row.push(node);
			}
			/* no space found in existing row, create new row with this item as content */
			else rows.push([node]);
		},

		/**
		 * update begin and end date display data
		 */
		updateDateOfBdAndEd_: function() {
			var beginDate = new Date(this.bd),
				endDate = new Date(this.ed),
				inMonthMold = this.mon;
			this.zoneBd = this.fixTimeZoneFromServer(beginDate);
			this.zoneEd = this.fixTimeZoneFromServer(endDate);

			var days = this._days || 7,
				dayOfMonthBeginDate = this.zoneBd.getDay(),
				dayOfMonthEndDate = this.zoneEd.getDay(),
				diff = (dayOfMonthBeginDate <= dayOfMonthEndDate) ? (dayOfMonthBeginDate + 7 - dayOfMonthEndDate) : (dayOfMonthBeginDate - dayOfMonthEndDate);

			if (!inMonthMold && diff != days && this.zoneEd.getHours() == 23) //only DST can happen
				this.zoneEd = endDate;
		},

		/**
		 * Set the calendar as editable or readOnly
		 * 
		 * @param {Boolean} enable True: can edit, False cannot edit
		 * @returns 
		 */
		editMode: function(enable) {
			var widget = this,
				inMonthMold = this.mon,
				daylong = inMonthMold ? this.$n('cnt') : this.$n('daylong'),
				cls = this.$class;
			// a trick for dragdrop.js
			daylong._skipped = enable;
			var contentNode = this.$n('cnt');
			//ZKCAL-38: bind and unbind click event separately based on enable
			if (enable) {
				/* Enable edit mode, activate listeners */
				this.bindDayLongListener(daylong);
				this._dragItems[daylong.id] = new zk.Draggable(this, daylong, {
					starteffect: widget.closeFloats,
					endeffect: cls._endDrag,
					ghosting: cls._ghostDrag,
					endghosting: cls._endGhostDrag,
					change: cls._changeDrag,
					draw: cls._drawDrag,
					ignoredrag: cls._ignoreDrag
				});
				jq(this.$n())
					.bind('click', this.proxy(this.clearGhost));
				if (!inMonthMold) {
					jq(contentNode)
						.bind('click', function(evt) {
							if (!zk.dragging && !zk.processing) {
								widget.clearGhost();
								widget.onClick(contentNode, evt);
							} else
								evt.stop();
						});
					this._dragItems[contentNode.id] = new zk.Draggable(this, contentNode, {
						starteffect: widget.closeFloats,
						endeffect: cls._endDaydrag,
						ghosting: cls._ghostDaydrag,
						endghosting: cls._endghostDaydrag,
						change: cls._changeDaydrag,
						draw: cls._drawDaydrag,
						ignoredrag: cls._ignoreDaydrag
					});
				}
			} else {
				/* disable edit mode, remove listeners */
				this.unbindDayLongListener(daylong);
				if (this._dragItems[daylong.id])
					this._dragItems[daylong.id].destroy();
				jq(this.$n())
					.unbind('click');
				if (!inMonthMold) {
					jq(this.$n('cnt'))
						.unbind('click');
					if (this._dragItems[contentNode.id]) {
						this._dragItems[contentNode.id].destroy();
					}
				}
			}
		},
		/**
		 * Binds the event listener when clicking the header dayLond area
		 * 
		 * @param {DomElement} targetElement 
		 */
		bindDayLongListener: function(targetElement) {
			var widget = this,
				inMonthMold = this.mon;
			jq(targetElement)
				.bind('click', function(evt) {
					if (!zk.dragging && !zk.processing) {
						widget.clearGhost();
						widget[inMonthMold ? 'onClick' : 'onDaylongClick'](targetElement, evt);
					} else
						evt.stop();
				});
		},
		/**
		 * Unbinds the event listener when clicking the header dayLond area
		 * 
		 * @param {DomElement} targetElement 
		 */
		unbindDayLongListener: function(targetElement) {
			jq(targetElement)
				.unbind('click');
		},
		/**
		 * Binds the event listeners for clicking on day event elements
		 * 
		 * @param {DomElement} element 
		 */
		addDayClickEvent_: function(element) {
			var widget = this,
				zcls = this.getZclass();
			jq(element)
				.bind('mouseover', function(evt) {
					var target = evt.target;
					if (widget.isHoveringEffectElement(target))
						jq(target)
						.addClass(zcls + '-day-over');
				})
				.bind('mouseout', function(evt) {
					var target = evt.target;
					if (widget.isHoveringEffectElement(target))
						jq(target)
						.removeClass(zcls + '-day-over');
				})
				.bind('click', function(evt) {
					var target = evt.target;
					if (widget.isWeekDateHeader(target)) { //default mold
						// Access the timedata at .z-calendars-day-of-week-cnt element added in bind_()
						var time = target.closest('.z-calendars-day-of-week')
							.querySelector('.z-calendars-day-of-week-cnt')
							.time;
						widget.fire('onDayClick', {
							data: [time]
						});
					} else if (widget.isMonthDate(target)) { //month mold
						// Access the timedata added in bind_()
						var time = target.time;
						widget.fire('onDayClick', {
							data: [time]
						});
					}
					evt.stop();
				});
		},
		isHoveringEffectElement: function(element) {
			return this.isWeekDateHeader(element) || this.isMonthDate(element);
		},
		isWeekDateHeader: function(target) { //default mold
			var regex = /day-of-week/;
			return regex.test(target.className);
		},
		isMonthDate: function(target) { //month mold
			return target.classList.contains(this.getZclass() + '-month-date-cnt');
		},
		//ZKCAL-48: support tooltip
		/**
		 * Handle tooltip action on calendar Item
		 * 
		 * @param {Event} evt 
		 * @returns 
		 */
		doTooltipOver_: function(evt) {
			if (this.isListen('onItemTooltip')) {
				var zcls = this.getZclass(),
					node = evt.target,
					calendarItem = zk.$(node)
					.item;
				if (jq(node)
					.hasClass(zcls + '-evt-faker-more') && node.parentNode.id.indexOf('-frow') > 0)
					return;

				if (calendarItem) {
					var tooltip = this.getTooltip();
					if (tooltip && (pos = tooltip.indexOf(',')) > -1) {
						var pos;
						if ((pos = tooltip.indexOf(',')) > -1)
							tooltip = tooltip.substring(0, pos)
							.trim();
						tooltip = zk.$('$' + tooltip);
						if (tooltip && tooltip.isOpen()) {
							tooltip.close();
						}
					}

					var pagePosition = {
							x: Math.round(evt.pageX),
							y: Math.round(evt.pageY)
						},
						data = {
							data: [calendarItem.id, pagePosition.x, pagePosition.y, jq.innerWidth(), jq.innerHeight()]
						},
						tooltipEvent = new zk.Event(this, 'onItemTooltip', data, null, evt.domEvent),
						self = this;

					setTimeout(function() {
						if (self._tooltipEvent) {
							self.fireX(self._tooltipEvent);
							self._tooltipEvent = null; // clear
						}
					}, 300);
					self._tooltipEvent = tooltipEvent;
				} else {
					return;
				}
			}
			this.$supers('doTooltipOver_', arguments);
		},
		//ZKCAL-48: support tooltip
		doTooltipOut_: function(evt) {
			this._tooltipEvent = null;
			this.$supers('doTooltipOut_', arguments);
		},

		/**
		 * Add a new item to daylong items
		 * 
		 * @param {JSON} itemsData JSON array of CalendarsItem from server 
		 * @returns 
		 */
		setAddDayItem: function(itemsData) {
			var itemDataArray = jq.evalJSON(itemsData);
			if (!itemDataArray.length)
				return;
			this.clearGhost();

			var wasChanged = {
				day: false,
				daylong: false
			};

			for (i in itemDataArray) {
				var itemData = itemDataArray[i];
				if (zk.$(itemData.id))
					continue;
				var item = this.processItemData_(itemData);
				//over range
				//Bug ZKCAL-36: should check if item endDate and view begin Date are equal
				if (item.zoneBd >= this.zoneEd || item.zoneEd <= this.zoneBd)
					continue;

				var isExceedOneDay = this.$class._isExceedOneDay(this, item);
				this.processChildrenWidget_(isExceedOneDay, item);
				wasChanged[isExceedOneDay ? 'daylong' : 'day'] = true;
			}

			this.reAlignItems_(wasChanged);
		},

		/**
		 * modify day items
		 * 
		 * @param {JSON} itemsData JSON array of CalendarsItem from server 
		 */
		setModifyDayItem: function(itemsData) {
			itemDataArray = jq.evalJSON(itemsData);
			if (!itemDataArray.length)
				return;
			this.clearGhost();

			var wasChanged = {
				day: false,
				daylong: false
			};

			for (i in itemDataArray) {
				var itemData = itemDataArray[i];
				var childWidget = zk.$(itemData.id),
					inMonthMold = this.mon,
					isBeginTimeChange = false,
					isEndTimeChange = false, // ZKCAL-83: should maintain _itemWeekSet
					updatedItem = this.processItemData_(itemData);

				//Bug ZKCAL-47: childWidget may not in the range and has beem removed.
				if (!childWidget) {
					if (updatedItem.zoneBd > this.zoneEd || updatedItem.zoneEd < this.zoneBd) {
						//if item still not in the range, skip
						continue;
					} else {
						//if item is in the range, create childWidget.
						this.processChildrenWidget_(this.$class._isExceedOneDay(this, updatedItem), updatedItem);
						childWidget = zk.$(updatedItem.id);
					}
				}

				if (inMonthMold &&
					((isBeginTimeChange = childWidget.isBeginTimeChange(updatedItem)) || (isEndTimeChange = childWidget.isEndTimeChange(updatedItem))))
					this.removeNodeInArray_(childWidget);

				//over range
				if (updatedItem.zoneBd > this.zoneEd || updatedItem.zoneEd < this.zoneBd) {
					if (!inMonthMold)
						this.removeNodeInArray_(childWidget, wasChanged);
					this.removeChild(childWidget);
					continue;
				}

				var isExceedOneDay = this.$class._isExceedOneDay(this, updatedItem),
					clsName = childWidget.className,
					isDayItem = inMonthMold ? clsName == 'calendar.DayOfMonthItem' : clsName == 'calendar.DayItem',
					isChangeEvent = isExceedOneDay ? isDayItem : !isDayItem;
				var isSclassChanged = childWidget.isSclassChanged(updatedItem);

				if (isChangeEvent) {
					if (!inMonthMold)
						this[isDayItem ? '_dayItems' : '_daylongItems'].$remove(childWidget.$n());
					this.removeNodeInArray_(childWidget, wasChanged); // ZKCAL-83: should maintain _itemWeekSet
					this.removeChild(childWidget);
					this.processChildrenWidget_(isExceedOneDay, updatedItem);
					wasChanged.day = wasChanged.daylong = true;
				} else {
					childWidget.item = updatedItem;
					childWidget.update(isBeginTimeChange);

					if (inMonthMold) {
						if (isBeginTimeChange || isEndTimeChange) {
							this._putInMapList(childWidget);
						}
					} else {
						wasChanged[isExceedOneDay ? 'daylong' : 'day'] = true;
					}
				}
				if (isSclassChanged){
					childWidget.redrawSclass();
				}
			}

			this.reAlignItems_(wasChanged);
		},

		/**
		 * remove daylong items
		 * 
		 * @param {JSON} itemsData JSON array of CalendarsItem from server 
		 * @returns 
		 */
		setRemoveDayItem: function(itemsData) {
			var itemDataArray = jq.evalJSON(itemsData);
			if (!itemDataArray.length) return;

			var wasChanged = {
				day: false,
				daylong: false
			};

			for (i in itemDataArray) {
				var itemData = itemDataArray[i];
				var childWidget = zk.$(itemData.id);
				if (!childWidget) continue;

				this.removeNodeInArray_(childWidget, wasChanged);
				this.removeChild(childWidget);
			}
			this.reAlignItems_(wasChanged);
		},

		/**
		 * Compare the date of two calendarItem dom nodes
		 * 
		 * @param {DomElement} calendarItemDomNode1 the first date to compare
		 * @param {DomElement} calendarItemDomNode2 the 2nd date to compare
		 * @returns {Number} compared value, positive if calendarItemDomNode1 start time  > calendarItemDomNode2 start time
		 */
		dateSorting_: function(calendarItemDomNode1, calendarItemDomNode2) {
			var compareStartTime;
			if (compareStartTime = calendar.Calendars._compareStartTime(calendarItemDomNode1, calendarItemDomNode2))
				return compareStartTime;
			return calendar.Calendars._compareDays(calendarItemDomNode1, calendarItemDomNode2);
		},

		/**
		 * Adjusts a date from server-side to be used at client-side
		 * 
		 * @param {Date} date 
		 * @param {Integer} tzOffset 
		 * @returns {Date} fixed date
		 */
		fixTimeZoneFromServer: function(date, tzOffset) {
			return new Date(date.getTime() + (date.getTimezoneOffset() + (tzOffset || this.tz)) * 60000);
		},

		/**
		 * Formats a Date's time to be displayed from a different timezone
		 * 
		 * @param {Date} date 
		 * @param {Integer} tzOffset 
		 * @returns {Date} Date with time formatted to target timezone
		 */
		getTimeZoneTime: function(date, tzOffset) {
			return new Date(date.getTime() + (tzOffset - this.tz) * 60000);
		},

		/**
		 * Adjusts a date from client-side to be used at server-side
		 * 
		 * @param {Date} date 
		 * @returns {Date} date with time formatted to 
		 */

		fixTimeZoneFromClient: function(date) {
			return date.getTime() - (date.getTimezoneOffset() + this.tz) * 60000;
		},

		/**
		 * Adjust rope position
		 * Rope is the container used for drag-n-drop item create
		 * 
		 * @param {Array[{left,width}]} infos Array of items {{int} left, {int} width}, left offset, width of cells in rope (1 cell per displayed day)
		 * @param {DomElement} ropeDiv Rope Div (.z-calendars-dd-rope)
		 * @param {int} colsIndex clicked column index
		 * @param {int} rowsIndex clicked row index
		 * @param {Array} offsets offset values of UI elements  ['l': content offset left, 't': content offset top, 'w': content width, 'h': content height, 's': number of zInfo (columns)]
		 * @param {Array} dimensions target cell dimensions ['width': width, 'height': height, 'heighsPerRow': Array of offsetHeight per row]
		 * @param {int} duration duration to display
		 * @returns 
		 */
		fixRope_: function(infos, ropeDiv, colsIndex, rowsIndex, offsets, dimensions, duration) {
			if (!ropeDiv || !offsets || !dimensions) return;

			ropeDiv.style.top = jq.px(dimensions.heighsPerRow[rowsIndex] * rowsIndex + offsets.top);
			ropeDiv.style.left = jq.px(infos[colsIndex].left + offsets.left);
			ropeDiv.style.height = jq.px(dimensions.heighsPerRow[rowsIndex]);

			if (!duration)
				ropeDiv.style.width = jq.px(dimensions.width);
			else {
				var indexesOnCurrentRow = offsets.size - colsIndex;
				if (duration < indexesOnCurrentRow)
					indexesOnCurrentRow = duration;

				var totalWidth = 0;
				for (var displayedCellsLengthOnCurrentRow = 0; displayedCellsLengthOnCurrentRow < indexesOnCurrentRow; displayedCellsLengthOnCurrentRow++)
					totalWidth += infos[colsIndex + displayedCellsLengthOnCurrentRow].width;

				ropeDiv.style.width = jq.px(totalWidth);
				duration -= indexesOnCurrentRow;

				/* if duration left to display, move to next row and continue display */
				if (duration && ++rowsIndex < dimensions.heighsPerRow.length)
					this.fixRope_(infos, ropeDiv.nextSibling, 0, rowsIndex, offsets, dimensions, duration);
				else
				/* else remove existing styles from every other rows*/
					for (var elementToClear = ropeDiv.nextSibling; elementToClear; elementToClear = elementToClear.nextSibling)
						jq(elementToClear).attr('style', '');
			}
		},

		/**
		 * remove drag ghost
		 */
		clearGhost: function() {
			if (this.$n()) {
				if (this._ghost[this.uuid])
					this._ghost[this.uuid]();
			} else {
				for (var f in this._ghost)
					this._ghost[f]();
			}
		},

		/**
		 * close popups if any
		 */
		closeFloats: function() {
			if (this._pp) {
				jq(document.body)
					.unbind('click', this.unMoreClick);
				jq(this._pp)
					.remove();
				this._pp = null;
			}
		},

		/**
		 * Handle popup click events
		 * 
		 * @param {domEvent} evt 
		 */
		onPopupClick: function(evt) {
			var childWidget = zk.$(evt.target);
			if (childWidget.$instanceof(calendar.Item)) {
				var mousePosition = {x: Math.round(evt.pageX), y: Math.round(evt.pageY)}; //ZKCAL-42: sometimes it returns float number in IE 10
				this.fire('onItemEdit', {
					data: [childWidget.uuid, mousePosition.x, mousePosition.y, jq.innerWidth(), jq.innerHeight()]
				});
				evt.stop();
			}
		},

		/**
		 * true if domNode is not the calendar body element
		 * 
		 * @param {DomElement} domNode 
		 * @returns Boolean legalChild
		 */
		isLegalChild: function(domNode) {
			return (!domNode.id.endsWith('-body'));
		},
		/**
		 * restore visibility to dragged event domNode on response
		 * dragged event domNode is hidden while dragged
		 */
		onResponse: function() {
			if (this._restoreCalendarItemNode) {
				this._restoreCalendarItemNode.style.visibility = '';
				this._restoreCalendarItemNode = null;
			}
		}

	}, {
		/**
		 * Check if target is available for start drag
		 * 
		 * @param {zk.Draggable} draggable target draggable object
		 * @param {Array[0: x, 1: y]} mousePosition mouse click position (not used), array contains x at position 0, y at position 1
		 * @param {MouseEvent} evt Original mouse event 
		 * @returns 
		 */
		_ignoreDrag: function(draggable, mousePosition, evt) {
			if (zk.processing)
				return true;
			var widget = draggable.control,
				params = widget.params;

			widget.clearGhost();
			var targetNode = evt.domTarget,
				targetWidget = zk.$(targetNode),
				inMonthMold = widget.mon;
			if (inMonthMold && targetNode.tagName == 'SPAN' &&
				jq(targetNode)
				.hasClass(widget.getZclass() + '-month-date-cnt'))
				return true;
			if (targetNode.nodeType == 1 && jq(targetNode)
				.hasClass(params._fakerMoreCls) && !jq(targetNode)
				.hasClass(params._fakerNoMoreCls) ||
				(targetWidget.$instanceof(calendar.Item) &&
					(!targetNode.parentNode || targetWidget.item.isLocked)))
				return true;
			return false;
		},

		/**
		 * Create draggable ghost object from rope or from existing calendar item
		 *  
		 * @param {zk.Draggable} draggable target draggable object
		 * @param {Array[0: x, 1: y]} offets body container scroll offsets, array contains x at position 0, y at position 1, not used
		 * @param {MouseEvent} evt Original mouse event 
		 * @returns 
		 */
		_ghostDrag: function(draggable, offsets, evt) {
			var contentNode = draggable.node,
				widget = draggable.control,
				uuid = widget.uuid,
				zcls = widget.getZclass(),
				inMonthMold = widget.mon,
				dataObj = widget.getDragDataObj_(),
				targetWidget = zk.$(evt.domEvent),
				calendarItemNode = targetWidget.$instanceof(calendar.Item) ? targetWidget.$n() : null,
				heighsPerRow = [];
			jq(document.body).prepend(dataObj.getRope(widget, contentNode, heighsPerRow));
			var rowFirstCell = dataObj.getRow(draggable),
				width = rowFirstCell.offsetWidth,
				mousePosition = {x: evt.pageX, y: evt.pageY};
			draggable._zinfo = [];

			for (var left = 0, currentRowCell = rowFirstCell; currentRowCell; left += currentRowCell.offsetWidth, currentRowCell = currentRowCell.nextSibling)
				draggable._zinfo.push({
					left: left,
					width: currentRowCell.offsetWidth
				});

			draggableOffsets = zk(inMonthMold ? contentNode : draggable.handle).revisedOffset();
			draggable._zoffs = {
				left: draggableOffsets[0],
				top: draggableOffsets[1],
				width: draggable.handle.offsetWidth,
				height: draggable.handle.offsetHeight,
				size: draggable._zinfo.length
			};

			/* if dragging an existing item */
			if (calendarItemNode) {
				var faker = calendarItemNode.cloneNode(true),
					itemHeight = calendarItemNode.offsetHeight;
				faker.id = uuid + '-dd';
				jq(faker).addClass(zcls + '-evt-faker-dd');

				faker.style.width = jq.px(width);
				faker.style.height = jq.px(itemHeight);
				faker.style.left = jq.px(mousePosition.x - (width / 2));
				faker.style.top = jq.px(mousePosition.y + itemHeight);

				jq(calendarItemNode).addClass(zcls + '-evt-dd');

				if (inMonthMold) {
					var cloneNodes = targetWidget.cloneNodes;
					if (cloneNodes)
						for (var n = cloneNodes.length; n--;)
							jq(cloneNodes[n])
							.addClass(zcls + '-evt-dd');
				}

				jq(document.body.firstChild).before(jq(faker));
				draggable.node = jq('#' + uuid + '-dd')[0];

				draggable._zdraggedDuration = calendar.Calendars._getItemPeriod(targetWidget.item);
				draggable._zcalendarItemNode = calendarItemNode;
			}

			draggable._zdimensions = {
				width: width,
				height: heighsPerRow[0],
				heighsPerRow: heighsPerRow
			};
			draggable._zrope = jq('#' + widget.uuid + '-rope')[0];

			var colsIndex = dataObj.getCols(mousePosition, draggable),
				rowsIndex = dataObj.getRows(mousePosition, draggable);

				draggable._zposition = {x: colsIndex, y: rowsIndex};

			// fix rope
			widget.fixRope_(draggable._zinfo, draggable._zrope.firstChild, colsIndex, rowsIndex, draggable._zoffs, draggable._zdimensions, draggable._zdraggedDuration);
			return draggable.node;
		},

		/**
		 * draw dragged existing calendar items nodes
		 * 
		 * @param {zk.DnD.Draggable} draggable 
		 * @param {Object{x,y}} mousePosition {x,y}
		 * @param {domEvent} evt 
		 */
		_drawDrag: function(draggable, mousePosition, evt) {
			var node = draggable.node;
			if (node.id.endsWith('-dd')) {
				var nodeWidth = node.offsetWidth,
					nodeHeight = node.offsetHeight,
					nodeLeft = evt.pageX - (nodeWidth / 2),
					nodeTop = evt.pageY - nodeHeight,
					draggedLeft = draggable._zoffs.left,
					draggedTop = draggable._zoffs.top,
					draggedWidth = draggable._zoffs.width,
					draggedHeight = draggable._zoffs.height;
				/*
					left calculattion:
					If dragged further right than current position, move to dragged cell left position

					If dragged further left than original position, move to dragged cell position, offset by the difference of size between the dragged cell and the original element
				*/
				if (nodeLeft < draggedLeft)
					nodeLeft = draggedLeft;
				else if (nodeLeft + nodeWidth > draggedLeft + draggedWidth)
					nodeLeft = draggedLeft + draggedWidth - nodeWidth;

				/*
					top calculation, same logic as left
				*/
				if (nodeTop < draggedTop)
				nodeTop = draggedTop;
				else if (nodeTop + nodeHeight > draggedTop + draggedHeight)
					nodeTop = draggedTop + draggedHeight - nodeHeight;

				
				node.style.left = jq.px(nodeLeft);
				node.style.top = jq.px(nodeTop);
			}
		},

		/**
		 * redraw dragged existing calendar items nodes
		 * 
		 * @param {zk.DnD.Draggable} draggable 
		 * @param {Array[x,y]} mousePosition [0:x, 1:y] from zk updateDrag
		 * @param {domEvent} evt 
		 */
		_changeDrag: function(draggable, mousePosition, evt) {
			var widget = draggable.control,
				eventLeft = mousePosition[0],
				eventTop = mousePosition[1],
				draggedLeft = draggable._zoffs.left,
				draggedTop = draggable._zoffs.top,
				draggedWidth = draggable._zoffs.width,
				draggedHeight = draggable._zoffs.height;
			if (eventLeft < draggedLeft)
			eventLeft = draggedLeft;
			else if (eventLeft > draggedLeft + draggedWidth)
			eventLeft = draggedLeft + draggedWidth;

			if (eventTop < draggedTop)
			eventTop = draggedTop;
			else if (eventTop > draggedTop + draggedHeight)
			eventTop = draggedTop + draggedHeight;

			eventLeft -= draggedLeft;
			eventTop -= draggedTop;

			var cols = Math.floor(eventLeft / draggable._zdimensions.width),
				rows = Math.floor(eventTop / draggable._zdimensions.height),
				draggedDuration = draggable._zdraggedDuration,
				draggedSize = draggable._zrope.childNodes.length;

			if (rows == draggedSize)
				--rows;
			if (cols == draggable._zoffs.size)
				cols = draggable._zoffs.size - 1;

			if (!draggable._zcalendarItemNode) {
				var colsIndex = draggable._zposition.x,
					rowsIndex = draggable._zposition.y,
					cellIndex = draggable._zoffs.size * rowsIndex + colsIndex,
					maxCellIndex = draggable._zoffs.size * rows + cols;

				draggedDuration = (cellIndex < maxCellIndex ? maxCellIndex - cellIndex : cellIndex - maxCellIndex) + 1;
				cols = cellIndex < maxCellIndex ? colsIndex : cols;
				rows = cellIndex < maxCellIndex ? rowsIndex : rows;

			} else {
				var total = draggable._zoffs.size * draggedSize,
					count = draggable._zoffs.size * rows + cols + draggedDuration;

				if (total < count)
				draggedDuration = total - (draggable._zoffs.size * rows + cols);
			}
			if (!draggable._lastDraggedPosition || draggable._lastDraggedPosition.draggedDuration != draggedDuration || draggable._lastDraggedPosition.cols != cols || draggable._lastDraggedPosition.rows != rows) {
				draggable._lastDraggedPosition ={cols: cols, rows: rows, draggedDuration: draggedDuration};
				widget.fixRope_(draggable._zinfo, draggable._zrope.firstChild, cols, rows, draggable._zoffs, draggable._zdimensions, draggedDuration);
			}
		},

		_endGhostDrag: function(draggable, origin) {
			// target is Calendar's event
			draggable.node = draggable.handle;
		},

		/**
		 * Send updates once drag is released
		 * 
		 * @param {zk.DnD.Draggable} draggable 
		 * @param {DomEvent} evt 
		 */

		_endDrag: function(draggable, evt) {
			var widget = draggable.control,
				cnt = draggable.node,
				draggedItem = widget._dragItems[cnt.id],
				mousePosition = {x: Math.round(evt.pageX), y:Math.round(evt.pageY)}; //ZKCAL-42: sometimes it returns float number in IE 10
			if (draggedItem) {
				var calendarItemNode,
				draggedItemData = widget.getDragDataObj_();
				if (draggedItem._zcalendarItemNode) {
					var zcls = widget.getZclass(),
						targetWidget = zk.$(draggedItem._zcalendarItemNode),
						calendarItemData = targetWidget.item,
						beginDate = new Date(widget.zoneBd),
						targetBeginDate = new Date(calendarItemData.zoneBd),
						dragDropClass = zcls + '-evt-dd',
						inMonthMold = widget.mon;
					beginDate = calUtil.addDay(beginDate, draggedItemData.getDur(draggedItem));
					targetBeginDate.setFullYear(beginDate.getFullYear());
					targetBeginDate.setDate(1);
					targetBeginDate.setMonth(beginDate.getMonth());
					targetBeginDate.setDate(beginDate.getDate());

					jq(targetWidget.$n())
						.removeClass(dragDropClass);

					if (inMonthMold) {
						var cloneNodes = targetWidget.cloneNodes;
						if (cloneNodes)
							for (var n = cloneNodes.length; n--;)
								jq(cloneNodes[n])
								.removeClass(dragDropClass);
					}

					if (!calUtil.isTheSameDay(targetBeginDate, calendarItemData.zoneBd)) {
						calendarItemNode = draggedItem._zcalendarItemNode;
						calendarItemNode.style.visibility = 'hidden';

						var endDate = new Date(calendarItemData.zoneEd);
						endDate.setFullYear(beginDate.getFullYear());
						endDate.setDate(1);
						endDate.setMonth(beginDate.getMonth());
						endDate.setDate(beginDate.getDate() + calendar.Calendars._getItemPeriod(calendarItemData) - (calendar.Calendars._isZeroTime(endDate) ? 0 : 1));
						widget.fire('onItemUpdate', {
							data: [
								draggedItem._zcalendarItemNode.id,
								widget.fixTimeZoneFromClient(targetBeginDate),
								widget.fixTimeZoneFromClient(endDate),
								mousePosition.x,
								mousePosition.y,
								jq.innerWidth(),
								jq.innerHeight()
							]
						});
						widget._restoreCalendarItemNode = calendarItemNode; //ZKCAL-39: should store calendar item
					}
					jq('#' + widget.uuid + '-rope')
						.remove();
					jq('#' + widget.uuid + '-dd')
						.remove();
				} else {
					var newData = draggedItemData.getNewDate(widget, draggedItem);

					widget.fire('onItemCreate', {
						data: [
							widget.fixTimeZoneFromClient(newData.beginDate),
							widget.fixTimeZoneFromClient(newData.endDate),
							mousePosition.x,
							mousePosition.y,
							jq.innerWidth(),
							jq.innerHeight()
						]
					});
				}

				widget._ghost[widget.uuid] = function() {
					jq('#' + widget.uuid + '-rope')
						.remove();
					delete widget._ghost[widget.uuid];
				};
				draggedItem._zinfo = draggedItem._lastDraggedPosition = draggedItem._zposition = draggedItem._zrope = draggedItem._zdimensions = draggedItem._zdraggedDuration = draggedItem._zcalendarItemNode = null;
			}
		},
		/**
		 * 
		 * @param {CalendarItemData} calendarItemData1 
		 * @param {CalendarItemData} calendarItemData1 
		 * @returns 
		 */
		isTimeOverlapping(calendarItemData1, calendarItemData2) {
			const begin1 = calendarItemData1.zoneBd.getTime();
			const end1 = calendarItemData1.zoneEd.getTime();
			const begin2 = calendarItemData2.zoneBd.getTime();
			const end2 = calendarItemData2.zoneEd.getTime();
			// Check all overlap cases
			return (
				// item1 inside item2
				(begin2 >= begin1 && begin2 < end1) ||
				// item2 inside item1
				(begin1 >= begin2 && begin1 < end2) ||
				// Overlap at ends
				(begin1 <= begin2 && end1 > begin2) ||
				(begin2 <= begin1 && end2 > begin1)
			);
		},
		/**
		 * Compare the dates of 2 calendarItems Dom nodes
		 * 
		 * @param {DomElement} calendarItemDomNode1 
		 * @param {DomElement} calendarItemDomNode1 
		 * @returns 1 > 2: 1, 1 == 2: 0, 1 < 2: -1
		 */
		_compareDays: function(calendarItemDomNode1, calendarItemDomNode2) {
			var days1 = calendarItemDomNode1._days,
				days2 = calendarItemDomNode2._days;
			if (days1 > days2)
				return 1;
			else if (days1 == days2) {
				var lastModify1 = calendarItemDomNode1._lastModify,
					lastModify2 = calendarItemDomNode2._lastModify;

				if (lastModify1 > lastModify2)
					return 1;
				else if (lastModify1 == lastModify2)
					return 0;
				return -1;
			}
			return -1;
		},
		/**
		 * sort two calendarItem Dom elements by start time.
		 * If same start, order by end time too
		 * 
		 * @param {DomElement} calendarItemDomNode1 
		 * @param {DomElement} calendarItemDomNode2 
		 * @returns 
		 */
		_compareStartTime: function(calendarItemDomNode1, calendarItemDomNode2) {
				beginDate1 = (zk.$(calendarItemDomNode1) instanceof calendar.DaylongOfMonthItem) ?
					Math.min(calendarItemDomNode1.upperBoundBd.getTime(), calendarItemDomNode1.zoneBd.getTime()) :
					calendarItemDomNode1.zoneBd.getTime(),
				beginDate2 = (zk.$(calendarItemDomNode2) instanceof calendar.DaylongOfMonthItem) ?
					Math.min(calendarItemDomNode2.upperBoundBd.getTime(), calendarItemDomNode2.zoneBd.getTime()) :
					calendarItemDomNode2.zoneBd.getTime(),
				endDate1 = calendarItemDomNode1.zoneEd.getTime(),
				endDate2 = calendarItemDomNode2.zoneEd.getTime();

			if (beginDate1 < beginDate2)
				return -1;
			else if (beginDate1 == beginDate2) {
				if (endDate1 < endDate2)
					return 1;
				else if (endDate1 == endDate2)
					return 0;
				return -1;
			}
			return 1;
		},
		/**
		 * calculate the duration of an item in days
		 * If end date is exactly midnight, set end date to 23:59:59:000 instead
		 * 
		 * @param {CalendarItemData} CalendarItemData 
		 * @returns {Number} duration of the item in days
		 */
		_getItemPeriod: function(CalendarItemData) {
			var beginDate = new Date(CalendarItemData.zoneBd),
				endDate = new Date(CalendarItemData.zoneEd);

			if (this._isZeroTime(endDate))
			endDate = new Date(endDate.getTime() - 1000);

			beginDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 0);

			return Math.ceil((endDate - beginDate) / calUtil.DAYTIME);
		},

		/**
		 * Returns true if the item is larger than one full day
		 * 
		 * @param {calendar.Calendars} wgt 
		 * @param {CalendarItem as object} calendarItem 
		 * @returns Boolean
		 */
		_isExceedOneDay: function(wgt, calendarItem) {
			var itemBeginDate = new Date(calendarItem.zoneBd),
				itemEndDate = new Date(calendarItem.zoneEd);

			if (
				/* item starts before currently displayed time span */
				itemBeginDate < wgt.zoneBd
				/* item exist over new year demarkation */
				||
				itemBeginDate.getFullYear() != itemEndDate.getFullYear()
				/* item starts and ends on different dates, end date is not midnight */
				||
				(!calUtil.isTheSameDay(itemBeginDate, itemEndDate) && (itemEndDate.getHours() != 0 || itemEndDate.getMinutes() != 0))
				/* item lenght >= 1 full day, item end date is more than 1 full day away from displayed time span start date  */
				||
				(calUtil.getPeriodDoubleValue(itemEndDate, itemBeginDate) >= 1 && calUtil.getPeriodDoubleValue(itemEndDate, wgt.zoneBd) >= 1))
				return true;
		},
		/**
		 * check if a date's time is set exactly at midnight
		 * 
		 * @param {Date} date 
		 * @returns true if date's time is set at midnight (00:00:00:000)
		 */
		_isZeroTime: function(date) {
			return (date.getHours() + date.getMinutes() +
				date.getSeconds() + date.getMilliseconds() == 0);
		}
	});
})();