/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DaylongOfMonthEvent = zk.$extends(zul.Widget, {
	$init: function () {
		this.$supers('$init', arguments);
		this.cloneNodes = [];
	},
		
	bind_: function() {// after compose
		this.$supers('bind_', arguments);	
		this._calculate();			
	},
	
	unbind_ : function() {
		this.event = null;	
		this.$supers('unbind_', arguments);
	},		
	
	redraw: function (out) {		
		var ce = this.event,			
			id = ce.id,
			isBefore = ce.beginDate < this.parent._beginDate,
			isAfter = ce.endDate > this.parent._endDate,
			headerColor = ce.headerColor,
		 	contentColor = ce.contentColor,
		 	isContentBlank = contentColor ? false: true,
		 	headerStyle = headerColor ? ' style="background:' + headerColor + '"': '' ,
		 	contentStyle = isContentBlank ? '': ' style="background:' + contentColor + '"',
		 	innerStyle = isContentBlank ? '': ' style="background:' + contentColor + 
		 			';border-left-color:' + contentColor + ';border-right-color:' + contentColor + '"',
		 	arrowStyle = isContentBlank ? '': 'style="border-bottom-color:' + contentColor + ';border-top-color:' + contentColor + '"';		
		
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
		
		out.push('<div', this.domAttrs_(), '>',
				'<div class="', t1, '"', headerStyle, '></div>',
				'<div class="', t2, '"', headerStyle, '>',
				'<div class="', t3, '"', contentStyle, '></div></div>',
				'<div id="', id, '-body" class="', body, '"', headerStyle, '>',
				'<div class="', inner, '"', innerStyle, '>',
				'<div id="', id, '-cnt" class="', content);
	
		if (isBefore) out.push(' ', left_arrow);
		if (isAfter) out.push(' ', right_arrow);
	
		out.push('"', contentStyle, '>');

		if (isBefore)
			out.push('<div class="', left_arrow_icon, '"', arrowStyle, '>&nbsp;</div>');
		if (isAfter)
			out.push('<div class="', right_arrow_icon, '"', arrowStyle, '>&nbsp;</div>');
	
		out.push('<div class="', text, '">', ce.content, '</div></div></div></div>',
				'<div class="', b2, '"', headerStyle, '>',
				'<div class="', b3, '"', contentStyle, '></div></div>',
				'<div class="', b1, '"', headerStyle, '></div></div>');
	},
		
	getZclass: function() {
		return "z-calevent";
	},
		
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);		
		return scls + ' ' + this.getZclass() + '-daylong-month';
	},
	
	_calculate: function() {		
		var parent = this.parent,
			node = this.$n(),
			event = this.event,
			weekDates = parent._weekDates,
			pbd = parent._beginDate,
			ped = parent._endDate,
			bd = new Date(event.beginDate.getTime()),
			ed = new Date(event.endDate.getTime()),
			ONE_DAY = parent.DAYTIME,
			startWeek,
			weeks;				
	
		//find the start week
		for (var i = 0, j = weekDates.length; i < j; i++) {
			var weekDate = weekDates[i];				
			if (bd < weekDate.ed){
				startWeek = weekDate;
				break
			}			
		}	
		node.startWeek = startWeek;
				
		if (ed > ped)
			ed.setTime(ped.getTime());
		if (bd < pbd)
			bd.setTime(pbd.getTime());
		//end equals calendar begin
		if ((ed.getFullYear() == pbd.getFullYear()) && (ed.getDOY() == pbd.getDOY()))
				ed.setTime(pbd.getTime() + ONE_DAY);
		
		//used for calculate position
		node.upperBoundBd = this._setBoundDate(bd);
		node.lowerBoundEd = this._setBoundDate(ed, ONE_DAY);
		
		//used for sort
		node.bd = this.event.beginDate;		
		
		//calculate over next week
		if (ed > startWeek.ed)
			weeks = Math.ceil((ed.getTime() - startWeek.ed.getTime())/parent.AWEEK);		
		
		this._processCloneNode(weekDates, weeks);	
		
		node._preOffset = (bd.getTime() - startWeek.bd.getTime()) / ONE_DAY;
		node._afterOffset = weeks ? 0: (startWeek.ed.getTime() - ed.getTime()) / ONE_DAY;
		node.ed = weeks ? startWeek.ed: event.endDate;
	},
	
	_setBoundDate: function(date,ONE_DAY) {
		if (date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() != 0){
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
			isContentBlank = contentColor ? false: true,
			headerStyle = headerColor ? 'background:' + headerColor: '',
			contentStyle = isContentBlank ? '': 'background:' + contentColor,
			innerStyle = isContentBlank ? '': 'background:' + contentColor + 
		 			';border-left-color:' + contentColor + ';border-right-color:' + contentColor,
			arrowStyle = isContentBlank ? '': 'border-bottom-color:' + contentColor + ';border-top-color:' + contentColor;
		
		node.children('.' + zcls + "-t1").attr('style',headerStyle);
		
		var t2 = node.children('.' + zcls + "-t2");
		t2.attr('style',headerStyle);
		jq(t2[0].firstChild).attr('style',contentStyle);	
		
		body.attr('style',headerStyle);
		body.children('.' + zcls + "-inner").attr('style',innerStyle);		
		node.children('.' + zcls + "-b1").attr('style',headerStyle);
		
		var b2 = node.children('.' + zcls + "-b2");
		b2.attr('style',headerStyle);
		jq(b2[0].firstChild).attr('style',contentStyle);
		
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
			if(!cnt.children('.' + left_arrow_icon).length)
				cnt.prepend('<div class="' + left_arrow_icon + '"' + arrowStyle + '>&nbsp;</div>');
		} else if (cnt.children('.' + left_arrow_icon).length)
			cnt.children('.' + left_arrow_icon).remove();	
		
		cnt.children('.' + zcls + "-text").html(ce.content);
		
		this._calculate();	
	},
		
	_createCloneNode: function(index) {
		var uuid = this.uuid,
			cloneNode = this.$n().cloneNode(true),
			body = jq(cloneNode).children('#'+this.uuid + '-body')[0],
			cnt = body.firstChild.firstChild;			
			
		//change id
		cloneNode.id = uuid + '-sub' + index;
		body.id = uuid + '-sub' + index + '-body';
		cnt.id = uuid + '-sub' + index + '-cnt';		
		cloneNode.cnt = cnt;
		
		return cloneNode;
	},
		
	_processCloneNode: function(weekDates, weeks) {
		var node = this.$n(),
			event = this.event,
			ONE_DAY = this.parent.DAYTIME;
		this.cloneNodes = [];
		if (!weeks) {			
			node._days = (node.lowerBoundEd.getTime() - node.upperBoundBd.getTime()) / ONE_DAY;		
			return;
		}
		
		node._days = (node.startWeek.ed.getTime() - node.upperBoundBd.getTime()) / ONE_DAY;
		
		var cnt = jq(this.$n('cnt')),
			startWeekIndex = weekDates.indexOf(node.startWeek) + 1,
			contentColor = event.contentColor,
			arrowStyle = contentColor ? 'style="border-bottom-color:' + 
				contentColor + ';border-top-color:' + contentColor + '"': '',
			zcls = this.getZclass(),
			left_arrow = zcls + "-left-arrow",
			right_arrow = zcls + "-right-arrow",
			left_arrow_icon = left_arrow + "-icon",
			right_arrow_icon = right_arrow + "-icon";	
		
		
		//add right arrow if over next week		
		cnt.addClass(right_arrow);
		jq(cnt[0].lastChild).before('<div class="' + right_arrow_icon + '"' + arrowStyle + '>&nbsp;</div>');			
			
		//clone node 
		for(var i = 0, j = weeks; i < j; i++){
			var cloneNode = this._createCloneNode(i),
				cloneCnt = jq(cloneNode.cnt),
				startWeek = weekDates[startWeekIndex + i];
			
			cloneNode._preOffset = 0;	
			cloneNode.bd = event.beginDate;
			cloneNode.upperBoundBd = startWeek.bd;
			cloneNode.startWeek = startWeek;	
			
			//not last clone node
			if (i != j - 1) {
				cloneNode._afterOffset = 0;
				cloneNode.ed = cloneNode.lowerBoundEd = startWeek.ed;				
				cloneNode._days = 7;
			} else {// last clone node
				cloneCnt.removeClass(right_arrow);
				cloneCnt.children('.' + right_arrow_icon).remove();
				cloneNode._afterOffset = (startWeek.ed.getTime() - node.lowerBoundEd.getTime()) / ONE_DAY;
				cloneNode.lowerBoundEd = node.lowerBoundEd;
				cloneNode.ed = event.endDate;
				cloneNode._days = (node.lowerBoundEd.getTime() - startWeek.bd.getTime()) / ONE_DAY;				
			}
			
			// always has left arrow because clone node always over previous week 
			if (!cloneCnt.children('.' + left_arrow_icon).length) {					
				cloneCnt.addClass(left_arrow);
				jq(cloneCnt[0].lastChild).before('<div class="' + left_arrow_icon + '"' + arrowStyle + '>&nbsp;</div>');				
			}
			this.cloneNodes.push(cloneNode);		
		}					
	}		
});