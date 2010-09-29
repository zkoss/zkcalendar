/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.Event = zk.$extends(zk.Widget, {
	bind_ : function() {
		this.$supers('bind_', arguments);
		this.calculate_();
	},
	
	unbind_: function() {
		var node = this.$n();
		
		node.zoneBd = node.zoneEd = node._preOffset = node._afterOffset = 
		node._days = this.event = null;	
		this.$supers('unbind_', arguments);
	},
	
	defineClassName_: function() {
		var zcls = this.getZclass(),
			ce = this.event,
			headerColor = ce.headerColor,
			contentColor = ce.contentColor;
		
		this.params = {			
			// round corner
			t1: zcls + "-t1",
			t2: zcls + "-t2",
			t3: zcls + "-t3",
			b1: zcls + "-b1",
			b2: zcls + "-b2",
			b3: zcls + "-b3",
			// CSS ClassName
			body: zcls + "-body",
			inner: zcls + "-inner",
			content: zcls + "-cnt",
			text: zcls + "-text",
			headerStyle: headerColor ? ' style="background:' + headerColor + '"': '',
			contentStyle: contentColor ? ' style="background:' + contentColor + '"': ''			
		};
		this.uuid = ce.id;
	},
	
	defineCss_: function() {	
		var ce = this.event,
			headerColor = ce.headerColor,
			contentColor = ce.contentColor,
			p = this.params;
		p.headerStyle = headerColor ? 'background:' + headerColor: '';
		p.contentStyle = contentColor ? 'background:' + contentColor: '';
	},
	
	updateHeaderStyle_: function(headerStyle) {
		var node = jq(this.$n()),
			body = jq(this.$n('body')),
			p = this.params;
		node.children('.' + p.t1).attr('style', headerStyle);
		node.children('.' + p.t2).attr('style', headerStyle);
		node.children('.' + p.b1).attr('style', headerStyle);
		node.children('.' + p.b2).attr('style', headerStyle);
		body.attr('style',headerStyle);
		body.children('.' + p.inner).attr('style', this.getInnerStyle_());
	},
		
	getZclass: function() {
		var zcls = this.event.zclass;
		return zcls ? zcls: "z-calevent";
	},
	
	getInnerStyle_: function() {
		return this.params.headerStyle;
	},
	
	calculate_: function() {
		var node = this.$n(),
			event = this.event,
			parent = this.parent,
			bd = event.zoneBd,
			ed = event.zoneEd,
			inMon = parent.mon;
		
		if (inMon)
			node.startWeek = event.startWeek;
		
		var time = inMon ? node.startWeek: parent;		

		node.zoneBd = bd;
		node.zoneEd = ed;
		
		this._createBoundTime(node, bd, ed);		
		
		//_afterOffset could be calculated using bound time after processing clone node
		if (this.processCloneNode_)
			this.processCloneNode_(node);
		
		node._preOffset = event._preOffset;
		
		if (this._isDayEvent()) return;
		
		node._afterOffset = this.cloneCount ? 0:
								this._getOffset({start: node.lowerBoundEd, end: time.zoneEd});
		
		node._days = event._days = this.getDays();
	},

	_createBoundTime: function(node, bd, ed) {
		//have findBoundTime_ function
		if (this.findBoundTime_) {
			var time = this.findBoundTime_(bd, ed);
			bd = time.bd;
			ed = time.ed;
		}
		node.upperBoundBd = this._setBoundDate(bd);
		if (this._isDayEvent()) return;
		node.lowerBoundEd = this._setBoundDate(ed, true);
	},
	
	_isDayEvent: function() {
//		zk.log(this.$instanceof(calendarDayEvent));		
		if (!this._isDayEvt)
			this._isDayEvt = this.className == 'calendar.DayEvent';
		return this._isDayEvt;	
	},
	
	_getOffset: function(time) {
		return calUtil.getPeriod(time.end, time.start);
	},
		
	_setBoundDate: function(date, isAddOneDay) {
		var result = new Date(date);
		if (date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() != 0) {
			if (isAddOneDay) 
				result.setDate(date.getDate() + 1);
			result.setHours(0,0,0,0);
		}
		return result;
	}
});