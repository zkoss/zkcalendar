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
	redraw: function (out) {
		this.defineClassName_();
		
		var ce = this.event,
			id = ce.id,
			p = this.params,	
			headerStyle = p.headerStyle,
			contentStyle = p.contentStyle,
			resizer = p.resizer;
		p._resizerCnt = '<div class="' + resizer + '" id="' + id + '-resizer"> ' +
							'<div class="' + resizer + '-icon"></div></div>';
		
		out.push('<div', this.domAttrs_(), '>',
				'<div class="', p.t1, '"', headerStyle, '></div>',
				'<div class="', p.t2, '"', headerStyle, '>',
				'<div class="', p.t3, '"></div></div>',
				'<div id="', id, '-body" class="', p.body, '"', headerStyle, '>',
				'<div class="', p.inner, '"', headerStyle, '>',
				'<dl id="', id, '-inner"', contentStyle, '>',
				'<dt id="', id, '-hd" class="', p.header, '"', headerStyle, '>', this.getEvtTitle(ce), '</dt>',
				'<dd id="', id, '-cnt" class="', p.content, '"', contentStyle, '>',
				'<div class="', p.text, '">', ce.content, '</div></dd>');		
		// resizer
		if (!ce.isLocked)
			out.push(p._resizerCnt);
			
		out.push('</dl>',
			'</div></div>',
			'<div class="', p.b2, '"', headerStyle, '>',
			'<div class="', p.b3, '"></div></div>',
			'<div class="', p.b1, '"', headerStyle, '></div></div>');
	},
	bind_: function (e){
		this.$supers('bind_', arguments);
		var ce = this.event;
		if (ce && !ce.isLocked){
			var wgt = this;
			jq(this.$n("resizer")).mousedown(function(){
				if(wgt.parent){
					wgt.parent._resizing = wgt;
				}
			}).mouseup(function(){
				wgt.parent._resizing = null;
			});
		}
	},
	unbind_ : function() {
		var ce = this.event;
		if (ce && !ce.isLocked){
			var wgt = this;
			jq(this.$n("resizer")).unbind("mousedown");
			jq(this.$n("resizer")).unbind("mouseup");
			if(this.parent){
				this.parent._resizing = null;
			}
		}
		this.$supers('unbind_', arguments);
	},
	getEvtTitle: function(ce) {
		var bd = ce.zoneBd,
			ed = ce.zoneEd;
		return  ce.title ? ce.title: (ed - bd < (7200000/this.parent._timeslots)) ? 
				(zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + ce.content):
				(zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + zk.fmt.Date.formatDate(ed,'HH:mm'));	
	},
	
	update: function() {
		this.clearCache();
		this.defineCss_();
		
		var ce = this.event,
			p = this.params,
			contentStyle = p.contentStyle,
			cnt = jq(this.$n('cnt'));

		this.updateHeaderStyle_(p.headerStyle);
		
		jq(this.$n('inner')).attr('style', contentStyle);
		cnt.attr('style', contentStyle);		
		cnt.children('.' + p.text).html(ce.content);
		
		jq(this.$n('hd')).html(this.getEvtTitle(ce));
		
		this._createResizer();
		
		this.calculate_();		
	},
	
	_createResizer: function() {
		var inner = this.$n('inner'),
			target = inner.lastChild,
			p = this.params,
			hasResizer = target.className == p.resizer;
		
		if (!this.event.isLocked){
			if(!hasResizer)
				jq(inner).append(p._resizerCnt);				
		} else if (hasResizer)
			jq(target).remove();
	},
	
	defineClassName_: function() {
		this.$super('defineClassName_', arguments);
		// CSS ClassName
		var zcls = this.getZclass(),
			p = this.params;
		
		p.header = zcls + "-header",
		p.resizer = zcls + "-resizer",
		p.resizer_icon = p.resizer + "-icon";			
	},
	
	updateHeaderStyle_: function(headerStyle) {
		this.$super('updateHeaderStyle_', arguments);
		jq(this.$n('hd')).attr('style',headerStyle);
	}
});