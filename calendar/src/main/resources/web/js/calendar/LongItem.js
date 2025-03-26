/* LongItem.js

	Purpose:
		an item longer than 1 day in the default mold
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

		var item = this.item,
			isBefore = item.zoneBd < parent.zoneBd,
			isAfter = item.zoneEd > parent.zoneEd;

		out.push(this.$class.TEMPLATE.main(
			item.id,
			this.domAttrs_(),
			this.params,
			isBefore,
			isAfter,
			item.content
		));
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
	updateArrow_: function (needAdd, arrowCls) {
		jq(this.$n('body')).toggleClass(arrowCls, needAdd);
	}

},{
	TEMPLATE: {
		main: function(id, domAttrs, css, isBefore, isAfter, content) {
			const arrowClasses = [
				isBefore ? css.left_arrow : '',
				isAfter ? css.right_arrow : ''
			].filter(Boolean).join(' ');
			//avoid the indentation producing text nodes in DOM
			return `<div ${domAttrs}>` +
						`<div id="${id}-body" class="${css.body} ${arrowClasses}">` +
							`<div id="${id}-inner" class="${css.inner}" style="${css.style}">` +
								`<div id="${id}-cnt" class="${css.content}" style="${css.contentStyle}">` +
									`<div class="${css.text}">${content}</div>` +
								`</div>` +
							`</div>` +
						`</div>` +
					`</div>`;
		}
	},
});