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
		 	headerStyle = this.headerStyle,
		 	contentStyle = this.contentStyle,
			arrowStyle = this.arrowStyle,
			parent = this.parent,
			isBefore = ce.zoneBd < parent.zoneBd,
			isAfter = ce.zoneEd > parent.zoneEd,
			cornerStyle = this.getCornerStyle_();		
		
		out.push('<div', this.domAttrs_(), '>',
				'<div class="', this.t1, '"', headerStyle, '></div>',
				'<div class="', this.t2, '"', headerStyle, '>',
				'<div class="', this.t3, '"', cornerStyle, '></div></div>',
				'<div id="', id, '-body" class="', this.body, '"', headerStyle, '>',
				'<div class="', this.inner, '"', this.getInnerStyle_(), '>',
				'<div id="', id, '-cnt" class="', this.content);
	
		if (isBefore) out.push(' ', this.left_arrow);
		if (isAfter) out.push(' ', this.right_arrow);
	
		out.push('"', contentStyle, '>');

		if (isBefore)
			out.push(this.left_arrowCnt);
		if (isAfter)
			out.push(this.right_arrowCnt);
	
		out.push('<div class="', this.text, '">', ce.content, '</div></div></div></div>',
				'<div class="', this.b2, '"', headerStyle, '>',
				'<div class="', this.b3, '"', cornerStyle, '></div></div>',
				'<div class="', this.b1, '"', headerStyle, '></div></div>');
	},
	
	update: function() {
		this.defineCss_();
		
		var cnt = jq(this.$n('cnt')),
			parent = this.parent,
			ce = this.event,
			isBefore = ce.zoneBd < parent.zoneBd,
			isAfter = ce.zoneEd > parent.zoneEd;
					
		this.updateHeaderStyle_(this.headerStyle);		
		
		if (this.updateContentStyle_)
			this.updateContentStyle_(this.contentStyle);		
		
		cnt.attr('class', this.content);
		cnt.attr('style', this.contentStyle);
		cnt.children('.' + this.text).html(ce.content);
		
		this.updateArrow_(isAfter, this.right_arrow, this.right_arrow_icon, this.right_arrowCnt);
		this.updateArrow_(isBefore, this.left_arrow, this.left_arrow_icon, this.left_arrowCnt);
		
		this.calculate_();	
	},
	
	findBoundTime_: function(bd, ed) {
		var parent = this.parent,
			pbd = parent.zoneBd,
			ped = parent.zoneEd;		
		
		if (bd < pbd) 
			bd = new Date(pbd.getTime());
			
		if (ed > ped) 
			ed = new Date(ped.getTime());	
		
		//end equals calendar begin
		if ((ed.getFullYear() == pbd.getFullYear()) && (ed.getDOY() == pbd.getDOY()))
			ed = new Date(pbd.getTime() + this.DAYTIME);
			
		return {bd: bd, ed: ed};
	},
	
	defineClassName_: function() {
		this.$super('defineClassName_', arguments);
		// CSS ClassName
		var zcls = this.getZclass(),
			contentColor = this.event.contentColor;
		
		this.left_arrow = zcls + "-left-arrow";
		this.right_arrow = zcls + "-right-arrow";
		this.left_arrow_icon = this.left_arrow + "-icon";
		this.right_arrow_icon = this.right_arrow + "-icon";
		this.arrowStyle = contentColor ? 
			' style="border-bottom-color:' + contentColor + 
			';border-top-color:' + contentColor + '"': '';
			
		this.left_arrowCnt = '<div class="' + this.left_arrow_icon + '"' + this.arrowStyle + '>&nbsp;</div>';
		this.right_arrowCnt = '<div class="' + this.right_arrow_icon + '"' + this.arrowStyle + '>&nbsp;</div>';
		
	},
		
	updateArrow_: function(needAdd, arrowCls, iconCls, arrowCnt) {
		var cnt = jq(this.$n('cnt')),
			target = cnt.children('.' + iconCls), 
			hasArrow = target.length;
		
		if (needAdd) {
			cnt.addClass(arrowCls);
			if (!hasArrow)
				cnt.prepend(arrowCnt);
		} else if (hasArrow)
			target.remove();	
	}
	
	
});