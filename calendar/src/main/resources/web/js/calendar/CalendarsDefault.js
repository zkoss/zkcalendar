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
	function _getHightOffsPercent(date, timeslots) {
		var timeslotTime = 60 / timeslots,
			bdTimeslot = date.getMinutes() % timeslotTime;
		
		if (!bdTimeslot) return 0;
		return bdTimeslot / timeslotTime;
	}
	
	function _setItemWgtHeight(calendarWidget, calitem, id, height) {
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
	}

	function _getSlotCount(bd, ed, timeslots) {
		var timeslotTime = 60 / timeslots,
			bdHour = (typeof bd) == 'number' ? bd : bd.getHours(),
			edHour = (typeof ed) == 'number' ? ed : ed.getHours(),
			bdMinu = (typeof bd) == 'number' ? 0 : bd.getMinutes(),
			edMinu = (typeof ed) == 'number' ? 0 : ed.getMinutes();
		return (edHour - bdHour) * timeslots +
						(edMinu - bdMinu) / timeslotTime;
	}

	function _updateCntHeight(wgt) {
		var $cnt = jq(wgt.$n('cnt')),
			timeslots = wgt._timeslots,
			hourCount = wgt._et - wgt._bt,
			$firstSlot = $cnt.find('.z-calendars-hour-sep')[0], //fine tune if user customize height by CSS
			slotHeight = $firstSlot ?
				($firstSlot.offsetHeight + zk($firstSlot).sumStyles('tb', jq.margins) + 1) : 46,
			totalHeight = hourCount * slotHeight * timeslots / 2;
		$cnt.find('.z-calendars-week-cnt').height(totalHeight);
		jq(wgt.cntRows).find('.z-calendars-week-day-cnt').height(totalHeight).css('margin-bottom', -totalHeight);
		jq(wgt.cntRows).find('.z-calendars-hour-of-day').height(slotHeight * timeslots / 2 - 1);
		wgt._slotOffs = 12 / timeslots;
		wgt.beginIndex = wgt._bt * timeslots;
	}
	
	function _updateHourColSize(wgt) {
		var cntRows = wgt.cntRows,
			timeRows = cntRows.cells,
			ts = wgt.ts,
			timeslots = wgt._timeslots,
			hourCount = wgt._et - wgt._bt,
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
		
		_updateCntHeight(wgt);
		// recalculate
		wgt.beforeSize();
		wgt.onSize();
	}
	
	function _updateTimeZoneColSize(wgt) {
		var cntRows = wgt.cntRows,
			ts = wgt.ts,
			offset = ts - (cntRows.previousSibling.childNodes.length - 1);
		
		if (!offset) return;
		
		var header = wgt.$n('header'),
			a = wgt.$n('hdarrow');
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
			_reputContent(wgt);
		return true;
	}
	
	function _reputContent(wgt) {
		var uuid = wgt.uuid;
				
		jq(document.body).append(wgt.blockTemplate.replace(new RegExp("%1", "g"), function (match, index) {
			return uuid;
		}));
		var temp = jq('#' + uuid + '-tempblock'),
			hdTable = wgt.$n('header').offsetParent,
			parent = hdTable.parentNode,
			cnt = wgt.$n('cnt'),
			cntTable = cnt.firstChild;

		temp.append(hdTable);
		temp.append(cntTable);
		jq(parent).append(hdTable);
		jq(cnt).append(cntTable);
		temp.remove();
	}
	
	function _createDragStart(dg, evt) {
		var cnt = dg.node,
			widget = dg.control,
			uuid = widget.uuid,
			cells = widget.cntRows.cells,
			ph = widget.perHeight,
			x = evt.pageX,
			y = evt.pageY,
			y1 = dg._zoffs.top,
			cIndex = dg._zoffs.size,
			begin = dg._zoffs.beginIndex,
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
			widget.ddTemplate.replace(new RegExp("%([1-2])", "g"), function (match, index) {
				return index < 2 ? widget.uuid + '-dd' : 'z-calitem';
		}));

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
			widget._dateTime[r * widget._slotOffs] + ' - ' +
				widget._dateTime[r * widget._slotOffs + 12];
		
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
		dg._zoffs.beginIndex = r;
		// end index
		dg._zoffs.endIndex = r + timeslots;

		inner.style.height = jq.px((ph * timeslots) - height);
		dg._zhd = inner.firstChild;
	}
	
	function _createDragging(dg, evt) {
		var widget = dg.control,
			faker = dg.node,
			cnt = dg.handle,
			zoffs = dg._zoffs,
			y = evt.pageY,
			y1 = zoffs.top,
			h1 = zoffs.height,
			ph = zoffs.ph,
			b = zoffs.beginIndex,
			e = zoffs.endIndex;
		
		if (y < y1)
			y = y1;
		else if (y + ph > y1 + h1)
			y = y1 + h1 - ph;

		var r = Math.ceil((y + cnt.scrollTop - y1) / ph);
			
		if (r < b) b = r;
		else if (r > b) e = r;

		if (faker.offsetTop != b * ph)
			faker.style.top = jq.px(b * ph);

		var hgh = ((e - b) * ph) - dg._zrzoffs,
			beginIndex = widget.beginIndex;
		if (dg._zecnt.offsetHeight != hgh)
			dg._zecnt.style.height = jq.px(hgh);

		// Update header
		dg._zhd.innerHTML =
			widget._dateTime[(beginIndex + b) * widget._slotOffs] + ' - ' +
				widget._dateTime[(beginIndex + e) * widget._slotOffs];
	}
	
	function _createDragEndghost(dg) {
		var widget = dg.control,
			hgh = dg._zoffs.perWidgetHeight;
			
		dg._zdata = {
			rows: dg.node.offsetTop / hgh,
			cols: dg.node.parentNode.parentNode.cellIndex - widget.ts,
			dur: Math.ceil(dg.node.offsetHeight / hgh),
			ghostNode: dg.node
		};
	}
	
	function _createDragEnd(dg, evt) {
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
	}
	
	function _resizeDragStart(dg) {
		dg._zrzoffs = dg.node.offsetHeight + 2 - dg._zhd.parentNode.offsetHeight;
		dg._zecnt = dg.node.childNodes[0].firstChild.firstChild;
	}
	
	function _resizeDragging(dg, evt) {
		var widget = dg.control,
			faker = dg.node,
			cnt = dg.handle,
			zoffs = dg._zoffs,
			y = evt.pageY,
			y1 = zoffs.top,
			h1 = zoffs.height,
			ph = zoffs.perWidgetHeight,
			ce = dg._zevt;
		
		if (y + ph > y1 + h1)
			y = y1 + h1 - ph;

		var r = y + cnt.scrollTop - y1;

		r = Math.ceil(r / (ph));

		var height = (r * ph - faker.offsetTop) - dg._zrzoffs;

		if (height < 0) {
			height = ph - dg._zrzoffs;
			r = dg._zoffs.beginIndex + 1;
		}
		if (dg._zecnt.offsetHeight != height) {
			dg._zecnt.style.height = jq.px(height);
			if (!dg._zchanged) widget.$class._resetPosition(faker, widget);
			dg._zchanged = true;
		}
		// Update header
		r += widget.beginIndex;
		dg._zhd.innerHTML =
			widget._dateTime[zoffs.beginIndex * widget._slotOffs] + ' - ' +
				widget._dateTime[r * widget._slotOffs];
	}
	
	function _resizeDragEndghost(dg) {
		dg._zdata.dur = Math.round((dg.node.offsetHeight - dg._zevt.offsetHeight) / dg._zoffs.perWidgetHeight);
	}
	
	function _resizeDragEnd(dg, evt) {
		var widget = dg.control,
			dur = dg._zdata.dur,
			timeslots = widget._timeslots,
			ce = dg._zevt,
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
			widget._restoreCE = ce;
		} else {
			jq('#' + widget.uuid + '-dd').remove();
			ce.style.visibility = '';
		}
		dg._zrz = false;
	}
	
	function _updateDragStart(dg, evt, ce, faker) {
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
				id = faker.id;
			_setItemWgtHeight(widget, faker, targetWgt.uuid,(minutes / 60 * timeslots * perWidgetHeight));
			
			if (isOverEndTime)
				dg._overIndex = _getSlotCount(et, ed, timeslots);
			
			if (isOverBeginTime)
				dg._overIndex = _getSlotCount(bd, bt, timeslots);
		}
		dg._zdelta = ce.offsetTop - (evt.pageY + dg.handle.scrollTop - dg._zoffs.top);
	}
	
	function _updateDragging(dg, evt) {
		var widget = dg.control,
			faker = dg.node,
			h = dg.node.offsetHeight,
			x = evt.pageX,
			y = evt.pageY,
			y1 = dg._zoffs.top,
			cnt = dg.handle,
			zdelta = dg._zdelta,
			cellIndex = dg._zoffs.size,
			lefts = cnt._lefts,
			cells = dg._zcells,
			begin = dg._zoffs.beginIndex,
			perWidgetHeight = dg._zoffs.perWidgetHeight,
			totalHeight = dg._zoffs.totalHeight;
		
		for (; cellIndex--;)
			if (lefts[cellIndex] <= x)
				break;
	
		if (cellIndex < 0)
		cellIndex = 0;
	
		if (cells[begin + cellIndex].firstChild != faker.parentNode) {
			cells[begin + cellIndex].firstChild.appendChild(faker);
			if (!dg._zchanged) widget.$class._resetPosition(faker, widget);
			dg._zchanged = true;
		}
	
		if (y + zdelta + cnt.scrollTop - y1 < 0)
			y = 0 - cnt.scrollTop - zdelta + y1;
		
		if (y + zdelta + h + cnt.scrollTop - y1 >= totalHeight)
			y = (totalHeight - h - cnt.scrollTop) + y1 - zdelta;
	
		var r = y + zdelta + 5 + cnt.scrollTop - y1;
		r = Math.floor(r / (perWidgetHeight));
		if (faker.offsetTop != r * perWidgetHeight) {
			faker.style.top = jq.px(r * perWidgetHeight);
			if (!dg._zchanged) widget.$class._resetPosition(faker, widget);
			dg._zchanged = true;
		}
	
		// Update header
		dg._zhd.innerHTML =
			widget._dateTime[(r + widget.beginIndex) * widget._slotOffs] + ' - ' +
				widget._dateTime[(r + dg._zoffs.endIndex + dg._overIndex) * widget._slotOffs];
	}
	
	function _updateDragEndghost(dg) {
		var gostNode = dg.node,
			ce = dg._zevt;
		
		gostNode.parent = jq(gostNode.parentNode);
		dg._zdata = {
			rows: (ce.offsetTop - gostNode.offsetTop) / dg._zoffs.perWidgetHeight,
			cols: ce.parentNode.parentNode.cellIndex -
					gostNode.parentNode.parentNode.cellIndex,
			ghostNode: gostNode
		};
	}
	
	function _updateDragEnd(dg, evt) {
		var widget = dg.control,
			cols = dg._zdata.cols,
			rows = dg._zdata.rows,
			ce = dg._zevt;
		if (cols || rows) {
			var timeslots = widget._timeslots,
				timeslotTime = 60 / timeslots,
				bd = new Date(ce._bd),
				ed = new Date(ce._ed),
				bdTimeslot = _getHightOffsPercent(bd, timeslots),
				edOffset = ed.getTimezoneOffset(),
				bt = widget._bt,
				et = widget._et,
				offset = [cols, rows * timeslotTime];
				
			//adjust time in time range
			if (bd.getHours() < bt) {
				var slotCount = _getSlotCount(bd, bt, timeslots);
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
				ed.setUTCMinutes(ed.getUTCMinutes() + _getSlotCount(bd, ed, timeslots) * timeslotTime);
			}
			widget.fireCalEvent(bd, ed, evt, ce.id);
			widget._restoreCE = ce;
		} else {
			jq('#' + widget.uuid + '-dd').remove();
			ce.style.visibility = '';
		}
	}
	
	
