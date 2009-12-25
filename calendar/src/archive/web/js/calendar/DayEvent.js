/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DayEvent = zk.$extends(zul.Widget, {		
	bind_ : function() {// after compose
		this.$supers('bind_', arguments);		
		this._calculate();	
	},
	
	unbind_ : function() {
		this.event = this._preOffset = null;		
		this.$supers('unbind_', arguments);
	},	
	
	redraw: function (out) {			
		var ce = this.event,
			id = ce.id,			
			headerColor = ce.headerColor,
			contentColor = ce.contentColor,
			headerStyle = headerColor ? ' style="background:' + headerColor + '"' : '' ,
			contentStyle = contentColor ? ' style="background:' + contentColor + '"' : '',
			bd = this.parent.getLocalTime(ce.beginDate),//fixed for display
			ed = this.parent.getLocalTime(ce.endDate),	
			title = ce.title ? ce.title: 
					(ed.getTime() - bd.getTime() < 60*60*1000) ? 
							(zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + ce.content):
							(zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + zk.fmt.Date.formatDate(ed,'HH:mm'));		
			
			this.uuid = ce.id;
		
		// CSS ClassName
		var zcls = ce.zclass,
			header = zcls + "-header",
			body = zcls + "-body",
			inner = zcls + "-inner",
			content = zcls + "-cnt",
			text = zcls + "-text",
			resizer = zcls + "-resizer",
			resizer_icon = resizer + "-icon";		
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
				'<div class="', t3, '"></div></div>',
				'<div id="', id, '-body" class="', body, '"', headerStyle, '>',
				'<div class="', inner, '"', headerStyle, '>',
				'<dl id="', id, '-inner"', contentStyle, '>',
				'<dt id="', id, '-hd" class="', header, '"', headerStyle, '>', title, '</dt>',
				'<dd id="', id, '-cnt" class="', content, '"', contentStyle, '>',
				'<div class="', text, '">', ce.content, '</div></dd>');		
		// resizer
		if (!ce.isLocked)
			out.push('<div class="', resizer, '">',
					'<div class="', resizer_icon, '"></div></div>');		
		out.push('</dl>',
			'</div></div>',
			'<div class="', b2, '"', headerStyle, '>',
			'<div class="', b3, '"></div></div>',
			'<div class="', b1, '"', headerStyle, '></div></div>');
	},
	
	getZclass: function() {
		return "z-calevent";
	},
			
	_calculate: function() {
		var parent = this.parent,
			pbd = parent.getLocalTime(parent._beginDate),
			ONE_DAY = parent.DAYTIME,
			date = parent.getLocalTime(this.event.beginDate);	
	
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);			
	
		this._preOffset = (date.getTime() - pbd) / ONE_DAY;
	},
		
	update: function() {
		var node = jq(this.$n()),
			ce = this.event,
			parent = this.parent,
			zcls = ce.zclass,
			resizer = zcls + "-resizer",			
			hd = jq(this.$n('hd')),
			body = jq(this.$n('body')),
			cnt = jq(this.$n('cnt')),
			inner = this.$n('inner'),			
			headerColor = ce.headerColor,
			contentColor = ce.contentColor,
			headerStyle = headerColor ? 'background:' + headerColor : '' ,
			contentStyle = contentColor ? 'background:' + contentColor : '',
			bd = parent.getLocalTime(ce.beginDate),
			ed = parent.getLocalTime(ce.endDate),	
			title = ce.title ? ce.title: 
					(ed.getTime() - bd.getTime() < 60*60*1000) ? 
							(zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + ce.content):
							(zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + zk.fmt.Date.formatDate(ed,'HH:mm'));	
							
		node.children('.' + zcls + "-t1").attr('style',headerStyle);
		node.children('.' + zcls + "-t2").attr('style',headerStyle);			
		body.attr('style',headerStyle);
		body.children('.' + zcls + "-inner").attr('style',headerStyle);		
		hd.attr('style',headerStyle);	
		node.children('.' + zcls + "-b1").attr('style',headerStyle);	
		node.children('.' + zcls + "-b2").attr('style',headerStyle);	
		
		jq(inner).attr('style',contentStyle);	
		cnt.attr('style',contentStyle);			
		
		cnt.children('.' + zcls + "-text").html(ce.content);
		hd.html(title);		
		
		if (!ce.isLocked){
			if(inner.lastChild.className != resizer)			
				jq(inner).append('<div class="' + resizer + '"><div class="' + resizer + '-icon"></div></div>');				
		} else if (inner.lastChild.className == resizer)
			jq(inner.lastChild).remove();					
		
		this._calculate();		
	}
});