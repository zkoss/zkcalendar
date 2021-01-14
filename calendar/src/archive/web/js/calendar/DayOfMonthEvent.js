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
			innerStyle = headerColor ? ' style="background:' + headerColor + '"' : '',
			zcls = this.getZclass(),
			inner = zcls + '-inner',
			header = zcls + '-header',
			content = zcls + '-cnt';

		this.uuid = id;

		out.push('<div', this.domAttrs_(), '>',
				'<div id="', id, '-inner" class="', inner, '"', innerStyle, '>',
				'<span id="', id, '-hd" class="', header, '">', this.getCntText(ce), '</span>',
				'<span id="', id, '-cnt" class="', content, '">', ce.content, '</span></div></div>');
	},
	
	getCntText: function (ce) {
		return ce.title ? ce.title.substr(0,ce.title.indexOf(' - ')) :
							zk.fmt.Date.formatDate(ce.zoneBd,'HH:mm');
	},
	
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);
		return scls + ' ' + this.getZclass() + '-month';
	},
	
	getDays: function () {
		return 1;
	},
	
	update: function (updateLastModify) {
		var ce = this.event,
			inner = jq(this.$n('inner')),
			hd = jq(this.$n('hd')),
			cnt = jq(this.$n('cnt')),
			headerColor = ce.headerColor,
			innerStyle = headerColor ? 'background:' + headerColor : '';

		inner.attr('style', innerStyle);
		hd.html(this.getCntText(ce) + '&nbsp;');
		cnt.html(ce.content);
		
		this.calculate_(updateLastModify);
	}
});