calendar.CalendarsDefault = zk.$extends(calendar.Calendars, {
	_bt: 0,
	_et: 24,
	_timeslots: 2, //the number of timeslots of an hour that is divided into, 2 means each time slot is 30 min
	ddTemplate: ['<div id="%1" class="%2" style="left:0px;width:100%;" >',
			  '<div class="%2-body" id="%1-body"><div class="%2-inner"><dl id="%1-inner"><dt class="%2-header"></dt><dd class="%2-cnt"></dd></dl></div></div>'].join(''),
	
	_dateTime: [
		'00:00', '00:05', '00:10', '00:15', '00:20', '00:25', '00:30', '00:35', '00:40', '00:45', '00:50', '00:55',
		'01:00', '01:05', '01:10', '01:15', '01:20', '01:25', '01:30', '01:35', '01:40', '01:45', '01:50', '01:55',
		'02:00', '02:05', '02:10', '02:15', '02:20', '02:25', '02:30', '02:35', '02:40', '02:45', '02:50', '02:55',
		'03:00', '03:05', '03:10', '03:15', '03:20', '03:25', '03:30', '03:35', '03:40', '03:45', '03:50', '03:55',
		'04:00', '04:05', '04:10', '04:15', '04:20', '04:25', '04:30', '04:35', '04:40', '04:45', '04:50', '04:55',
		'05:00', '05:05', '05:10', '05:15', '05:20', '05:25', '05:30', '05:35', '05:40', '05:45', '05:50', '05:55',
		'06:00', '06:05', '06:10', '06:15', '06:20', '06:25', '06:30', '06:35', '06:40', '06:45', '06:50', '06:55',
		'07:00', '07:05', '07:10', '07:15', '07:20', '07:25', '07:30', '07:35', '07:40', '07:45', '07:50', '07:55',
		'08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35', '08:40', '08:45', '08:50', '08:55',
		'09:00', '09:05', '09:10', '09:15', '09:20', '09:25', '09:30', '09:35', '09:40', '09:45', '09:50', '09:55',
		'10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:55',
		'11:00', '11:05', '11:10', '11:15', '11:20', '11:25', '11:30', '11:35', '11:40', '11:45', '11:50', '11:55',
		'12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30', '12:35', '12:40', '12:45', '12:50', '12:55',
		'13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55',
		'14:00', '14:05', '14:10', '14:15', '14:20', '14:25', '14:30', '14:35', '14:40', '14:45', '14:50', '14:55',
		'15:00', '15:05', '15:10', '15:15', '15:20', '15:25', '15:30', '15:35', '15:40', '15:45', '15:50', '15:55',
		'16:00', '16:05', '16:10', '16:15', '16:20', '16:25', '16:30', '16:35', '16:40', '16:45', '16:50', '16:55',
		'17:00', '17:05', '17:10', '17:15', '17:20', '17:25', '17:30', '17:35', '17:40', '17:45', '17:50', '17:55',
		'18:00', '18:05', '18:10', '18:15', '18:20', '18:25', '18:30', '18:35', '18:40', '18:45', '18:50', '18:55',
		'19:00', '19:05', '19:10', '19:15', '19:20', '19:25', '19:30', '19:35', '19:40', '19:45', '19:50', '19:55',
		'20:00', '20:05', '20:10', '20:15', '20:20', '20:25', '20:30', '20:35', '20:40', '20:45', '20:50', '20:55',
		'21:00', '21:05', '21:10', '21:15', '21:20', '21:25', '21:30', '21:35', '21:40', '21:45', '21:50', '21:55',
		'22:00', '22:05', '22:10', '22:15', '22:20', '22:25', '22:30', '22:35', '22:40', '22:45', '22:50', '22:55',
		'23:00', '23:05', '23:10', '23:15', '23:20', '23:25', '23:30', '23:35', '23:40', '23:45', '23:50', '23:55',
		'00:00'
	],
	
	$define: {
		days: function () {
			if (!this.desktop) return;

			var days = this._days,
				header = this.$n('header'),
				cnt = this.$n('cnt'),
				$row = jq(this.cntRows),
				daylongMoreRows = this.daylongMoreRows,
				zcls = this.getZclass(),
				oldRowCount = daylongMoreRows.cells.length,
				offset = days - oldRowCount;
			
			if (zk.ie) {
				jq(header.offsetParent).find('td:not(.z-calendars-daylong-evt)').attr('colspan',days);
				jq(cnt).find('tr:eq(1) td:last').attr('colspan',days);
			} else jq(this.$n('inner')).find('[colspan]').attr('colspan',days);

			if (offset > 0) {
				var titleRowHtml = '<th class="' + zcls + '-day-of-week"><div class="' + zcls + '-day-of-week-inner"><span class="' + zcls + '-day-of-week-cnt"></span></div></th>',
					daylongRowHtml = '<td class="' + zcls + '-daylong-evt ' + zcls + '-daylong-more">&nbsp;</td>',
					cntRowHtml = '<td class="' + zcls + '-week-day"><div class="' + zcls + '-week-day-cnt"/></td>',
					html1 = [],
					html2 = [],
					html3 = [];
				
				for (var i = offset; i--;) {
					html1.push(titleRowHtml);
					html2.push(daylongRowHtml);
					html3.push(cntRowHtml);
				}
				jq(header.lastChild).before(html1.join(''));
				jq(daylongMoreRows).append(html2.join(''));
				$row.append(html3.join(''));
			} else if (offset < 0) {
				jq(this.$n('daylong')).find('.z-calendars-daylong-more:gt(' + (days - 1) + ')').remove();
				jq(header).children('.z-calendars-day-of-week:gt(' + (days - 1) + ')').remove();
				$row.children('.z-calendars-week-day:gt(' + (days - 1) + ')').remove();
			}
			
			if (zk.ie || zk.opera)
				_reputContent(this);
			
			this.title = jq(header).find('.' + this.getZclass() + '-day-of-week-cnt');
			this.updateDateRange_();
		},
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
		zones: function () {
			var oldZones;
			if (this.desktop)
				oldZones = this._zonesOffset.$clone();

			this._zones = jq.evalJSON(this._zones);
			this._zonesOffset = jq.evalJSON(this.zonesOffset);
			this.ts = this._zones.length;
			for (var i = this._zonesOffset.length; i--;)
				this._zonesOffset[i] = zk.parseInt(this._zonesOffset[i]);

			if (!this.desktop) return;

			this.updateDateOfBdAndEd_();

			if (!oldZones || oldZones.$equals(this._zonesOffset)) return;

			this.updateTimeZoneCol_({ignoreFirstCol: true});
		},
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
			_updateCntHeight(this);
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
	
	bind_: function () {
		this.$supers('bind_', arguments);
		
		this._scrollInfo = {};
		this._dayItems = [];
		this._daylongItems = [];
		this._daylongSpace = [];
		this._daySpace = [];
		
		var zcls = this.getZclass(),
			p = this.params;
		p._fakerMoreCls = zcls + '-daylong-faker-more';
		p._fakerNoMoreCls = zcls + '-daylong-faker-nomore';
		
		var widget = this,
			$cnt = jq(this.$n('cnt')),
			zcls = this.getZclass();
		
		//define all positions
		//put the title
		this.title = jq(this.$n('header')).find('.' + zcls + '-day-of-week-cnt');
		//put the daylong event
		this.daylongRows = this.$n('daylong').firstChild.firstChild;
		//put the daylong more space
		this.daylongMoreRows = this.daylongRows.firstChild;
		//put the day event
		this.cntRows = $cnt.find('tr')[zk.ie ? 2 : 1];
		
		this.weekDay = jq(this.cntRows).children('.' + zcls + '-week-day');
		
/****************************** zone arrow ******************************/
		var a = this.$n('hdarrow'),
			hd = this.$n('header'),
			title = this.title,
			ed = new Date(this.zoneEd);
		//store value in head tag
		for (var i = title.length; i--;) {
			ed = calUtil.addDay(ed, -1);
			title[i].time = this.fixTimeZoneFromClient(ed);
		}
		jq(a).bind('click', this.onArrowClick);
/************************** head event **************************************/
		if (hd.childNodes.length > this.ts + 2)
			this.addDayClickEvent_(hd);

		$cnt.bind('scroll', function () {
			widget._scrollInfo[widget.uuid] = $cnt[0].scrollTop;
		});
		
		if (!this._readonly)
			this.editMode(true);
	},
	
	unbind_: function () {
		this.title = this.daylongRows = this.daylongMoreRows = this.cntRows =
		this._scrollInfo = this._dayItems = this._daylongItems =
		this._daylongSpace = this._daySpace = null;
		this.$supers('unbind_', arguments);
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
					
				if (k == 0) {//first
					ce._days = childWgt._days;
					this.drawItem_(childWgt._preOffset, zcls + '-daylong-evt', tr, ce);
				} else {
					var preWidget = rowSpace[k - 1],
						start = childWgt._preOffset,
						preEnd = preWidget._preOffset + preWidget._days,
						offset = start - preEnd;
					ce._days = childWgt._days;
					this.drawItem_(offset, zcls + '-daylong-evt', tr, ce);
				}
				ce.style.visibility = '';//recover moving event
				if (k == l - 1 //last, put a spacer
					&& this.getDays()>1) { //1-day view, no need spacer
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
		this._dayItems.sort(this.dateSorting_);
		this._daySpace = [];
			
		for (var i = this._days; i--;)
			this._daySpace.push([]);
				
		// all daylong event
		for (var i = 0 ,j = this._dayItems.length; i < j; i++) {
			var dayItem = this._dayItems[i];
			this._daySpace[dayItem._preOffset].push(dayItem);
		}
		this.fixPosition();
	},
	
	_rePositionDaylong: function () {
		this._daylongItems.sort(this.dateSorting_);
		this._daylongSpace = [];
		
		var uuid = this.uuid;
		
		// all daylong event
		for (var i = 0, j = this._daylongItems.length; i < j; i++) {
			var daylongEvent = this._daylongItems[i];
			this.putInDaylongSpace_(this._daylongSpace, daylongEvent);
		}
						
		this._resetDaylongPosition();
	},
	
	updateTimeZoneCol_: function (opts) {
		var hdChildren = this.$n('header').children,
			timeRows = this.cntRows.cells,
			zones = this._zones,
			beginHour = this._bt,
			endHour = this._et,
			bt = this._bt,
			ts = this.ts,
			timeslots = this._timeslots,
			captionByTimeOfDay = this._captionByTimeOfDay;
		
		_updateHourColSize(this);
		
		if (_updateTimeZoneColSize(this))
			opts = {ignoreFirstCol: false};
		
		//update texts
		for (var i = ts; i--;) {
			var index = ts - i - 1,
				zoneText = jq(hdChildren[index]);

			if (zoneText.children().length) {
				var str = zoneText.html(),
					div = str.substr(str.indexOf('<'),str.length);
				zoneText.html(zones[index] + div);
				this.clearCache();
				jq(this.$n('hdarrow')).bind('click', this.onArrowClick);
			} else zoneText.html(zones[index]);

			//fist column is not need to redraw
			if (index == 0 && opts && opts.ignoreFirstCol) continue;

			var current = new Date(),
				cell = jq(timeRows[index]).children();
			current.setMinutes(0);
			for (var k = beginHour; k < endHour; k++) {
				current.setHours(k);
				var context = captionByTimeOfDay ? captionByTimeOfDay[ index * 24 + k ] :
						zk.fmt.Date.formatDate(this.getTimeZoneTime(current,zk.parseInt(this._zonesOffset[index])),'HH:mm');

				jq(cell[k - bt]).html(context);
			}
		}
	},
	
	updateDateRange_: function () {
		this.updateDateOfBdAndEd_();
		
		this._captionByDate = this.captionByDate ? jq.evalJSON(this.captionByDate) : null;
		//ZKCAL-54: Fix setting time label format by DateFormatter not working
		this._captionByTimeOfDay = this.captionByTimeOfDay ? jq.evalJSON(this.captionByTimeOfDay) : null;
		if (!this.$n()) return;
		
		var zcls = this.getZclass();
		this.weekDay = jq(this.cntRows).children('.' + zcls + '-week-day');
		
		var hd = jq(this.$n('header')),
			cnt = jq(this.$n('cnt')),
			titles = this.title,
			ed = new Date(this.zoneEd),
			current = new Date(),
			week_day = zcls + '-week-day',
			week_today = zcls + '-week-today',
			week_weekend = zcls + '-week-weekend',
			weekDay = this.weekDay;
		
		//remove today and weekend class
		hd.children().find('.' + week_weekend).removeClass(week_weekend);
		hd.children().find('.' + week_today).removeClass(week_today);
		cnt.children().find('.' + week_weekend).removeClass(week_weekend);
		cnt.children().find('.' + week_today).removeClass(week_today);
		
		//update titles
		for (var i = this._days; i--;) {
			var d1 = ed.getDate();
			ed = calUtil.addDay(ed, -1);
			var d2 = ed.getDate(), d = ed;
			if (d1 - d2 == 2) //ZKCAL-50: DST time happens on 00:00 AM
				d.setHours(d.getHours() + 2); //adjust to correct date
			
			var title = titles[i],
				content = this._captionByDate ? this._captionByDate[i] :
								zk.fmt.Date.formatDate(d, 'EEE ') +
								'<div class="' + this.getZclass() + '-day-of-week-fmt' + '">' + zk.fmt.Date.formatDate(d, this.weekFmt) + '</div>';
			jq(title).html(content);
			title.time = this.fixTimeZoneFromClient(ed);
			if (ed.getDay() == 0 || ed.getDay() == 6) {//SUNDAY or SATURDAY
				jq(title.parentNode).addClass(week_weekend);
				jq(weekDay[i]).addClass(week_weekend);
			}
		
			if (calUtil.isTheSameDay(current, ed)) {// today
				jq(title.parentNode).addClass(week_today);
				jq(weekDay[i]).addClass(week_today);
			}
		}
	},

	cleanItemArray_: function () {
		this._itemKey = {};
		this._daylongItems = [];
		this._dayItems = [];
	},

	processChildrenWidget_: function (isExceedOneDay, item) {
		var dayItem = isExceedOneDay ?
				new calendar.DaylongItem({item: item}) :
				new calendar.DayItem({item: item}),
			zoneBd = item.zoneBd,
			zoneEd = item.zoneEd;
		if (!isExceedOneDay &&
			(zoneBd.getHours() >= this._et ||
			(zoneEd.getHours() <= this._bt && zoneEd.getHours() != 0 && zoneEd.getMinutes() == 0)))
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
				
				getRow: function (cnt) {
					return cnt.firstChild.firstChild.lastChild.firstChild;
				},
				/**
				 * 
				 * @param {Object} mousePosition {x,y}
				 * @param {zk.DnD.Draggable} draggable 
				 * @returns 
				 */
				getCols: function (mousePosition, draggable) {
					return Math.floor((mousePosition.x - draggable._zoffs.left) / draggable._zdim.w);
				},
				getRows: function () {
					return 0;
				},
				getDur: function (dg) {
					return dg._zpos1[0];
				},
				getNewDate: function (widget, dg) {
					var c = dg._zpos[0],
						c1 = dg._zpos1[0],
						offs = c < c1 ? c : c1,
						bd = new Date(widget.zoneBd),
						ed = new Date(widget.zoneBd);
					
					bd.setDate(bd.getDate() + offs);
					ed.setDate(bd.getDate() + dg._zpos1[2]);
					return {bd: bd, ed: ed};
				}
			};
		return this._dragDataObj;
	},

	reAlignItems_: function (hasAdd) {
		if (hasAdd.day)
			this._rePositionDay();
		
		if (hasAdd.daylong)
			this._rePositionDaylong();
			
		// recalculate
		this.beforeSize();
		this.onSize();
	},

	removeNodeInArray_: function (childWidget, hasAdd) {
		var isDayItem = childWidget.className == 'calendar.DayItem';
		this[isDayItem ? '_dayItems' : '_daylongItems'].$remove(childWidget.$n());
		hasAdd[isDayItem ? 'day' : 'daylong'] = true;
	},

	onClick: function (cnt, evt) {
		var widget = zk.Widget.$(cnt),
			p = [Math.round(evt.pageX), Math.round(evt.pageY)]; //ZKCAL-42: sometimes it returns float number in IE 10

		if (!cnt._lefts || p[0] <= cnt._lefts[0]) return;

		var ce = zk.Widget.$(evt.target).item;
		
		if (ce) {
			widget.fire('onItemEdit', {
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
				rows = Math.floor((y + cnt.scrollTop - offs[1]) / ph),
				timeslots = widget._timeslots,
				timeslotTime = 60 / timeslots;

			for (; cIndex--;) {
				//Fix ZKCAL-55: Problems with horizontal scrollbar
				//should consider cnt offset position if it is wrapped by a scrollable container
				if (cnt._lefts[cIndex] <= (x - offs[0] + this._initLeft))
					break;
			}

			if (cIndex < 0)
				cIndex = 0;

			jq(cells[ts + cIndex].firstChild).prepend(
				widget.ddTemplate.replace(new RegExp("%([1-2])", "g"), function (match, index) {
					return index < 2 ? widget.uuid + '-dd' : 'z-calitem';
				})
			);

			var faker = jq('#' + widget.uuid + '-dd')[0];
			jq(faker).addClass(widget.getZclass() + '-evt-ghost');

			faker.style.top = jq.px(rows * ph);

			var offsHgh = 0,
				body = jq('#' + widget.uuid + '-dd-body')[0],
				height = 0,
				inner = body.firstChild.firstChild;
			rows += widget.beginIndex;
			var beginIndex = rows * widget._slotOffs,
				itemTimeSlot = this.getNewItemTimeSlots_();
				endIndex = beginIndex + (itemTimeSlot * timeslotTime / 5);
			inner.firstChild.innerHTML = widget._dateTime[beginIndex] + ' - ' + widget._dateTime[endIndex];

			for (var child = jq(faker).children().get(0);child;child = child.nextSibling) {
				if (this.isLegalChild(child))
					height += child.offsetHeight;
			}

			height += zk(body).padBorderHeight();
			height += zk(body.firstChild).padBorderHeight();
			height += zk(inner).padBorderHeight();
			height += 2;
			inner.style.height = jq.px((ph * itemTimeSlot) - height);

			var bd = new Date(widget.zoneBd);
			bd.setDate(bd.getDate() + cIndex);
			bd.setMilliseconds(0);// clean
			bd.setMinutes(bd.getMinutes() + rows * timeslotTime);
			var ed = new Date(bd);
			ed.setMinutes(ed.getMinutes() + itemTimeSlot * timeslotTime);
			//ZKCAL-50: available to click on DST day start from 01:00
			if (bd.getTime() == ed.getTime() && rows == timeslots) {
				bd.setHours(bd.getHours() + 1);
				ed.setHours(ed.getHours() + 2);
			}
			widget.fireCalEvent(bd, ed, evt);
		}
		widget.closeFloats();
		evt.stop();
	},
	
	//Feature ZKCAL-51: override to define default item time duration
	getNewItemTimeSlots_: function () {
		return this._timeslots;
	},
	
	onDaylongClick: function (daylong, evt) {
		var widget = zk.Widget.$(daylong),
			ce = zk.Widget.$(evt.target).item,
			p = [Math.round(evt.pageX), Math.round(evt.pageY)]; //ZKCAL-42: sometimes it returns float number in IE 10
			
		if (ce) {
			widget.fire('onItemEdit', {
				data: [ce.id, p[0], p[1], jq.innerWidth(), jq.innerHeight()]});
		} else {
			var zcls = widget.getZclass(),
				html = '<div id="' + widget.uuid + '-rope" class="' + zcls + '-daylong-dd">'
					 + '<div class="' + zcls + '-dd-rope"></div></div>';

			jq(document.body).prepend(html);

			var row = daylong.firstChild.firstChild.lastChild,
				width = row.firstChild.offsetWidth,
				offs = zk(daylong).revisedOffset(),
				cols = Math.floor((p[0] - offs[0]) / width),
				zoneBd = widget.zoneBd,
				bd = new Date(widget.zoneBd);
			if (zoneBd.getHours() == 23) //ZKCAL-50: DST cross between week
				bd.setHours(bd.getHours() + 2);
			bd.setDate(bd.getDate() + cols);
			if (cols != 0)
				bd.setHours(0);
			
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

			widget.fixRope_(zinfo, jq('#' + widget.uuid + '-rope')[0].firstChild, cols,
				0, zoffs, {w: width, h: daylong.offsetHeight, hs: [daylong.offsetHeight]}, 1);

			var ed = new Date(bd);
			ed = calUtil.addDay(ed, 1);
			ed.setHours(0); //DST case
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
		
	onArrowClick: function (evt) {
		var a = evt.currentTarget,
			$a = jq(a),
			widget = zk.Widget.$(a),
			zcls = widget.getZclass(),
			cls = zcls + '-week-header-arrow-close';
			isClose = $a.hasClass(cls),
			daylong = widget.$n('daylong'),
			rows = daylong.firstChild.rows,
			len = rows.length;
			
		widget.clearGhost();
		
		isClose ? $a.removeClass(cls) : $a.addClass(cls);
				
		if (len < 2) return; // nothing to do

		if (!isClose) {
			var data = [],
				datas = rows[len - 1].cells.length;
			for (var i = 0, c = datas; c--; i++)
				data[i] = [];

			for (var i = 0, j = len - 1; i < j; i++) {
				for (var k = 0, z = 0, cells = rows[i].cells,
						cl = cells.length; k < cl && z + k < datas; k++) {
					if (cells[k].firstChild.id)
						data[k + z].push(cells[k].firstChild);
					var cols = cells[k].colSpan;
					while (--cols > 0)
						data[k + ++z].push(cells[k].firstChild);
				}
				rows[i].style.display = 'none';
			}

			var faker = daylong.firstChild.insertRow(len - 1);
			for (var i = datas; i--;) {
				cell = faker.insertCell(0);
				cell.className = rows[len].cells[i].className;
				jq(cell).addClass(zcls + '-daylong-faker-more');
				if (data[i].length > 0) {
					var evts = data[i];
					cell.innerHTML = calUtil.format(msgcal.dayMORE, [evts.length]);
					jq(cell).bind('click', widget.onMoreClick);
				} else {
					cell.innerHTML = zk.ie ? '&nbsp;' : '';
					jq(cell).addClass(zcls + '-daylong-faker-nomore');
				}
			}
			widget._itemsData = data;
		} else {
			for (var i = 0, j = len - 1; i < j; i++)
				rows[i].style.display = '';
			jq(rows[len - 2]).remove();
		}

		// recalculate
		widget.beforeSize();
		widget.onSize();
		
		evt.stop();
	},
	
	onMoreClick: function (evt) {
		var cell = evt.target,
			widget = zk.Widget.$(cell),
			daylong = cell.parentNode.parentNode.parentNode.parentNode,
			uuid = widget.uuid,
			ci = cell.cellIndex,
			pp,
			table = jq('#' + widget.uuid + '-ppcnt')[0];
		
		widget.clearGhost();
		if (!widget._pp) {
			jq(document.body).append(widget.ppTemplate.replace(new RegExp("%([1-2])", "g"), function (match, index) {
					return index < 2 ? uuid : 'z-calpp';
			}));
			pp = widget._pp = jq('#' + uuid + '-pp')[0];
			jq(document.body).bind('click', widget.proxy(widget.unMoreClick));
			table = jq('#' + uuid + '-ppcnt')[0];
			
			if (!widget._readonly)
				jq(widget._pp).bind('click', widget.proxy(widget.onPopupClick));
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

		var date = jq('#' + widget.uuid).find('.z-calendars-day-of-week-cnt')[ci],
			targetDate = new Date(date.time);
		if (targetDate)
			jq('#' + widget.uuid + '-pphd')[0].innerHTML = zk.fmt.Date.formatDate(targetDate, 'EEE, MMM/d');

		var offs = zk(cell).revisedOffset(),
			wd = daylong.offsetWidth,
			csz = cell.parentNode.cells.length,
			single = wd / csz;

		wd = csz > 2 ? single * 3 * 0.9 : wd * 0.8;

		if (csz > 2 && ci > 0)
			if (csz > ci + 1)
				pp.style.left = jq.px(offs[0] - (wd - single) / 2);
			else
				pp.style.left = jq.px(offs[0] - (wd - single));
		else if (csz > 2)
			pp.style.left = jq.px(offs[0]);
		else pp.style.left = jq.px(offs[0] + (single * 0.1));

		pp.style.top = jq.px(offs[1] + zk(cell).offsetHeight() + 1);
		pp.style.width = jq.px(wd);

		//filling data
		var evts = widget._itemsData[ci],
			oneDay = calUtil.DAYTIME,
			bd = widget.zoneBd;
			ed = new Date(bd);
		ed = calUtil.addDay(ed, 1);
			
		for (var i = evts.length; i--;) {
			var tr = table.insertRow(0),
				cr = tr.insertCell(0),
				cm = tr.insertCell(0),
				cl = tr.insertCell(0),
				ce = evts[i],
				item = zk.Widget.$(ce).item,
				hc = item.headerColor,
				cc = item.contentColor,
				zcls = item.zclass;
				
			ce._bd = ce._bd || item.zoneBd;
			ce._ed = ce._ed || item.zoneEd;
			cl.className = 'z-calpp-evt-l';
			if (bd.getTime() + (oneDay * ci) - ce._bd.getTime() >= 1000) {
				var info = [
						ce.id + '-fl',
						zcls,
						zcls + '-left',
						ce._bd.getMonth() + 1 + '/' + ce._bd.getDate(),
						hc ? ' style="background:' + hc + '"' : '',
						cc ? ' style="background:' + cc + '"' : '',
						cc ? ' style="border-bottom-color:' + cc + ';border-top-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + '"' : '',
					];
				cl.innerHTML = widget.itemTemplate.replace(new RegExp("%([1-8])", "g"), function (match, index) {
					return info[index - 1];
				});
			} else
				cl.innerHTML = '';
		
			cm.className = 'z-calpp-evt-m';
			
			var faker = ce.cloneNode(true);
			jq(faker).addClass('z-calpp-evt-faker');
			cm.appendChild(faker);

			cr.className = 'z-calpp-evt-r';
			if (ce._ed.getTime() - (ed.getTime() + (oneDay * ci)) >= 1000) {
				var d = new Date(ce._ed.getTime() - 1000),
					info = [
						ce.id + '-fr',
						zcls,
						zcls + '-right',
						d.getMonth() + 1 + '/' + d.getDate(),
						hc ? ' style="background:' + hc + '"' : '',
						cc ? ' style="background:' + cc + '"' : '',
						cc ? ' style="border-bottom-color:' + cc + ';border-top-color:' + cc + '"' : '',
						cc ? ' style="background:' + cc + '"' : ''
					];
				cr.innerHTML = widget.itemTemplate.replace(new RegExp("%([1-8])", "g"), function (match, index) {
					return info[index - 1];
				});
			} else
				cr.innerHTML = '';
		}
		zk(pp).cleanVisibility();
		evt.stop();
	},
		
	onDrop_: function (drag, evt) {
		var target = evt.domTarget,
			time = new Date(this.zoneBd),
			data = zk.copy({dragged: drag.control}, evt.data),
			ce;
		
		if ((ce = zk.Widget.$(target)) &&
			ce.className != 'calendar.CalendarsDefault') {
			data.ce = ce.item.id;
			target = ce.$n().parentNode;
		}
		
		if (jq.nodeName(target, 'td') &&
			jq(target.offsetParent).hasClass('z-calendars-daylong-cnt')) {
			time.setDate(time.getDate() + target.cellIndex);
		} else if (jq(target).hasClass('z-calendars-week-day-cnt')) {
			target = target.parentNode;
			time.setDate(time.getDate() + target.cellIndex - this.ts);
			
			var cnt = this.$n('cnt'),
				offs = zk(cnt).revisedOffset(),
				rows = Math.floor((evt.pageY + cnt.scrollTop - offs[1]) / this.perHeight)
					+ this.beginIndex;
			time.setMinutes(time.getMinutes() + rows * 60 / this._timeslots);
		} else return;
		data.time = this.fixTimeZoneFromClient(time);
		this.fire('onDrop', data, null, zk.Widget.auDelay);
	},
			
	unMoreClick: function (evt) {
		if (!zUtl.isAncestor(this._pp, evt.currentTarget))
			this.closeFloats();
	},
	
	fireCalEvent: function (bd, ed, evt, id) {
		var uuid = this.uuid;
		if (bd.getMinutes() == ed.getMinutes() && bd.getHours() == ed.getHours()) {
			jq.alert('The DST begin time and end time cannot be equal', {icon: 'ERROR'});
			jq('#' + uuid + '-dd').remove();
			delete this._ghost[uuid];
			if (id)
				jq(id, zk)[0].style.visibility = '';
		} else {
			//ZKCAL-50: add event on DST start day
			var zoneBd = this.zoneBd,
				DST = zoneBd.getHours() == 23 ? 1 : 0;
			bd.setHours(bd.getHours() + (bd.getTime() == zoneBd.getTime() ? DST * 2 : DST));
			ed.setHours(ed.getHours() + DST);
			var widget = this,
				data = [
					this.fixTimeZoneFromClient(bd),
					this.fixTimeZoneFromClient(ed),
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
	
	_getTimeOffset: function (d, dur, dur2) {
		var d1 = new Date(d),
			index = dur2 ? dur2 : this.getTimeIndex(d) + dur,
			timeslots = this._timeslots;

		d1.setHours(this._bt + Math.floor(index / timeslots), (index % timeslots) * (60 / timeslots), 0, 0);
		d.setMilliseconds(0);

		return dur2 ? d1 - d : d - d1;
	},

	fixPosition: function () {
		var cnt = this.$n('cnt'),
			row = this.cntRows,
			perHgh = this.perHeight,
			weekDay = this.weekDay,
			hourCount = this._et - this._bt,
			timeslots = this._timeslots,
			slotCount = hourCount * this._timeslots;

		for (var i = 0, j = this._daySpace.length; i < j; i++) {
			var list = this._daySpace[i];
			if (!list.length) continue;
			var calItemsOneDay = [];
			for (var n = slotCount; n--;)
				calItemsOneDay[n] = [];
			/*  position .calitem according to timeslot into a 2D-array
                Item A's timeslot index 5 ~ 7
                Item B's timeslot index 6 ~ 8
                calItemsOneDay[5] = [A]
                calItemsOneDay[6] = [A, B]
                calItemsOneDay[7] = [A, B]
                calItemsOneDay[8] = [B]
             */
			for (var k = 0, l = list.length; k < l; k++) {
				var ce = list[k],
					childWidget = zk.Widget.$(ce),
					target = weekDay[ce._preOffset].firstChild,
					item = childWidget.item,
					bd = new Date(item.zoneBd),
					ed = new Date(item.zoneEd),
					isCrossDay = ed.getDate() != bd.getDate();
				jq(target).append(ce);
				ce.style.visibility = '';

				ce._bd = bd;
				ce._ed = ed;
				// cross day
				if (isCrossDay)
					ed = new Date(ed.getTime() - 1000);

				// fix hgh
				var bi = this.getTimeIndex(bd),
					ei = this.getTimeIndex(ed),
					top = bi * perHgh,
					timeslots = this._timeslots,
					bdHeightOffs = 0,
					edHeightOffs = 0;

				if (bi) {
					var bdTimeslot = _getHightOffsPercent(bd, timeslots);
					bdHeightOffs = bdTimeslot ? perHgh * bdTimeslot : 0;
				}
				if (ei) {
					var edTimeslot = _getHightOffsPercent(ed, timeslots);
					edHeightOffs = edTimeslot ? perHgh * edTimeslot : 0;
					if (isCrossDay)//ZKCAL-29
						ed = new Date(ed.getTime() + 1000);
				}

				ce._bi = bi;
				ce._ei = ei;
				ce.style.top = jq.px(top + bdHeightOffs);
				_setItemWgtHeight(this, ce, ce.id, ((ei - bi) * perHgh) - bdHeightOffs + edHeightOffs);

				if (bi < 0) continue;

				// width info
				for (var n = 0; bi <= ei && bi < slotCount;) {
					var tmp = calItemsOneDay[bi++];
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

			var childWidget = list[list.length - 1],
				target = weekDay[childWidget._preOffset].firstChild;

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
					for (let n = 0; n < nItemOneSlot; n++) {
						let sameSlotItem = calItemsOneDay[slotIndex][n]; //another item in the same timeslot
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
						var ei2 = sameSlotItem._ei;
						if (endIndex < ei2)
							endIndex = ei2;
					}
					maxOverlappingItemCount = maxOverlappingItemCount > overlappingItemCount? maxOverlappingItemCount : overlappingItemCount;
				}
				var len = maxOverlappingItemCount ? maxOverlappingItemCount : 1,
					width = 100 / len,
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
		
	beforeSize: zk.ie6_ ? function (cmp) {
		var inner = this.$n('inner');
		inner.style.height = '0px';
		inner.lastChild.style.height = '0px';
	} : function () {return false;},
	
	onSize: _zkf = function () {
			_updateCntHeight(this);
		if (!this.perHeight) {
			this.perHeight = this.cntRows.firstChild.firstChild.offsetHeight / this._timeslots;
			this.createChildrenWidget_();
			this._rePositionDaylong();
			this._rePositionDay();
			var a = this.$n('hdarrow');
			//arrow position
			a.style.left = jq.px((a.parentNode.offsetWidth * this.ts - a.offsetWidth) - 5);
		}
		
		var cmp = this.$n(),
			hgh = cmp.offsetHeight;
		this.clearGhost();
		if (!hgh) return;
			
		var inner = this.$n('inner'),
			cnt = this.$n('cnt'),
			cntHeight = zk(inner.parentNode).padBorderHeight() +
						zk(inner).padBorderHeight() +
						zk(cnt).padBorderHeight() +
						jq(cnt).find('.z-calendars-week-cnt').outerHeight() +
						jq(inner).find('.z-calendars-week-header').height(),
			row = this.cntRows;
		for (var child = cmp.firstChild; child; child = child.nextSibling) {
			if (this.isLegalChild(child))
				hgh -= child.offsetHeight;
		}
		
		if (hgh > cntHeight)
			hgh = cntHeight;
		
		hgh = zk(inner.parentNode).revisedHeight(hgh);
		hgh = zk(inner).revisedHeight(hgh);
		inner.style.height = jq.px0(hgh);
		hgh -= inner.firstChild.offsetHeight;
		hgh = zk(inner.lastChild).revisedHeight(hgh);
		inner.lastChild.style.height = jq.px(hgh);

		// sync scrollTop
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
		//Fix ZKCAL-55: Problems with horizontal scrollbar
		//get the initial offset left value
		this._initLeft = offs[0];

		this.closeFloats();

		// scrollbar width
		var width = cnt.offsetWidth - cnt.firstChild.offsetWidth,
			table = cnt.previousSibling.firstChild;
		table.rows[0].lastChild.style.width = jq.px(zk(table.rows[1].firstChild).revisedWidth(width));
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
			ts = widget.ts,
			cells = widget.cntRows.cells,
			perWidgetHeight = widget.perHeight;
		dg._zcells = cells;
		dg._zoffs = {
			top: zk(cnt).revisedOffset()[1],
			height: cnt.offsetHeight,
			size: cells.length - ts, // the size of the event column
			beginIndex: ts, // begin index
			perWidgetHeight: perWidgetHeight, // per height
			totalHeight: cells[ts].firstChild.offsetHeight // total height
		};
		if (!ce) _createDragStart(dg, evt);
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
			
			var faker = ce.cloneNode(true),
				uuid = widget.uuid,
				beginIndex = widget.beginIndex;
			
				
			faker.id = uuid + '-dd';

			//reset
			ce.parentNode.appendChild(faker);
			ce.style.visibility = 'hidden';
			dg.node = jq('#' + uuid + '-dd')[0];

			dg._zevt = ce;
			dg._zhd = dg.node.childNodes[0].firstChild.firstChild.firstChild;
			
			if (dg._zrz) _resizeDragStart(dg);
			else _updateDragStart(dg, evt, ce, faker);
			
			// begin index
			dg._zoffs.beginIndex = beginIndex + Math.floor(ce.offsetTop / ph);
			// end index
			dg._zoffs.endIndex = beginIndex + Math.ceil(ce.offsetHeight / ph);
		}
		return dg.node;
	},

	_drawDaydrag: function (dg, p, evt) {
		if (dg._zevt && dg._zevt._error) return;
		
		var widget = dg.control,
			zoffs = dg._zoffs,
			y = evt.pageY,
			y1 = zoffs.t,
			cnt = dg.handle,
			ph = zoffs.ph;

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
		} else if (y + ph > y1 + zoffs.h) {
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
			
		if (!dg._zevt) _createDragging(dg, evt);
		else if (dg._zrz) _resizeDragging(dg, evt);
		else _updateDragging(dg, evt);
	},

	_endghostDaydrag: function (dg, origin) {
		if (dg._zevt) {
			_updateDragEndghost(dg);
			if (dg._zrz)
				_resizeDragEndghost(dg);
		} else _createDragEndghost(dg);
	},

	_endDaydrag: function (dg, evt) {
		if (!dg || !dg._zdata) return;
		var widget = dg.control,
			ghostNode = dg._zdata.ghostNode;
		
		if (widget._resizing) {
			widget._resizing = null;
		}
			
		if (dg._zevt && dg._zevt._error) {
			dg._zevt._error = false;
			dg._zevt.style.visibility = '';
			jq('#' + widget.uuid + '-dd').remove();
			return;
		}
		clearInterval(widget.run);
		//keep ghostNode not be disappear
		ghostNode.parent.append(jq(ghostNode));

		if (!dg._zevt) _createDragEnd(dg, evt);
		else if (dg._zrz) _resizeDragEnd(dg, evt);
		else _updateDragEnd(dg, evt);
		
		// fix opera jumping
		if (zk.opera)
			dg.handle.scrollTop = widget._scrollInfo[widget.uuid];
			
		dg._zchanged = dg._zecnt = dg._zrzoffs =
		dg._zrs = dg._zdata = dg._zcells =
		dg._zoffs = dg._zevt = null;
	},
	
	_resetPosition: function (faker, widget) {
		faker.style.width = '100%';
		faker.style.left = '0px';
		jq(faker).addClass(widget.getZclass() + '-evt-ghost');
	},

	isOverlapping(overlappingCount){
		return overlappingCount > 1;
	},
	HALF_HOUR_HEIGHT: 30, //the same in _variable.less
});
})();