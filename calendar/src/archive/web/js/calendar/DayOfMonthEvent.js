/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DayOfMonthEvent = zk.$extends(calendar.Event, {
		
	redraw: function (out) {
		var ce = this.event,
			id = ce.id,
			headerColor = ce.headerColor,
			headerStyle = headerColor ? ' style="color:' + headerColor + '"': '',
			contentStyle = headerStyle,
			zcls = this.getZclass(),
			header = zcls + "-header",
			content = zcls + "-cnt";
			
		this.uuid = id;		
		
		out.push('<div', this.domAttrs_(), '>',
				'<span id="', id, '-hd" class="', header, '"', headerStyle, '>', this.getCntText(ce), '&nbsp;</span>',
				'<span id="', id, '-cnt" class="', content, '"', contentStyle, '>', ce.content, '</span></div>');		
	},
	
	getCntText: function(ce) {		
		return ce.title ? ce.title.substr(0,ce.title.indexOf(' - ')): 
							zk.fmt.Date.formatDate(ce.zoneBd,'HH:mm');	
	},
	
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);		
		return scls + ' ' + this.getZclass() + '-month';
	},
	
	getDays: function() {
		return 1;
	},
	
	update: function(updateLastModify) {
		var ce = this.event,
			hd = jq(this.$n('hd')),
			cnt = jq(this.$n('cnt')),		
			headerColor = ce.headerColor,
			headerStyle = headerColor ? 'color:' + headerColor : '' ,
			contentStyle = headerStyle;
			
		hd.attr('style', headerStyle);		
		hd.html(this.getCntText(ce) + '&nbsp;');
				
		cnt.attr('style', contentStyle);			
		cnt.html(ce.content);
		
		this.calculate_(updateLastModify);		
	}
});