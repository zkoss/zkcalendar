/* Calendars.js

	Purpose:
		
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
		
		var ce = this.item,
			id = ce.id,
			p = this.params,
			headerStyle = p.headerStyle,
			contentStyle = p.contentStyle,
			style = p.style,
			resizer = p.resizer;
		this.resizerHTML = this.$class.resizerTemplate(id, resizer);
		
		out.push('<div', this.domAttrs_(), '>',
				'<div id="', id, '-body" class="', p.body, '"','>',
				'<div class="', p.inner, '"', '>',
				'<dl id="', id, '-inner"', 'style="', style, '"','>',
				'<dt id="', id, '-hd" class="', p.header, '"', 'style="', headerStyle,'"', '>', this.getItemTitle(ce), '</dt>',
				'<dd id="', id, '-cnt" class="', p.content, '"', 'style="', contentStyle,'"', '>',
				'<div class="', p.text, '">', ce.content, '</div></dd>');
		// resizer
		if (!ce.isLocked)
			out.push(this.resizerHTML);
			
		out.push('</dl>',
			'</div></div></div>');
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
	getItemTitle: function (ce) {
		var bd = ce.zoneBd,
			ed = ce.zoneEd;
		return ce.title ? ce.title : (ed - bd < (7200000 / this.parent._timeslots)) ?
				(zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + ce.content) :
				(zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + zk.fmt.Date.formatDate(ed,'HH:mm'));
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
		
		jq(this.$n('hd')).html(this.getItemTitle(ce));
		
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
	resizerTemplate: function(id, resizer) {
	return`<div class="${resizer}" id="${id}-resizer">
			  <div class="${resizer}-icon"></div>
			</div>`;
}
});