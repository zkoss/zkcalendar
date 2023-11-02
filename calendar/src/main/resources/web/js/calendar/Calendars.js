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
		ppTemplate: ['<div id="%1-pp" class="%2" style="position:absolute; top:0;left:0;">',
			'<div class="%2-body"><div class="%2-inner">',
			'<div class="%2-header"><div id="%1-ppc" class="%2-close"></div><div id="%1-pphd" class="%2-header-cnt"></div></div>',
			'<div class="%2-cnt"><div class="%2-evts"><table id="%1-ppcnt" class="%2-evt-cnt" cellpadding="0" cellspacing="0"><tbody></tbody></table></div></div>',
			'</div></div>',
			'</div>'
		].join(''),

		itemTemplate: ['<div id="%1" class="%2 %3-more-faker">',
			'<div class="%2-body %3-arrow" %5><div class="%2-inner" %8>',
			'<div class="%2-cnt" %6><div class="%2-text">%4</div></div>',
			'</div></div>',
			'</div>'
		].join(''),
		blockTemplate: '<div id="%1-tempblock"></div>',
		ropeTemplate: '<div id="%1-rope" class="%2-month-dd">',
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
			this._dragItems = this._ghost = this._itemKey = this.params = this._restoreCE = null;
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
		 * @param {*} rows from calendars._daylongSpace, contains currently displayed daylong calItem div elements
		 * @param {*} node calItem div element, has some extra attributes containing calendar item data
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
			//ZKCAL-38: bind and unbind click event separately based on enable
			if (enable) {
				/* Enable edit mode, activate listeners */
				this.bindDayLongListener();
				this._dragItems[daylong.id] = new zk.Draggable(this, daylong, {
					starteffect: widget.closeFloats,
					endeffect: cls._enddrag,
					ghosting: cls._ghostdrag,
					endghosting: cls._endghostdrag,
					change: cls._changedrag,
					draw: cls._drawdrag,
					ignoredrag: cls._ignoredrag
				});
				jq(this.$n())
					.bind('click', this.proxy(this.clearGhost));
				if (!inMonthMold) {
					var contentNode = this.$n('cnt');
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
				this.unbindDayLongListener();
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
			jq(targetElement)
				.bind('click', function(evt) {
					var widget = this;
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

		setModifyDayItem: function(itemsData) {
			itemDataArray = jq.evalJSON(itemsData);
			if (!itemDataArray.length) return;
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
					item = this.processItemData_(itemData);

				//Bug ZKCAL-47: childWidget may not in the range and has beem removed.
				if (!childWidget) {
					if (item.zoneBd > this.zoneEd || item.zoneEd < this.zoneBd) {
						//if item still not in the range, skip
						continue;
					} else {
						//if item is in the range, create childWidget.
						this.processChildrenWidget_(this.$class._isExceedOneDay(this, item), item);
						childWidget = zk.$(item.id);
					}
				}

				if (inMonthMold &&
					((isBeginTimeChange = childWidget.isBeginTimeChange(item)) || (isEndTimeChange = childWidget.isEndTimeChange(item))))
					this.removeNodeInArray_(childWidget);

				//over range
				if (item.zoneBd > this.zoneEd || item.zoneEd < this.zoneBd) {
					if (!inMonthMold)
						this.removeNodeInArray_(childWidget, wasChanged);
					this.removeChild(childWidget);
					continue;
				}

				var isExceedOneDay = this.$class._isExceedOneDay(this, item),
					clsName = childWidget.className,
					isDayItem = inMonthMold ? clsName == 'calendar.DayOfMonthItem' : clsName == 'calendar.DayItem',
					isChangeEvent = isExceedOneDay ? isDayItem : !isDayItem;

				if (isChangeEvent) {
					if (!inMonthMold)
						this[isDayItem ? '_dayItems' : '_daylongItems'].$remove(childWidget.$n());
					this.removeNodeInArray_(childWidget, wasChanged); // ZKCAL-83: should maintain _itemWeekSet
					this.removeChild(childWidget);
					this.processChildrenWidget_(isExceedOneDay, item);
					wasChanged.day = wasChanged.daylong = true;
				} else {
					childWidget.item = item;
					childWidget.update(isBeginTimeChange);

					if (inMonthMold) {
						if (isBeginTimeChange || isEndTimeChange) {
							this._putInMapList(childWidget);
						}
					} else {
						wasChanged[isExceedOneDay ? 'daylong' : 'day'] = true;
					}
				}
			}

			this.reAlignItems_(wasChanged);
		},

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
		 * @param {Array} infos 
		 * @param {DomElement} n Rope Div (.z-calendars-dd-rope)
		 * @param {int} cols clicked column index
		 * @param {int} rows clicked row index
		 * @param {*} offs offset values of UI elements  ['l': content offset left, 't': content offset top, 'w': content width, 'h': content height, 's': number of zInfo (columns)]
		 * @param {*} dim target cell dimensions ['w': width, 'h': height, 'hs': Array of offsetHeight per row]
		 * @param {*} dur 
		 * @returns 
		 */
		fixRope_: function(infos, n, cols, rows, offs, dim, dur) {
			if (!n || !offs || !dim) return;

			n.style.top = jq.px(dim.hs[rows] * rows + offs.t);
			n.style.left = jq.px(infos[cols].l + offs.l);
			n.style.height = jq.px(dim.hs[rows]);

			if (!dur)
				n.style.width = jq.px(dim.w);
			else {
				var i = offs.s - cols;
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
						e.style.cssText = '';
			}
		},

		clearGhost: function() {
			if (this.$n()) {
				if (this._ghost[this.uuid])
					this._ghost[this.uuid]();
			} else {
				for (var f in this._ghost)
					this._ghost[f]();
			}
		},

		closeFloats: function() {
			if (this._pp) {
				jq(document.body)
					.unbind('click', this.unMoreClick);
				jq(this._pp)
					.remove();
				this._pp = null;
			}
		},

		onPopupClick: function(evt) {
			var childWidget = zk.$(evt.target);
			if (childWidget.$instanceof(calendar.Item)) {
				var p = [Math.round(evt.pageX), Math.round(evt.pageY)]; //ZKCAL-42: sometimes it returns float number in IE 10
				this.fire('onItemEdit', {
					data: [childWidget.uuid, p[0], p[1], jq.innerWidth(), jq.innerHeight()]
				});
				evt.stop();
			}
		},

		isLegalChild: function(n) {
			if (!n.id.endsWith('-body'))
				return n;
		},
		onResponse: function() {
			if (this._restoreCE) {
				this._restoreCE.style.visibility = '';
				this._restoreCE = null;
			}
		}

	}, {
		_ignoredrag: function(dg, p, evt) {
			if (zk.processing) return true;
			var widget = dg.control,
				p = widget.params;

			widget.clearGhost();
			var n = evt.domTarget,
				targetWidget = zk.$(n);
			if (widget.mon && n.tagName == 'SPAN' &&
				jq(n)
				.hasClass(widget.getZclass() + '-month-date-cnt'))
				return true;
			if (n.nodeType == 1 && jq(n)
				.hasClass(p._fakerMoreCls) && !jq(n)
				.hasClass(p._fakerNoMoreCls) ||
				(targetWidget.$instanceof(calendar.Item) &&
					(!n.parentNode || targetWidget.item.isLocked)))
				return true;
			return false;
		},

		_ghostdrag: function(dg, ofs, evt) {
			var cnt = dg.node,
				widget = dg.control,
				uuid = widget.uuid,
				zcls = widget.getZclass(),
				inMonthMold = widget.mon,
				dataObj = widget.getDragDataObj_(),
				targetWidget = zk.$(evt.domEvent),
				ce = targetWidget.$instanceof(calendar.Item) ? targetWidget.$n() : null,
				hs = [];
			jq(document.body)
				.prepend(dataObj.getRope(widget, cnt, hs));
			var row = dataObj.getRow(cnt),
				width = row.offsetWidth,
				p = [evt.pageX, evt.pageY];
			dg._zinfo = [];
			for (var left = 0, n = row; n; left += n.offsetWidth, n = n.nextSibling)
				dg._zinfo.push({
					l: left,
					w: n.offsetWidth
				});

			dg._zoffs = zk(inMonthMold ? cnt : dg.handle)
				.revisedOffset();
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
				jq(faker)
					.addClass(zcls + '-evt-faker-dd');

				faker.style.width = jq.px(width);
				faker.style.height = jq.px(h);
				faker.style.left = jq.px(p[0] - (width / 2));
				faker.style.top = jq.px(p[1] + h);

				jq(ce)
					.addClass(zcls + '-evt-dd');

				if (inMonthMold) {
					var cloneNodes = targetWidget.cloneNodes;
					if (cloneNodes)
						for (var n = cloneNodes.length; n--;)
							jq(cloneNodes[n])
							.addClass(zcls + '-evt-dd');
				}

				jq(document.body.firstChild)
					.before(jq(faker));
				dg.node = jq('#' + uuid + '-dd')[0];

				dg._zdur = calendar.Calendars._getItemPeriod(targetWidget.item);
				dg._zevt = ce;
			}

			dg._zdim = {
				w: width,
				h: hs[0],
				hs: hs
			};
			dg._zrope = jq('#' + widget.uuid + '-rope')[0];

			var cols = dataObj.getCols(p, dg),
				rows = dataObj.getRows(p, dg);

			dg._zpos = [cols, rows];

			// fix rope
			widget.fixRope_(dg._zinfo, dg._zrope.firstChild, cols, rows, dg._zoffs, dg._zdim, dg._zdur);
			return dg.node;
		},

		_drawdrag: function(dg, p, evt) {
			var node = dg.node;
			if (node.id.endsWith('-dd')) {
				var w = node.offsetWidth,
					h = node.offsetHeight,
					x = evt.pageX - (w / 2),
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

			var cols = Math.floor(x / dg._zdim.w),
				rows = Math.floor(y / dg._zdim.h),
				dur = dg._zdur,
				size = dg._zrope.childNodes.length;

			if (rows == size)
				--rows;
			if (cols == dg._zoffs.s)
				cols = dg._zoffs.s - 1;

			if (!dg._zevt) {
				var c = dg._zpos[0],
					r = dg._zpos[1],
					b = dg._zoffs.s * r + c,
					e = dg._zoffs.s * rows + cols;

				dur = (b < e ? e - b : b - e) + 1;
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

		_endghostdrag: function(dg, origin) {
			// target is Calendar's event
			dg.node = dg.handle;
		},

		_enddrag: function(dg, evt) {
			var widget = dg.control,
				cnt = dg.node,
				dg = widget._dragItems[cnt.id],
				p = [Math.round(evt.pageX), Math.round(evt.pageY)]; //ZKCAL-42: sometimes it returns float number in IE 10
			if (dg) {
				var ce, dataObj = widget.getDragDataObj_();
				if (dg._zevt) {
					var zcls = widget.getZclass(),
						targetWidget = zk.$(dg._zevt),
						item = targetWidget.item,
						bd = new Date(widget.zoneBd),
						ebd = new Date(item.zoneBd),
						ddClass = zcls + '-evt-dd',
						inMonthMold = widget.mon;
					bd = calUtil.addDay(bd, dataObj.getDur(dg));
					ebd.setFullYear(bd.getFullYear());
					ebd.setDate(1);
					ebd.setMonth(bd.getMonth());
					ebd.setDate(bd.getDate());

					jq(targetWidget.$n())
						.removeClass(ddClass);

					if (inMonthMold) {
						var cloneNodes = targetWidget.cloneNodes;
						if (cloneNodes)
							for (var n = cloneNodes.length; n--;)
								jq(cloneNodes[n])
								.removeClass(ddClass);
					}

					if (!calUtil.isTheSameDay(ebd, item.zoneBd)) {
						ce = dg._zevt;
						ce.style.visibility = 'hidden';

						var ed = new Date(item.zoneEd);
						ed.setFullYear(bd.getFullYear());
						ed.setDate(1);
						ed.setMonth(bd.getMonth());
						ed.setDate(bd.getDate() + calendar.Calendars._getItemPeriod(item) - (calendar.Calendars._isZeroTime(ed) ? 0 : 1));
						widget.fire('onItemUpdate', {
							data: [
								dg._zevt.id,
								widget.fixTimeZoneFromClient(ebd),
								widget.fixTimeZoneFromClient(ed),
								p[0],
								p[1],
								jq.innerWidth(),
								jq.innerHeight()
							]
						});
						widget._restoreCE = ce; //ZKCAL-39: should store calendar item
					}
					jq('#' + widget.uuid + '-rope')
						.remove();
					jq('#' + widget.uuid + '-dd')
						.remove();
				} else {
					var newData = dataObj.getNewDate(widget, dg);

					widget.fire('onItemCreate', {
						data: [
							widget.fixTimeZoneFromClient(newData.bd),
							widget.fixTimeZoneFromClient(newData.ed),
							p[0],
							p[1],
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
				dg._zinfo = dg._zpos1 = dg._zpos = dg._zrope = dg._zdim = dg._zdur = dg._zevt = null;
			}
		},
		isTimeOverlapping(item1, item2) {
			const begin1 = item1.zoneBd.getTime();
			const end1 = item1.zoneEd.getTime();
			const begin2 = item2.zoneBd.getTime();
			const end2 = item2.zoneEd.getTime();
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
		_compareDays: function(x, y) {
			var xDays = x._days,
				yDays = y._days;
			if (xDays > yDays)
				return 1;
			else if (xDays == yDays) {
				var xlastModify = x._lastModify,
					ylastModify = y._lastModify;

				if (xlastModify > ylastModify)
					return 1;
				else if (xlastModify == ylastModify)
					return 0;
				return -1;
			}
			return -1;
		},
		_compareStartTime: function(x, y) {
			var isDaylongMonX = zk.$(x)
				.className == 'calendar.DaylongOfMonthItem',
				isDaylongMonY = zk.$(y)
				.className == 'calendar.DaylongOfMonthItem',
				xBd = isDaylongMonX ?
				Math.min(x.upperBoundBd.getTime(), x.zoneBd.getTime()) :
				x.zoneBd.getTime(),
				yBd = isDaylongMonY ?
				Math.min(y.upperBoundBd.getTime(), y.zoneBd.getTime()) :
				y.zoneBd.getTime(),
				xEd = x.zoneEd.getTime(),
				yEd = y.zoneEd.getTime();

			if (xBd < yBd)
				return -1;
			else if (xBd == yBd) {
				if (xEd < yEd)
					return 1;
				else if (xEd == yEd)
					return 0;
				return -1;
			}
			return 1;
		},
		_getItemPeriod: function(ce) {
			var bd = new Date(ce.zoneBd),
				ed = new Date(ce.zoneEd);

			if (this._isZeroTime(ed))
				ed = new Date(ed.getTime() - 1000);

			bd.setHours(0, 0, 0, 0);
			ed.setHours(23, 59, 59, 0);

			return Math.ceil((ed - bd) / calUtil.DAYTIME);
		},

		/**
		 * Returns true if the item is larger than one full
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
		_isZeroTime: function(date) {
			return (date.getHours() + date.getMinutes() +
				date.getSeconds() + date.getMilliseconds() == 0);
		}
	});
})();