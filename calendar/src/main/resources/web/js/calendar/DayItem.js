/* Calendars.js

	Purpose:
		an item shorter than one day in default mold
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
/**
 * an item whose duration is shorter than 1 day.
 * @see calendar.Calendars._isExceedOneDay()
 */
calendar.DayItem = zk.$extends(calendar.Item, {
	redraw: function (out) {
		this.defineClassName_();

		out.push(this.$class.TEMPLATE.main(
			this.item.id,
			this.domAttrs_(),
			this.params,
			this.item.content,
			this.getHeader(),
			this.item.isLocked));
	},
	bind_: function (e) {
		this.$supers('bind_', arguments);
		var ce = this.item;
		if (ce && !ce.isLocked) {
			var wgt = this;
			jq(this.$n('resizer')).mousedown(function () {
				if (wgt.parent) {
					wgt.parent._resizing = wgt;
				}
			}).mouseup(function () {
				if (wgt.parent) wgt.parent._resizing = null;
			});
		}
	},
	unbind_: function () {
		var ce = this.item;
		if (ce && !ce.isLocked) {
			var wgt = this;
			jq(this.$n('resizer')).unbind('mousedown');
			jq(this.$n('resizer')).unbind('mouseup');
			if (this.parent) {
				this.parent._resizing = null;
			}
		}
		this.$supers('unbind_', arguments);
	},
	/**
	 * @param {Object} item - The calendar item object
	 * @returns {*|string} The formatted title string showing either the custom title or time range with content
	 */
	getHeader: function () {
		var beginDate = this.item.zoneBd,
			endDate = this.item.zoneEd;
		let timeText = (endDate - beginDate < (7200000 / this.parent._timeslots)) ?
			this.format(beginDate) :
			this.format(beginDate) + ' - ' + this.format(endDate);
		return `${this.item.title} ${timeText}`;
	},
	
	update: function (updateLastModify) {
		this.clearCache();
		this.defineCss_();
		
		var ce = this.item,
			p = this.params,
			style = p.style;
			contentStyle = p.contentStyle,
			cnt = jq(this.$n('cnt'));

		this.updateHeaderStyle_(p.headerStyle);
		
		jq(this.$n('inner')).attr('style', style);
		cnt.attr('style', contentStyle);
		cnt.children('.' + p.text).html(ce.content);
		
		jq(this.$n('hd')).html(this.getHeader());
		
		this._createResizer();
		
		this.calculate_(updateLastModify);
	},
	
	_createResizer: function () {
		var inner = this.$n('inner'),
			target = inner.lastChild,
			p = this.params,
			hasResizer = target.className == p.resizer;
		
		if (!this.item.isLocked) {
			if (!hasResizer)
				jq(inner).append(this.resizerHTML);
		} else if (hasResizer)
			jq(target).remove();
	},
	
	defineClassName_: function () {
		this.$super('defineClassName_', arguments);
		// CSS ClassName
		var zcls = this.getZclass(),
			p = this.params;
		
		p.header = zcls + '-header',
		p.resizer = zcls + '-resizer',
		p.resizer_icon = p.resizer + '-icon';
	},
	
	updateHeaderStyle_: function (headerStyle) {
		this.$super('updateHeaderStyle_', arguments);
		jq(this.$n('hd')).attr('style', headerStyle);
	}
},{
	TEMPLATE: {
		main: function(id, domAttrs, p, content, title, isLocked) {
			return 	`<div ${domAttrs}>` +
						`<div id="${id}-body" class="${p.body}">` +
							`<div class="${p.inner}">` +
								`<dl id="${id}-inner" style="${p.style}">` +
									`<dt id="${id}-hd" class="${p.header}" style="${p.headerStyle}">${title}</dt>` +
									`<dd id="${id}-cnt" class="${p.content}" style="${p.contentStyle}">` +
										`<div class="${p.text}">${content}</div>` +
									`</dd>` +
									`${!isLocked ? this.resizer(id, p.resizer) : ''}` +
								`</dl>` +
							`</div>` +
						`</div>` +
					`</div>`;
		},
		resizer: function(id, resizer) {
			return`<div class="${resizer}" id="${id}-resizer">` +
					  `<div class="${resizer}-icon"></div>` +
					`</div>`;
	}
}
});