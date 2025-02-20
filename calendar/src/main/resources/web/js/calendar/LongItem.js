/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.LongItem = zk.$extends(calendar.Item, {

	redraw: function (out) {
		this.defineClassName_();
		
		var ce = this.item,
			id = ce.id,
			p = this.params,
			style = p.style,
			contentStyle = p.contentStyle,
			parent = this.parent,
			isBefore = ce.zoneBd < parent.zoneBd,
			isAfter = ce.zoneEd > parent.zoneEd;
		
		out.push('<div', this.domAttrs_(), '>',
				'<div id="', id, '-body" class="', p.body);

		if (isBefore)
			out.push(' ' + p.left_arrow);
		if (isAfter)
			out.push(' ' + p.right_arrow);

		out.push('"','>',
				'<div id="', id, '-inner"  class="', p.inner, '"', ' style="', style , '"', '>',
				'<div id="', id, '-cnt" class="', p.content, '"', ' style="', contentStyle, '"', '>',
				'<div class="', p.text, '">', ce.content, '</div></div></div></div>',
				'</div>');
	},
	
	update: function (updateLastModify) {
		this.defineCss_();
		
		var inner = jq(this.$n('inner')),
			cnt = jq(this.$n('cnt')),
			parent = this.parent,
			ce = this.item,
			p = this.params,
			isBefore = ce.zoneBd < parent.zoneBd,
			isAfter = ce.zoneEd > parent.zoneEd;
					
		this.updateHeaderStyle_(p.headerStyle);
		
		if (this.updateContentStyle_)
			this.updateContentStyle_(p.contentStyle);
		
		inner.attr('style', p.style);
		
		cnt.attr('class', p.content);
		cnt.attr('style', p.contentStyle);
		cnt.children('.' + p.text).html(ce.content);
		
		this.updateArrow_(isAfter, p.right_arrow);
		this.updateArrow_(isBefore, p.left_arrow);
		
		this.calculate_(updateLastModify);
	},
	
	/**
	 * returns a date pair based on the provided dates input, but bounded into the currently displayed timeframe
	 * (will truncate the dates to fit in the provided calendar displayed start and end dates range)
	 * 
	 * @param {Date} beginDate 
	 * @param {Date} endDate 
	 * @returns {beginDate, endDate}
	 */
	findBoundTime_: function (beginDate, endDate) {
		var calendarWidget = this.parent,
			calendarBeginDate = calendarWidget.zoneBd,
			calendarEndDate = calendarWidget.zoneEd;
		
		if (beginDate < calendarBeginDate)
		beginDate = new Date(calendarBeginDate);
			
		if (endDate > calendarEndDate)
			endDate = new Date(calendarEndDate);
		
		//end equals calendar begin, Bug ZKCAL-32: should check to seconds
		if (endDate.getHours() == 0 && endDate.getMinutes() == 0 && endDate.getSeconds() == 0 && calUtil.isTheSameDay(endDate, calendarBeginDate))
			endDate = calUtil.addDay(endDate, 1);
			
		return {beginDate: beginDate, endDate: endDate};
	},
	
	defineClassName_: function () {
		this.$super('defineClassName_', arguments);
		// CSS ClassName
		var zcls = this.getZclass(),
			p = this.params;
		p.left_arrow = zcls + '-left-arrow';
		p.right_arrow = zcls + '-right-arrow';
	},
	
	/*defineCss_: function () {
		this.$super('defineCss_', arguments);
	},*/
	
	updateArrow_: function (needAdd, arrowCls) {
		jq(this.$n('body')).toggleClass(arrowCls, needAdd);
	}

});