/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.LongEvent = zk.$extends(calendar.Event, {

	redraw: function (out) {
		this.defineClassName_();
		
		var ce = this.event,
			id = ce.id,
			p = this.params,
			headerStyle = p.headerStyle,
			contentStyle = p.contentStyle,
			arrowStyle = p.arrowStyle,
			parent = this.parent,
			isBefore = ce.zoneBd < parent.zoneBd,
			isAfter = ce.zoneEd > parent.zoneEd,
			cornerStyle = this.getCornerStyle_();
		
		out.push('<div', this.domAttrs_(), '>',
				'<div id="', id, '-body" class="', p.body);

		if (isBefore)
			out.push(' ' + p.left_arrow);
		if (isAfter)
			out.push(' ' + p.right_arrow);

		out.push('"', headerStyle, '>',
				'<div class="', p.inner, '"', this.getInnerStyle_(), '>',
				'<div id="', id, '-cnt" class="', p.content);

		out.push('"', contentStyle, '>');

		out.push('<div class="', p.text, '">', ce.content, '</div></div></div></div>',
				'</div>');
	},
	
	update: function (updateLastModify) {
		this.defineCss_();
		
		var cnt = jq(this.$n('cnt')),
			parent = this.parent,
			ce = this.event,
			p = this.params,
			isBefore = ce.zoneBd < parent.zoneBd,
			isAfter = ce.zoneEd > parent.zoneEd;
					
		this.updateHeaderStyle_(p.headerStyle);
		
		if (this.updateContentStyle_)
			this.updateContentStyle_(p.contentStyle);
		
		cnt.attr('class', p.content);
		cnt.attr('style', p.contentStyle);
		cnt.children('.' + p.text).html(ce.content);
		
		this.updateArrow_(isAfter, p.right_arrow);
		this.updateArrow_(isBefore, p.left_arrow);
		
		this.calculate_(updateLastModify);
	},
	
	findBoundTime_: function (bd, ed) {
		var parent = this.parent,
			pbd = parent.zoneBd,
			ped = parent.zoneEd;
		
		if (bd < pbd)
			bd = new Date(pbd);
			
		if (ed > ped)
			ed = new Date(ped);
		
		//end equals calendar begin, Bug ZKCAL-32: should check to seconds
		if (ed.getHours() == 0 && ed.getMinutes() == 0 && ed.getSeconds() == 0 && calUtil.isTheSameDay(ed, pbd))
			ed = calUtil.addDay(ed, 1);
			
		return {bd: bd, ed: ed};
	},
	
	defineClassName_: function () {
		this.$super('defineClassName_', arguments);
		// CSS ClassName
		var zcls = this.getZclass(),
			p = this.params,
			contentColor = this.event.contentColor;
		
		p.left_arrow = zcls + '-left-arrow';
		p.right_arrow = zcls + '-right-arrow';

		p.arrowStyle = contentColor ?
			' style="border-bottom-color:' + contentColor +
			';border-top-color:' + contentColor + '"' : '';
	},
	
	defineCss_: function () {
		this.$super('defineCss_', arguments);
		
		var contentColor = this.event.contentColor,
			p = this.params;
		
		p.arrowStyle = contentColor ?
			' style="border-bottom-color:' + contentColor +
			';border-top-color:' + contentColor + '"' : '';
	},
	
	updateArrow_: function (needAdd, arrowCls) {
		jq(this.$n('body')).toggleClass(arrowCls, needAdd);
	}

});