/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DayEvent = zk.$extends(calendar.Event, {
	ONE_HOUR: 60*60*1000,

	redraw: function (out) {
		this.defineClassName_();
		
		var ce = this.event,
			id = ce.id,			
			headerStyle = this.headerStyle,
			contentStyle = this.contentStyle,
			resizer = this.resizer;
			
		this._resizerCnt = '<div class="' + resizer + '">' +
							'<div class="' + resizer + '-icon"></div></div>';
		
		out.push('<div', this.domAttrs_(), '>',
				'<div class="', this.t1, '"', headerStyle, '></div>',
				'<div class="', this.t2, '"', headerStyle, '>',
				'<div class="', this.t3, '"></div></div>',
				'<div id="', id, '-body" class="', this.body, '"', headerStyle, '>',
				'<div class="', this.inner, '"', headerStyle, '>',
				'<dl id="', id, '-inner"', contentStyle, '>',
				'<dt id="', id, '-hd" class="', this.header, '"', headerStyle, '>', this.getEvtTitle(ce), '</dt>',
				'<dd id="', id, '-cnt" class="', this.content, '"', contentStyle, '>',
				'<div class="', this.text, '">', ce.content, '</div></dd>');		
		// resizer
		if (!ce.isLocked)
			out.push(this._resizerCnt);
			
		out.push('</dl>',
			'</div></div>',
			'<div class="', this.b2, '"', headerStyle, '>',
			'<div class="', this.b3, '"></div></div>',
			'<div class="', this.b1, '"', headerStyle, '></div></div>');
	},
	
	getEvtTitle: function(ce) {
		var bd = ce.zoneBd,
			ed = ce.zoneEd;
		
		return  ce.title ? ce.title: (ed.getTime() - bd.getTime() < this.ONE_HOUR) ? 
				(zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + ce.content):
				(zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + zk.fmt.Date.formatDate(ed,'HH:mm'));	
	},
	
	update: function() {
		this.defineCss_();
		
		var ce = this.event,
			contentStyle = this.contentStyle,
			cnt = jq(this.$n('cnt'));

		this.updateHeaderStyle_(this.headerStyle);
		
		jq(this.$n('inner')).attr('style', contentStyle);
		cnt.attr('style', contentStyle);		
		cnt.children('.' + this.text).html(ce.content);
		
		jq(this.$n('hd')).html(this.getEvtTitle(ce));
		
		this._createResizer();
		
		this.calculate_();		
	},
	
	_createResizer: function() {
		var inner = this.$n('inner'),
			target = inner.lastChild,
			hasResizer = target.className == this.resizer;
		
		if (!this.event.isLocked){
			if(!hasResizer)
				jq(inner).append(this._resizerCnt);				
		} else if (hasResizer)
			jq(target).remove();
	},
	
	defineClassName_: function() {
		this.$super('defineClassName_', arguments);
		// CSS ClassName
		var zcls = this.getZclass();
		
		this.header = zcls + "-header",
		this.resizer = zcls + "-resizer",
		this.resizer_icon = this.resizer + "-icon";			
	},
	
	updateHeaderStyle_: function(headerStyle) {
		this.$super('updateHeaderStyle_', arguments);
		jq(this.$n('hd')).attr('style',headerStyle);
	}
});