/* CalendarsMonth.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.CalendarsMonth = zk.$extends(calendar.Calendars, {
	
	weekRowTemplate: ['<div class="%1-month-week"><table cellspacing="0" cellpadding="0" class="%1-day-of-month-bg"><tbody><tr>',
					'<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>',
					'</tr></tbody></table><table cellspacing="0" cellpadding="0" class="%1-day-of-month-body"><tbody><tr>',
					'<td class="%1-month-date"><span class="%1-month-date-cnt"></span></td>',
					'<td class="%1-month-date"><span class="%1-month-date-cnt"></span></td>',
					'<td class="%1-month-date"><span class="%1-month-date-cnt"></span></td>',
					'<td class="%1-month-date"><span class="%1-month-date-cnt"></span></td>',
					'<td class="%1-month-date"><span class="%1-month-date-cnt"></span></td>',
					'<td class="%1-month-date"><span class="%1-month-date-cnt"></span></td>',
					'<td class="%1-month-date"><span class="%1-month-date-cnt"></span></td>',
					'</tr></tbody></table></div>'].join(''),
					
	woyRowTemplate: '<div class="%1-month-week"><span class="%1-week-of-year-text"></span></div>',
	
	$define: {
		items: function () {
			this._items = jq.evalJSON(this._items);
			if (!this.$n()) return;
			
			for (var i = this.nChildren; i--;) {
				var child = this.getChildAt(i),
					className = child.className;
				if (className == 'calendar.DayOfMonthItem' || className == 'calendar.DaylongOfMonthItem')
					this.removeChild(child);
			}

			this.createChildrenWidget_();
			this._rePositionDay();

			//reset items data
			this._itemsData = this._createItemsData(false);
			// recalculate
			this.onSize();
		},
		zones: function () {
			this._zones = jq.evalJSON(this._zones);
			this._zonesOffset = jq.evalJSON(this.zonesOffset);
			this.ts = this._zones.length;
			for (var i = this._zonesOffset.length; i--;)
				this._zonesOffset[i] = zk.parseInt(this._zonesOffset[i]);
							
			if (!this.$n()) return;
			
			this.updateDateOfBdAndEd_();
		}
	},

	bind_: function () {// after compose
		this.$supers('bind_', arguments);
		
		this._weekDates = [];
		var zcls = this.getZclass(),
			p = this.params;
		p._fakerMoreCls = zcls + '-evt-faker-more';
		p._fakerNoMoreCls = zcls + '-evt-faker-nomore';
		
		var widget = this,
			zcls = this.getZclass(),
			cnt = this.$n('cnt');
		
		//define all positions
		//put the title
		this.title = this.$n('inner').firstChild.firstChild.rows[0].cells;
		//put week of year
		if (this.woy)
			this.woyCnt = jq(this.$n('woy')).contents().find('.' + zcls + '-week-of-year-text');
		//put all day title
		this.allDayTitle = jq(cnt).contents().find('.' + zcls + '-month-date-cnt');
		//put day item
		this.weekRows = jq(cnt).contents().find('.' + zcls + '-day-of-month-body');
		this.weekRowsBg = jq(cnt).contents().find('.' + zcls + '-day-of-month-bg');

		var children = this.allDayTitle,
			captionByPopup = this._captionByPopup,
			ed = new Date(this.zoneEd),
			rdata = [];

		this._createWeekSet();
		this.createChildrenWidget_();
		this._rePositionDay();

		//add time attr for click event
		for (var i = this.weekOfMonth * 7; i--;) {
			ed = calUtil.addDay(ed, -1);
			children[i].time = this.fixTimeZoneFromClient(ed);
			if (captionByPopup)
				children[i].text = captionByPopup[i];
		}
		
		if (this.woy) {
			var woy = jq(this.$n('woy')),
				children = this.woyCnt;

			for (var i = this.weekOfMonth; i--;)
				children[i].time = this.fixTimeZoneFromClient(this._weekDates[i].zoneBd);

			woy.bind('click', function (evt) {
				var target = evt.target;
				if (target.tagName == 'SPAN')
					widget.fire('onWeekClick',{data:[target.time]});
				evt.stop();
			});
		}
		
		this._itemsData = this._createItemsData(true);
		
		if (!this._readonly)
			this.editMode(true);
	},
	
	unbind_: function () {
		this.title = this.woyCnt = this.allDayTitle = this.weekRows = null;
		this.$supers('unbind_', arguments);
	},
	
	_createItemsData: function (isAddClkEvt) {
		var cnt = this.$n('cnt'),
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
						data[k + z].push(cells[k].firstChild);
					var cols = cells[k].colSpan;
					while (--cols > 0)
						data[k + ++z].push(cells[k].firstChild);
				}
			}
			rdata[ri] = data;
			if (!isAddClkEvt) continue;
			this.addDayClickEvent_(jq(rows[0]).children().find('span'));
		}
		return rdata;
	},
		
	_createWeekSet: function (ed) {
		var weekDates = [],
			bd = new Date(this.zoneBd),
			ed = this.zoneEd,
			cur, previous, hour;
		
		//calculate all begin and end of week
		while (bd < ed) {
			hour = bd.getHours();
			if (hour != 0 && hour == 23) // fix DST
				bd.setHours(bd.getHours() + 1);
			previous = new Date(bd);
			bd = calUtil.addDay(bd, 7);
			hour = bd.getHours();
			if (hour != 0 && hour == 23) // fix DST
				bd.setHours(bd.getHours() + 1);
			cur = new Date(bd);
			weekDates.push({zoneBd: previous, zoneEd: cur});
		}
		
		this._weekDates = weekDates;
	},
	
	_putInMapList: function (dayItem) {
		var node = dayItem.$n(),
			list = this._itemWeekSet[this._weekDates.indexOf(node.startWeek)];
		if (!list) {
			list = [];
			this._itemWeekSet[this._weekDates.indexOf(node.startWeek)] = list;
		}
		list.push(node);
		//add cut node
		var cloneNodes = dayItem.cloneNodes;
		if (!cloneNodes) return;
		for (var n = cloneNodes.length; n--;) {
			var cloneNode = cloneNodes[n],
				index = this._weekDates.indexOf(cloneNode.startWeek);
			list = this._itemWeekSet[index];
			if (!list) {
				list = [];
				this._itemWeekSet[index] = list;
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
		for (var i = 0, j = daySpace.length; i < j; i++) {
			var weekList = daySpace[i],
				weekIndex = this._weekDates.indexOf(weekList[weekList.length - 1][0].startWeek),
				title = weekRows[weekIndex].firstChild.firstChild,//tbody
				prevTr = jq(title);
			//all week inner row
			for (var k = 0, l = weekList.length; k < l; k++) {
				var allEvent = weekList[k];
				prevTr = prevTr.after('<tr></tr>').next();
				//all event
				for (var m = 0, n = allEvent.length; m < n; m++) {
					var dayNode = allEvent[m];
				
					if (m == 0)//first
						this.drawItem_(dayNode._preOffset, zcls + '-month-date-evt', prevTr, dayNode);
					else {
						var preDayNode = allEvent[m - 1],
							start = dayNode._preOffset,
							preEnd = preDayNode._preOffset + preDayNode._days,
							offset = start - preEnd;
							
						this.drawItem_(offset, zcls + '-month-date-evt', prevTr, dayNode);
					}
					dayNode.style.visibility = '';
					if (m == n - 1) {//last
						var html = [];
						for (var x = dayNode._afterOffset; x--;)
							html.push('<td class="' + zcls + '-month-date-evt">&nbsp;</td>');
						prevTr.append(html.join(''));
					}
				}
			}
		}
	},
		
	_rePositionDay: function () {
		this._daySpace = [];
		
		var sortFunc = this.dateSorting_,
			daySpace = this._daySpace,
			itemWeekSet = this._itemWeekSet,
			uuid = this.uuid;
			
		// all day event
		for (var i = 0, j = itemWeekSet.length; i < j; i++) {
			var list = itemWeekSet[i],
				weekList = [];
			if (!list || !list.length) continue;
			list.sort(sortFunc);
				
			daySpace.push(weekList);
			for (var k = 0, l = list.length; k < l; k++) {
				var node = list[k];
				this.putInDaylongSpace_(weekList, node);
			}
		}
		this._resetDayPosition();
	},
		
	updateDateRange_: function () {
		this.updateDateOfBdAndEd_();
		this._captionByDayOfWeek = this.captionByDayOfWeek ? jq.evalJSON(this.captionByDayOfWeek) : null;
		this._captionByWeekOfYear = this.captionByWeekOfYear ? jq.evalJSON(this.captionByWeekOfYear) : null;
		this._captionByDateOfMonth = this.captionByDateOfMonth ? jq.evalJSON(this.captionByDateOfMonth) : null;
		this._captionByPopup = this.captionByPopup ? jq.evalJSON(this.captionByPopup) : null;
		
		if (!this.$n()) return;
		
		var cnt = this.$n('cnt'),
			$cnt = jq(cnt),
			cntRows = $cnt.children(),
			woy = this.$n('woy'),
			woyRows = jq(woy).children(),
			weeks = this.weekOfMonth,
			zcls = this.getZclass(),
			number = 100 / weeks,
			offset = weeks - cntRows.length;
			
		if (offset > 0) {
			var cntRow = [],
				woyRow = [],
				cntRowHtml = this.weekRowTemplate.replace(new RegExp("%1", "g"), function (match, index) {
								return zcls;
							}),
				woyRowHtml = this.woyRowTemplate.replace(new RegExp("%1", "g"), function (match, index) {
								return zcls;
							});
						
			for (var i = offset; i--;) {
				cntRow.push(cntRowHtml);
				if (this.woy)
					woyRow.push(woyRowHtml);
			}
			
			$cnt.append(cntRow.join(''));
			if (this.woy)
				jq(woy).append(woyRow.join(''));
			var tables = jq('.' + zcls + '-day-of-month-body'),
				length = tables.length;
			for (var i = tables.length; i-- > length - offset;)
				this.addDayClickEvent_(jq(tables[i].rows[0]).children().find('span'));
		} else {
			for (var i = -offset; i--;) {
				jq(cnt.lastChild).remove();
				if (this.woy)
					jq(woy.lastChild).remove();
			}
		}
		
		this.allDayTitle = $cnt.contents().find('.' + zcls + '-month-date-cnt');
		this.weekRows = jq(cnt).contents().find('.' + zcls + '-day-of-month-body');
		this.weekRowsBg = $cnt.contents().find('.' + zcls + '-day-of-month-bg');
		cntRows = $cnt.children();
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
			week_today = zcls + '-week-today',
			week_weekend = zcls + '-week-weekend',
			bd = new Date(this.zoneBd),
			ed = new Date(this.zoneEd),
			current = new Date(),
			curMonth = this._currentDate.getMonth(),
			cur,
			previous,
			woyChildren;
		
		this._createWeekSet();
		
		//reset rows height
		if (this.woy)
			woyChildren = this.woyCnt;
		bd = new Date(this.zoneBd);
		var woy = zk.parseInt(this.woy);
		
		for (var i = 0, j = weeks; i < j; i++) {
			var div = jq(cntRows[i]),
				top = number * i;
			
			div.css('top',top + '%');
			div.height(number + '%');
			
			if (this.woy) {
				var year = bd.getFullYear(),
					weekSpan = woyChildren[i],
					pNode = jq(weekSpan.parentNode);
				
				weekSpan.time = this.fixTimeZoneFromClient(this._weekDates[i].zoneBd);
				jq(weekSpan).html(captionByWeekOfYear ? captionByWeekOfYear[i] : woy);
				
				bd = calUtil.addDay(bd, 7);
				bd.setMilliseconds(0);
				
				if (year != bd.getFullYear())
					woy = 1;
				else woy++;
				
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
		ed = new Date(this.zoneEd);
		for (var i = 7; i--;) {
			ed = calUtil.addDay(ed, -1);
						
			var th = jq(hdChildren[i]),
				content = captionByDayOfWeek ? captionByDayOfWeek[i] :
												zk.fmt.Date.formatDate(ed,'EEE');
			th.html(content);
			if (bd.getDay() == 0 || bd.getDay() == 6) //SUNDAY or SATURDAY
				th.addClass(week_weekend);
		}
		
		//reset each day
		ed = new Date(this.zoneEd);
		for (var i = this.weekOfMonth * 7; i--;) {
			ed = calUtil.addDay(ed, -1);
			
			var hour = ed.getHours();
			if (hour != 0 && hour == 23) // fix DST
				ed.setHours(ed.getHours() + 1);
			hour = ed.getHours();
			if (hour != 0 && hour == 23) // fix DST
				ed.setDate(ed.getDate() + 1);
			
			var span = cntChildren[i],
				td = jq(span.parentNode),
				content = captionByDateOfMonth ? captionByDateOfMonth[i] : ed.getDate(),
				bgTD,
				rowIndex = zk.parseInt(i / 7);
			
			if (hour != 0 && hour == 23) // fix DST
				ed.setDate(ed.getDate() - 1);
			
			span.time = this.fixTimeZoneFromClient(ed);
			if (captionByPopup)
				span.text = captionByPopup[i];
			if (ed.getDay() == 0 || ed.getDay() == 6) { //SUNDAY or SATURDAY
				td.addClass(week_weekend);
				bgTD = jq(cntBg[rowIndex].rows[0].cells[td[0].cellIndex]);
				bgTD.addClass(week_weekend);
			}

			if (calUtil.isTheSameDay(current, ed)) {//today
				td.addClass(week_today);
				bgTD = jq(cntBg[rowIndex].rows[0].cells[td[0].cellIndex]);
				bgTD.addClass(week_today);
			}
			if (curMonth != ed.getMonth()) {
				td.addClass(month_date_off);
				bgTD = jq(cntBg[rowIndex].rows[0].cells[td[0].cellIndex]);
				bgTD.addClass(month_date_off);
			}

			if (ed.getDate() == 1 && !captionByDateOfMonth)
				content = zk.fmt.Date.formatDate(ed,'MMM d');
			jq(span).html(content);
		}
	},
	
	cleanItemAry_: function () {
		this._itemKey = {};
		this._itemWeekSet = [];
	},
	
	processChildrenWidget_: function (isExceedOneDay, item) {
		var dayItem = isExceedOneDay ?
						new calendar.DaylongOfMonthItem({item: item}) :
						new calendar.DayOfMonthItem({item: item});
		
		this.appendChild(dayItem);
		this._putInMapList(dayItem);
	},
	
	getDragDataObj_: function () {
		if (!this._dragDataObj)
			this._dragDataObj = {
				getRope: function (widget, cnt, hs) {
					var zcls = widget.getZclass(),
						html = [widget.ropeTemplate.replace(new RegExp("%([1-2])", "g"), function (match, index) {
									return index < 2 ? widget.uuid : zcls;
								})],
						rope = widget.ddRopeTemplate.replace(new RegExp("%1", "g"), function (match, index) {
									return zcls;
								});
			
					for (var n = cnt.firstChild; n; n = n.nextSibling) {
						html.push(rope);
						hs.push(n.offsetHeight);
					}
					html.push('</div>');
					return html.join('');
				},
				getRow: function (cnt) {
					return cnt.firstChild.firstChild.rows[0].firstChild;
				},
				getCols: function (p, dg) {
					return Math.floor((p[0] - dg._zoffs.l) / dg._zdim.w);
				},
				getRows: function (p, dg) {
					return Math.floor((p[1] - dg._zoffs.t)/dg._zdim.h);
				},
				getDur: function (dg) {
					return (dg._zoffs.s * dg._zpos1[1] + dg._zpos1[0]);
				},
				getNewDate: function (widget, dg) {
					var c = dg._zpos[0],
						r = dg._zpos[1],
						c1 = dg._zpos1[0],
						r1 = dg._zpos1[1],
						c2 = c < c1 ? c : c1,
						r2 = r < r1 ? r : r1,
						offs = dg._zoffs.s * r2 + c2,
						bd = new Date(widget.zoneBd);
	
					bd.setDate(bd.getDate() + offs);
					
					var ed = new Date(bd);
					ed.setDate(ed.getDate() + dg._zpos1[2]);
					return {bd: bd, ed: ed};
				}
			};
		return this._dragDataObj;
	},
	
	reAlignItems_: function (hasAdd) {
		this._rePositionDay();
		this._itemsData = this._createItemsData(false);
		// recalculate
		this.onSize();
	},
		
	removeNodeInArray_: function (childWidget, hasAdd) {
		var node = childWidget.$n(),
			weekIndex = this._weekDates.indexOf(node.startWeek);
		this._itemWeekSet[weekIndex].$remove(node);
		
		var cloneNodes = childWidget.cloneNodes;
		if (!cloneNodes) return;
		weekIndex++;
		for (var n = cloneNodes.length; n--;) {
			var cloneNode = cloneNodes[n];
			this._itemWeekSet[weekIndex + n].$remove(cloneNode);
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
			ce = zk.Widget.$(node).item,
			p = [Math.round(evt.pageX), Math.round(evt.pageY)]; //ZKCAL-42: sometimes it returns float number in IE 10
		if (jq(node).hasClass(zcls + '-evt-faker-more') && node.parentNode.id.indexOf('-frow') > 0) return;

		if (ce) {
			widget.fire('onItemEdit', {
				data: [ce.id, p[0], p[1], jq.innerWidth(), jq.innerHeight()]});
		} else {
			var cmp = widget.$n(),
				html = '<div id="' + widget.uuid + '-rope" class="' + zcls + '-month-dd">'
					 + '<div class="' + zcls + '-dd-rope"></div></div>';

			jq(document.body).prepend(html);

			var td = cnt.firstChild.firstChild.rows[0].firstChild,
				width = td.offsetWidth,
				height = cnt.firstChild.offsetHeight,
				offs = zk(cnt).revisedOffset(),
				x = p[0] - offs[0],
				y = p[1] - offs[1],
				cols = Math.floor(x / width),
				rows = Math.floor(y / height),
				bd = new Date(widget.zoneBd),
				zinfo = [];

			bd.setDate(bd.getDate() + (7 * rows + cols));

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

			widget.fixRope_(zinfo, jq('#' + widget.uuid + '-rope')[0].firstChild,
				cols, rows, zoffs, {w: width, h: hs[rows], hs: hs}, 1);

			var ed = new Date(bd);
			ed = calUtil.addDay(ed, 1);
			//ZKCAL-50: add event on DST start day
			var bdhour = bd.getHours(), edhour = ed.getHours();
			if (bdhour == 23) {
				bd.setHours(bd.getHours() + 2);
				ed.setHours(ed.getHours() + 1);
			} else if (edhour == 23) {
				ed.setHours(ed.getHours() + 2);
			}
			
			widget.fire('onItemCreate', {
				data: [
					widget.fixTimeZoneFromClient(bd),
					widget.fixTimeZoneFromClient(ed),
					p[0],
					p[1],
					jq.innerWidth(),
					jq.innerHeight()
				]
			});

			widget._ghost[widget.uuid] = function () {
				jq('#' + widget.uuid + '-rope').remove();
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
			table = jq('#' + widget.uuid + '-ppcnt')[0];

		widget.clearGhost();
		if (!widget._pp) {
			jq(document.body).append(widget.ppTemplate.replace(new RegExp("%([1-2])", "g"), function (match, index) {
					return index < 2 ? uuid : 'z-calpp-month';
			}));
			widget._pp = pp = jq('#' + widget.uuid + '-pp')[0];
			jq(document.body).bind('click', widget.proxy(widget.unMoreClick));
			table = jq('#' + widget.uuid + '-ppcnt')[0];

			if (!widget._readonly)
				jq(pp).bind('click', widget.proxy(widget.onPopupClick));
		} else {
			if (widget._pp.ci == ci) {
				// ignore onItemCreate
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
		
		jq('#' + widget.uuid + '-pphd')[0].innerHTML = date.text ? date.text :
			zk.fmt.Date.formatDate(targetDate,'EEE, MMM/d');

		if (zk.ie6_) {
			var close = jq('#' + widget.uuid + '-ppc');
			close.bind('mouseover', function () {close.addClass('z-calpp-month-close-over');});
			close.bind('mouseout', function () {close.removeClass('z-calpp-month-close-over');});
		}

		var offs = zk(row.lastChild.rows[0].cells[ci]).revisedOffset(),
			csz = cell.parentNode.cells.length,
			single = cell.offsetWidth,
			wd = single * 3 * 0.9;

		if (ci > 0)
			if (csz != ci + 1)
				pp.style.left = jq.px(offs[0] - (wd - single) / 2);
			else
				pp.style.left = jq.px(offs[0] - (wd - single));
		else pp.style.left = jq.px(offs[0]);

		pp.style.top = jq.px(offs[1]);
		pp.style.width = jq.px(wd);

		//filling data
		var cmp = widget.$n(),
			evts = widget._itemsData[widget.getIndex(row)][ci],
			oneDay = calUtil.DAYTIME,
			bd = targetDate,
			ed = new Date(bd);
		ed = calUtil.addDay(ed, 1);
		for (var i = evts.length; i--;) {
			var tr = table.insertRow(0),
				cr = tr.insertCell(0),
				cm = tr.insertCell(0),
				cl = tr.insertCell(0),
				ce = evts[i],
				cewgt = zk.Widget.$(ce),
				item = cewgt.item,
				isDayLongEvent = cewgt.$instanceof(calendar.DaylongOfMonthItem),
				hc = item.headerColor,
				cc = item.contentColor,
				zcls = item.zclass;

			ce._bd = ce._bd || item.zoneBd;
			ce._ed = ce._ed || item.zoneEd;
			cl.className = 'z-calpp-month-evt-l';
			if (isDayLongEvent && bd - ce._bd >= 1000) {
				var info = [
						ce.id + '-fl',
						zcls,
						zcls + '-left',
						ce._bd.getMonth() + 1 + '/' + ce._bd.getDate(),
						hc ? ' style="background:' + hc + '"' : '',
						cc ? ' style="background:' + cc + '"' : '',
						cc ? ' style="border-bottom-color:' + cc + ';border-top-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + ';border-left-color:' + cc + ';border-right-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + '"' : ''
					];
				cl.innerHTML = widget.itemTemplate.replace(new RegExp("%([1-9])", "g"), function (match, index) {
					return info[index - 1];
				});
			} else
				cl.innerHTML = '';
			cm.className = 'z-calpp-month-evt-m';
			var faker = ce.cloneNode(true);
			jq(faker).addClass('z-calpp-month-evt-faker');
			cm.appendChild(faker);
			cr.className = 'z-calpp-month-evt-r';

			if (isDayLongEvent && ce._ed - ed >= 1000) {
				var d = new Date(ce._ed.getTime() - 1000),
					info = [
						ce.id + '-fr',
						zcls,
						zcls + '-right',
						d.getMonth() + 1 + '/' + d.getDate(),
						hc ? ' style="background:' + hc + '"' : '',
						cc ? ' style="background:' + cc + '"' : '',
						cc ? ' style="border-bottom-color:' + cc + ';border-top-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + ';border-left-color:' + cc + ';border-right-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + '"' : ''
					];
				cr.innerHTML = widget.itemTemplate.replace(new RegExp("%([1-9])", "g"), function (match, index) {
					return info[index - 1];
				});
			} else
				cr.innerHTML = '';
		}
		zk(pp).cleanVisibility();

		// ZKCAL-71: set maxHeight to popup content
		if (pp && jq(pp).is(':visible')) {
			var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
				ppRect = pp.getBoundingClientRect(),
				ppMonthContent = jq(pp).find('.z-calpp-month-cnt')[0],
				ppPadding = ppRect.height - ppMonthContent.clientHeight,
				maxh = vh - ppRect.top - ppPadding;

			if (ppRect.bottom > vh) // not enough space for popup
				ppMonthContent.style.maxHeight = jq.px(maxh);
		}

		evt.stop();
	},
	
	onDrop_: function (drag, evt) {
		var target = evt.domTarget,
			time = new Date(this.zoneBd),
			data = zk.copy({dragged: drag.control}, evt.data),
			ce;
			
		if ((ce = zk.Widget.$(target)) && 
			ce.className != 'calendar.CalendarsMonth') {
			data.ce = ce.item.id;
			target = ce.$n().parentNode;
		}
		
		if (jq.nodeName(target, 'td') || jq.nodeName(target = target.parentNode, 'td')) {
			time.setDate(time.getDate()
				+ (jq(target.offsetParent.parentNode).index() * 7)
				+ target.cellIndex);
		} else return;
		
		data.time = this.fixTimeZoneFromClient(time);
		this.fire('onDrop', data, null, zk.Widget.auDelay);
	},
	
	unMoreClick: function (evt) {
		var target = evt.target;
		if (target.id.endsWith('-ppc') ||!zUtl.isAncestor(this._pp, target))
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
				len = rows.length,
				data = this._itemsData[ri];
			if (len > 1 && (h < sh || rows[len - 1].id)) {
				if (rows[len - 1].id && rows[len - 1].id.startsWith(this.uuid + '-frow')) {
					jq(rows[len - 1]).remove();
					len--;
				}
				rows[1].style.display = '';
				var nh = zk(rows[1]).offsetHeight();
				h -= zk(rows[0]).offsetHeight() + nh;

				var vc = Math.floor(h / nh),
					vc1 = Math.max(vc, 0);

				for (var i = 1; i < len; i++)
					rows[i].style.display = --vc < 0 ? 'none' : '';

				var faker = table.insertRow(len);
				faker.id = this.uuid + '-frow' + ri;
				for (var i = 7; i--;) {
					cell = faker.insertCell(0);
					cell.className = zcls + '-month-date-evt';
					jq(cell).addClass(zcls + '-evt-faker-more');
					if (data[i].length && (data[i].length - vc1 > 0)) {
						var evts = data[i];
						cell.innerHTML = calUtil.format(msgcal.monthMORE, [evts.length - vc1]);
						jq(cell).bind('click', widget.onMoreClick);
					} else {
						cell.innerHTML = '';
						jq(cell).addClass(zcls + '-evt-faker-nomore');
					}
				}
			}
		}
	},
		
	onSize: _zkf = function () {
		var woy = this.woy ? this.$n('woy') : null,
			cmp = this.$n();

		if (woy) {
			var w = woy.offsetWidth,
				cnt = this.$n('cnt'),
				cs = cnt.style,
				ts = woy.previousSibling.style;
				
			ts.left = cs.left = jq.px(w);
			ts.width = cs.width = '';
			ts.width = cs.width = jq.px(cnt.offsetWidth - w);
		}
		this.clearGhost();
		
		var hgh = cmp.offsetHeight;
		if (hgh === 0) return;
		
		
		for (var child = cmp.firstChild;child;child = child.nextSibling) {
			if (this.isLegalChild(child))
				hgh -= child.offsetHeight;
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
		inner.style.overflowY = 'visible';
		this.fixVisiHgh();
		this.closeFloats();
	},
	
	onShow: _zkf
});