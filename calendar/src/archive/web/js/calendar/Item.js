/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.Item = zk.$extends(zk.Widget, {
	bind_: function () {
		this.$supers('bind_', arguments);
		this.calculate_(true);
	},
	
	unbind_: function () {
		var node = this.$n();
		
		node.zoneBd = node.zoneEd = node._preOffset = node._afterOffset =
		node._days = this.item = null;
		this.$supers('unbind_', arguments);
	},
	
	defineClassName_: function () {
		var zcls = this.getZclass(),
			ce = this.item,
			style = ce.style,
			headerStyle = ce.headerStyle,
			contentStyle = ce.contentStyle;
		
		this.params = {
			// CSS ClassName
			body: zcls + '-body',
			inner: zcls + '-inner',
			content: zcls + '-cnt',
			text: zcls + '-text',
			style: ' style="' + style + '"',
			headerStyle: ' style="' + headerStyle + '"',
			contentStyle: ' style="' + contentStyle + '"'
		};
		this.uuid = ce.id;
	},
	
	defineCss_: function () {
		var ce = this.item,
			style = ce.style,
			headerStyle = ce.headerStyle,
			contentStyle = ce.contentStyle
			p = this.params;
		p.style = ' style="' + style + '"';
		p.headerStyle = headerStyle,
		p.contentStyle = contentStyle
	},
	
	updateHeaderStyle_: function (headerStyle) {
		var node = jq(this.$n()),
			body = jq(this.$n('body')),
			p = this.params;
		body.attr('style', headerStyle);
		body.children('.' + p.inner).attr('style', this.getInnerStyle_());
	},
		
	getZclass: function () {
		var zcls = this.item.zclass;
		return zcls ? zcls : 'z-calitem';
	},

	getSclass: function () {
		return this.item.sclass;
	},

	getInnerStyle_: function () {
		return this.params.headerStyle;
	},
	
	calculate_: function (updateLastModify) {
		var node = this.$n(),
			item = this.item,
			parent = this.parent,
			bd = item.zoneBd,
			ed = item.zoneEd,
			inMon = parent.mon;
		
		if (inMon)
			node.startWeek = item.startWeek;
		
		var time = inMon ? node.startWeek : parent;

		node.zoneBd = bd;
		node.zoneEd = ed;
		
		this._createBoundTime(node, bd, ed);
		
		//_afterOffset could be calculated using bound time after processing clone node
		if (this.processCloneNode_)
			this.processCloneNode_(node);
		
		node._preOffset = item._preOffset;
		
		if (this._isDayItem()) return;
		
		node._afterOffset = this.cloneCount ? 0 :
								this._getOffset({start: node.lowerBoundEd, end: time.zoneEd});
		
		node._days = item._days = this.getDays();
		if (updateLastModify)
			node._lastModify = new Date().getTime();
	},
	
	isBeginTimeChange: function (item) {
		return this.$n().zoneBd.getTime() != item.zoneBd.getTime();
	},

	isEndTimeChange: function (item) {
		return this.$n().zoneEd.getTime() != item.zoneEd.getTime();
	},

	_createBoundTime: function (node, bd, ed) {
		//have findBoundTime_ function
		if (this.findBoundTime_) {
			var time = this.findBoundTime_(bd, ed);
			bd = time.bd;
			ed = time.ed;
		}
		node.upperBoundBd = this._setBoundDate(bd);
		if (this._isDayItem()) return;
		node.lowerBoundEd = this._setBoundDate(ed, true);
	},
	
	_isDayItem: function () {
//		zk.log(this.$instanceof(calendarDayEvent));
		if (!this._isDayEvt)
			this._isDayEvt = this.className == 'calendar.DayItem';
		return this._isDayEvt;
	},
	
	_getOffset: function (time) {
		return calUtil.getPeriod(time.end, time.start);
	},
		
	_setBoundDate: function (date, isAddOneDay) {
		var result = new Date(date);
		if (date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() != 0) {
			if (isAddOneDay)
				result = calUtil.addDay(date, 1);
			result.setHours(0,0,0,0);
		}
		return result;
	}
});