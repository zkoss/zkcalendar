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
				'<div class="', p.t1, '"', headerStyle, '></div>',
				'<div class="', p.t2, '"', headerStyle, '>',
				'<div class="', p.t3, '"', cornerStyle, '></div></div>',
				'<div id="', id, '-body" class="', p.body, '"', headerStyle, '>',
				'<div class="', p.inner, '"', this.getInnerStyle_(), '>',
				'<div id="', id, '-cnt" class="', p.content);
	
		if (isBefore) out.push(' ', p.left_arrow);
		if (isAfter) out.push(' ', p.right_arrow);
	
		out.push('"', contentStyle, '>');

		if (isBefore)
			out.push(p.left_arrowCnt);
		if (isAfter)
			out.push(p.right_arrowCnt);
	
		out.push('<div class="', p.text, '">', ce.content, '</div></div></div></div>',
				'<div class="', p.b2, '"', headerStyle, '>',
				'<div class="', p.b3, '"', cornerStyle, '></div></div>',
				'<div class="', p.b1, '"', headerStyle, '></div></div>');
	},
	
	update: function(updateLastModify) {
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
		
		this.updateArrow_(isAfter, p.right_arrow, p.right_arrow_icon, p.right_arrowCnt);
		this.updateArrow_(isBefore, p.left_arrow, p.left_arrow_icon, p.left_arrowCnt);
		
		this.calculate_(updateLastModify);	
	},
	
	findBoundTime_: function(bd, ed) {
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
	
	defineClassName_: function() {
		this.$super('defineClassName_', arguments);
		// CSS ClassName
		var zcls = this.getZclass(),
			p = this.params,
			contentColor = this.event.contentColor;
		
		p.left_arrow = zcls + "-left-arrow";
		p.right_arrow = zcls + "-right-arrow";
		p.left_arrow_icon = p.left_arrow + "-icon";
		p.right_arrow_icon = p.right_arrow + "-icon";
		p.arrowStyle = contentColor ? 
			' style="border-bottom-color:' + contentColor + 
			';border-top-color:' + contentColor + '"': '';
			
		p.left_arrowCnt = '<div class="' + p.left_arrow_icon + '"' + p.arrowStyle + '>&nbsp;</div>';
		p.right_arrowCnt = '<div class="' + p.right_arrow_icon + '"' + p.arrowStyle + '>&nbsp;</div>';
		
	},
	
	defineCss_: function() {	
		this.$super('defineCss_', arguments);
		
		var contentColor = this.event.contentColor,
			p = this.params;
		
		p.arrowStyle = contentColor ? 
			' style="border-bottom-color:' + contentColor + 
			';border-top-color:' + contentColor + '"': '';
		p.left_arrowCnt = '<div class="' + p.left_arrow_icon + '"' + p.arrowStyle + '>&nbsp;</div>';
		p.right_arrowCnt = '<div class="' + p.right_arrow_icon + '"' + p.arrowStyle + '>&nbsp;</div>';
	},
	
	updateArrow_: function(needAdd, arrowCls, iconCls, arrowCnt) {
		var cnt = jq(this.$n('cnt')),
			target = cnt.children('.' + iconCls), 
			hasArrow = target.length;
			
		if (hasArrow)
			target.remove();		
		
		if (needAdd) {
			cnt.addClass(arrowCls);
			cnt.prepend(arrowCnt);
		}
	}
	
	
});