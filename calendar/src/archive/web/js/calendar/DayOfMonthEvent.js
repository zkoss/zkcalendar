/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DayOfMonthEvent = zk.$extends(zul.Widget, {	
	bind_ : function() {// after compose
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
			headerColor = ce.headerColor,
			contentColor = ce.contentColor,
			headerStyle = headerColor ? ' style="color:' + headerColor + '"': '',
			contentStyle = headerStyle,
			bd = ce.beginDate,
			contentText = ce.title ? ce.title.substr(0,ce.title.indexOf(' - ')): 
						zk.fmt.Date.formatDate(bd,'HH:mm');	
			
			this.uuid = ce.id;
		
		// CSS ClassName
		var zcls = ce.zclass,
			header = zcls + "-header",
			content = zcls + "-cnt";
		
		out.push('<div', this.domAttrs_(), '>',
				'<span id="', id, '-hd" class="', header, '"', headerStyle, '>', contentText, '&nbsp;</span>',
				'<span id="', id, '-cnt" class="', content, '"', contentStyle, '>', ce.content, '</span></div>');		
	},
	
	getZclass: function() {
		return "z-calevent";
	},
	
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);		
		return scls + ' ' + this.getZclass() + '-month';
	},		
	
	_calculate: function() {
		var node = this.$n(),
			parent = this.parent,
			event = this.event,
			weekDates = parent._weekDates,
			bd = new Date(event.beginDate.getTime()),
			ed = new Date(event.endDate.getTime()),
			ONE_DAY = parent.DAYTIME,
			startWeek;		
		
		//find the start week
		for (var i = 0, j = weekDates.length; i < j; i++) {
			var weekDate = weekDates[i];				
			if (bd < weekDate.ed) {
				startWeek = weekDate;
				break
			}			
		}			
		node.startWeek = startWeek;
			
		//used for calculate position
		node._days = 1;		
		node.upperBoundBd = this._setBoundDate(bd);
		node.lowerBoundEd = this._setBoundDate(ed, ONE_DAY);
		node._preOffset = (bd.getTime() - startWeek.bd.getTime()) / ONE_DAY;
		node._afterOffset = (startWeek.ed.getTime() - ed.getTime()) / ONE_DAY;		
		//used for sort
		node.bd = event.beginDate;
		node.ed = event.endDate;		
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
		var ce = this.event,
			hd = jq(this.$n('hd')),
			cnt = jq(this.$n('cnt')),		
			headerColor = ce.headerColor,
			contentColor = ce.contentColor,
			headerStyle = headerColor ? 'color:' + headerColor : '' ,
			contentStyle = headerStyle,
			contentText = ce.title ? ce.title.substr(0,ce.title.indexOf(' - ')): 
						zk.fmt.Date.formatDate(ce.beginDate,'HH:mm');
		hd.attr('style', headerStyle);	
		cnt.attr('style', contentStyle);			
		
		hd.html(contentText + '&nbsp;');		
		cnt.html(ce.content);
		
		this._calculate();		
	}	
});