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
			style: style,
			headerStyle: headerStyle,
			contentStyle: contentStyle
		};
		this.uuid = ce.id;
	},
	
	defineCss_: function () {
		var ce = this.item,
			style = ce.style,
			headerStyle = ce.headerStyle,
			contentStyle = ce.contentStyle
			p = this.params;
		p.style = style;
		p.headerStyle = headerStyle,
		p.contentStyle = contentStyle
	},
	
	updateHeaderStyle_: function (headerStyle) {
		var node = jq(this.$n()),
			body = jq(this.$n('hd')),
			p = this.params;
		body.attr('style', headerStyle);
	},
		
	getZclass: function () {
		var zcls = this.item.zclass;
		return zcls ? zcls : 'z-calitem';
	},

	getSclass: function () {
		return this.item.sclass;
	},

	calculate_: function (updateLastModify) {
		var itemNode = this.$n(),
			item = this.item,
			calendarWidget = this.parent,
			beginDate = item.zoneBd,
			endDate = item.zoneEd,
			inMonthMold = calendarWidget.mon;
		
		if (inMonthMold)
			itemNode.startWeek = item.startWeek;
		
		var time = inMonthMold ? itemNode.startWeek : calendarWidget;

		itemNode.zoneBd = beginDate;
		itemNode.zoneEd = endDate;
		
		this._createBoundTime(itemNode, beginDate, endDate);
		
		//_afterOffset could be calculated using bound time after processing clone node
		if (this.processCloneNode_)
			this.processCloneNode_(itemNode);
		
		itemNode._preOffset = item._preOffset;
		if (this._isDayItem())
			return;
		//should put the code after this line into DayLongItem.calculate_()
		/* _afterOffset, the number of spacer needed after the over-1-day item.
		 * e.g. an item spans 3 days, day1 ~ day3, so its _afterOffset is 4, 7 days a week.
		 */
		itemNode._afterOffset = this.cloneCount ? 0 :
								(itemNode.lowerBoundEd >= time.zoneEd ? 0 : this._getOffset({start: itemNode.lowerBoundEd, end: time.zoneEd}));

		itemNode._days = item._days = this.getDays();
		if (updateLastModify)
			itemNode._lastModify = new Date().getTime();
	},
	
	isBeginTimeChange: function (item) {
		return this.$n().zoneBd.getTime() != item.zoneBd.getTime();
	},

	isEndTimeChange: function (item) {
		return this.$n().zoneEd.getTime() != item.zoneEd.getTime();
	},

	_createBoundTime: function (calendarItemNode, beginDate, endDate) {
		//have findBoundTime_ function
		if (this.findBoundTime_) {
			var time = this.findBoundTime_(beginDate, endDate);
			beginDate = time.beginDate;
			endDate = time.endDate;
		}
		calendarItemNode.upperBoundBd = this._setBoundDate(beginDate); // earliest
		if (this._isDayItem()) return;
		if (calUtil.isLessThan30Min(beginDate, endDate)){
			calendarItemNode.lowerBoundEd = calUtil.addDay(new Date(endDate), 1);
		}else{
			calendarItemNode.lowerBoundEd = this._setBoundDate(endDate, true); // latest
		}
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
		var boundDate = new Date(date);
		if (date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() != 0) {
			boundDate.setHours(0,0,0,0);
			if (isAddOneDay){
				boundDate = calUtil.addDay(boundDate, 1);
			}
		}
		return boundDate;
	},
	isSclassChanged: function(updatedItem){
		return this.getSclass() != updatedItem.sclass;
	},
	redrawSclass: function(updatedItem){
		if (this.$n()){
			this.$n().className = this.domClass_();
		}
	},
	/**
	 * @param date
	 */
	format: function (date){
		return zk.fmt.Date.formatDate(date,'HH:mm');
	}
});