/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DaylongEvent = zk.$extends(zul.Widget, {	
	
	bind_ : function() {
		this.$supers('bind_', arguments);		
		this._calculate();			
	},
	
	unbind_ : function() {
		this.event = this._afterOffset = this._preOffset = this._days = null;	
		this.$supers('unbind_', arguments);
	},			
	
	redraw: function (out) {		
		var ce = this.event,			
			id = ce.id,
			begin = this.parent._beginDate,
			end = this.parent._endDate,
			isBefore = ce.beginDate < begin,
			isAfter = ce.endDate > end,
			headerColor = ce.headerColor,
		 	contentColor = ce.contentColor,
		 	headerStyle = headerColor ? ' style="background:' + headerColor + '"': '' ,
		 	contentStyle = contentColor ? ' style="background:' + contentColor + '"': '' ,
		 	arrowStyle = contentColor ? 'style="border-bottom-color:' + contentColor + ';border-top-color:' + contentColor + '"': '' ;		
		
		this.uuid = ce.id;			
		
		// CSS ClassName
		var zcls = ce.zclass,
		 	body = zcls + "-body",
		 	inner = zcls + "-inner",
		 	content = zcls + "-cnt",
		 	text = zcls + "-text",
		 	left_arrow = zcls + "-left-arrow",
		 	right_arrow = zcls + "-right-arrow",
		 	left_arrow_icon = left_arrow + "-icon",
		 	right_arrow_icon = right_arrow + "-icon";
		
		// round corner
		var t1 = zcls + "-t1",
			t2 = zcls + "-t2",
			t3 = zcls + "-t3",
			b1 = zcls + "-b1",
			b2 = zcls + "-b2",
			b3 = zcls + "-b3";		

		out.push('<div',this.domAttrs_(),'>',
				'<div class="', t1, '"', headerStyle, '></div>',
				'<div class="', t2, '"', headerStyle, '>',
				'<div class="', t3, '"></div></div>',
				'<div id="', id, '-body" class="', body, '"', headerStyle, '>',
				'<div class="', inner, '"', headerStyle, '>',
				'<div id="', id, '-cnt" class="', content);
		
		if (isBefore) out.push(" ", left_arrow);
		if (isAfter) out.push(" ", right_arrow);
		
		out.push('"', contentStyle, '>');

		if (isBefore)
			out.push('<div class="', left_arrow_icon, '"', arrowStyle, '>&nbsp;</div>');
		if (isAfter)
			out.push('<div class="', right_arrow_icon, '"', arrowStyle, '>&nbsp;</div>');
		out.push('<div class="', text, '">', ce.content, '</div></div>',
				'</div></div>',
				'<div class="', b2, '"', headerStyle, '>',
				'<div class="', b3, '"></div></div>',
				'<div class="', b1, '"', headerStyle, '></div></div>');
	},
		
	getZclass: function() {
		return "z-calevent";
	},
		
	_calculate: function() {
		var parent = this.parent,
			pbd = parent._localBd,
			ped = parent._localEd,
			ONE_DAY = parent.DAYTIME,
			bd = new Date(this.event.bd.getTime()),
			ed = new Date(this.event.ed.getTime());
        
		if (bd < pbd) 
			bd = new Date(pbd.getTime());
        
		if (ed > ped) 
			ed = new Date(ped.getTime());		
		
		this.upperBoundBd = this._setBoundDate(bd)		
		this.lowerBoundEd = this._setBoundDate(ed, ONE_DAY);
		
		//end equals calendar begin
		if ((ed.getFullYear() == pbd.getFullYear()) && (ed.getDOY() == pbd.getDOY()))
			ed.setTime(pbd.getTime() + ONE_DAY);
		
		this._days = (ed.getTime() - bd.getTime()) / ONE_DAY;
		this._preOffset = (bd.getTime() - pbd.getTime()) / ONE_DAY;
		this._afterOffset = (ped.getTime() - ed.getTime()) / ONE_DAY;		

	
		if (this._days == 0){
			this._days++;
			this._afterOffset--;
		}
	},
	
	_setBoundDate: function(date,ONE_DAY) {
		if (date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() != 0) {
			if (ONE_DAY) date.setTime(date.getTime() + ONE_DAY);
			
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);			
		}
		return date;
	},
	
	update: function() {		
		var node = jq(this.$n()),
			ce = this.event,	
			zcls = ce.zclass,
			body = jq(this.$n('body')),
			cnt = jq(this.$n('cnt')),
			isBefore = ce.beginDate < this.parent._beginDate,
			isAfter = ce.endDate > this.parent._endDate,	
			left_arrow = zcls + "-left-arrow",
		 	right_arrow = zcls + "-right-arrow",
		 	left_arrow_icon = left_arrow + "-icon",
		 	right_arrow_icon = right_arrow + "-icon",
			headerColor = ce.headerColor,
			contentColor = ce.contentColor,
			headerStyle = headerColor ? 'background:' + headerColor: '',
			contentStyle = contentColor ? 'background:' + contentColor: '',
			arrowStyle = contentColor ? ' style="border-bottom-color:' + contentColor + ';border-top-color:' + contentColor + '"': '';
		
		node.children('.' + zcls + "-t1").attr('style',headerStyle);
		node.children('.' + zcls + "-t2").attr('style',headerStyle);
		body.attr('style',headerStyle);
		body.children('.' + zcls + "-inner").attr('style',headerStyle);		
		node.children('.' + zcls + "-b1").attr('style',headerStyle);	
		node.children('.' + zcls + "-b2").attr('style',headerStyle);
		
		cnt.attr('class',zcls + "-cnt");			
		
		cnt.attr('style',contentStyle);		
		
		if (isAfter) {
			cnt.addClass(right_arrow);
			if (!cnt.children('.' + right_arrow_icon).length)
				cnt.prepend('<div class="' + right_arrow_icon + '"' + arrowStyle + '>&nbsp;</div>');
		} else if (cnt.children('.' + right_arrow_icon).length)
			cnt.children('.' + right_arrow_icon).remove();		
		
		if (isBefore) {
			cnt.addClass(left_arrow);
			if (!cnt.children('.' + left_arrow_icon).length)
				cnt.prepend('<div class="' + left_arrow_icon + '"' + arrowStyle + '>&nbsp;</div>');
		} else if (cnt.children('.' + left_arrow_icon).length)
			cnt.children('.' + left_arrow_icon).remove();	
		
		cnt.children('.' + zcls + "-text").html(ce.content);
		
		this._calculate();	
	}
});