/* DayOfMonthItem.js

	Purpose:
		an item shorter than one day in month mold
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DayOfMonthItem = zk.$extends(calendar.Item, {
		
	redraw: function (out) {
		var id = this.item.id;
		this.uuid = id;
		out.push(this.$class.TEMPLATE.main(id, this.domAttrs_(), this.getHeader(), this.item, this.getZclass()));
	},
	
	getHeader: function () {
		return this.item.title ? this.item.title.substring(0, this.item.title.indexOf(' - ')) :
							zk.fmt.Date.formatDate(this.item.zoneBd,'HH:mm');
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
		hd.html(this.getHeader(ce));
		cnt.html(ce.content);
		
		this.calculate_(updateLastModify);
	}
},{
	TEMPLATE: {
		/* Compared to an over-day-long item, this template includes one additional header */
		main: function(id, domAttributes, header, item, zclass) {
			return `<div ${domAttributes}>
					<div id="${id}-inner" class="${zclass}-inner" style="${item.style}">
					<span id="${id}-hd" class="${zclass}-header" style="${item.headerStyle}">${header}</span>
					<span id="${id}-cnt" class="${zclass}-cnt" style="${item.contentStyle}" title="${item.content}">${item.content}</span>
					</div>
				</div>`.split('\n').map(s => s.trim()).join(''); //remove white space between lines

		}
	}
});