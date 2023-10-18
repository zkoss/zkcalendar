/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DayOfMonthItem = zk.$extends(calendar.Item, {
		
	redraw: function (out) {
		var ce = this.item,
			id = ce.id,
			zcls = this.getZclass(),
			inner = zcls + '-inner',
			header = zcls + '-header',
			content = zcls + '-cnt',
			style = ce.style,
			headerStyle = ce.headerStyle,
			contentStyle = ce.contentStyle;


		this.uuid = id;

		out.push('<div', this.domAttrs_(), '>',
				'<div id="', id, '-inner" class="', inner, '" style=" ', style ,'"','>',
				'<span id="', id, '-hd" class="', header, '" style=" ', headerStyle ,'"','>', this.getCntText(ce), '</span>',
				'<span id="', id, '-cnt" class="', content, '" style=" ', contentStyle ,'"','>', ce.content, '</span></div></div>');
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
		var ce = this.item,
			inner = jq(this.$n('inner')),
			hd = jq(this.$n('hd')),
			cnt = jq(this.$n('cnt')),
			innerStyle = ce.style,
			headerStyle = ce.headerStyle,
			contentStyle = ce.contentStyle;

		inner.attr('style', innerStyle);
		hd.attr('style', headerStyle);
		cnt.attr('style', contentStyle);
		hd.html(this.getCntText(ce));
		cnt.html(ce.content);
		
		this.calculate_(updateLastModify);
	}
});