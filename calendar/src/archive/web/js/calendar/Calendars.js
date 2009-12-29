/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.Calendars = zk.$extends(zul.Widget, {	
	DAYTIME: 24*60*60*1000, 
	ppTemplate: ['<div id="%1-pp" class="%2" style="position:absolute; top:0;left:0;"><div class="%2-t1"></div><div class="%2-t2"><div class="%2-t3"></div></div>',
			  '<div class="%2-body"><div class="%2-inner">',
			  '<div class="%2-header"><div id="%1-ppc" class="%2-close"></div><div id="%1-pphd" class="%2-header-cnt"></div></div>',
			  '<div class="%2-cnt"><div class="%2-evts"><table id="%1-ppcnt" class="%2-evt-cnt" cellpadding="0" cellspacing="0"><tbody></tbody></table></div></div>',
			  '</div></div>',
			  '<div class="%2-b2"><div class="%2-b3"></div></div><div class="%2-b1"></div></div>'].join(''),

	evtTemplate: ['<div id="%1" class="%2 %3-more-faker"><div class="%2-t1" %5></div><div class="%2-t2" %5><div class="%2-t3" %9></div></div>',
			  '<div class="%2-body" %5><div class="%2-inner" %8>',
			  '<div class="%2-cnt %3-arrow" %6><div class="%3-arrow-icon" %7></div><div class="%2-text">%4</div></div>',
			  '</div></div>',
			  '<div class="%2-b2" %5><div class="%2-b3" %9></div></div><div class="%2-b1" %5></div></div>'].join(''),
	ddTemplate: ['<div id="%1" class="%2" style="left:0px;width:100%;" ><div class="%2-t1"></div><div class="%2-t2"><div class="%2-t3"></div></div>',
			  '<div class="%2-body" id="%1-body"><div class="%2-inner"><dl id="%1-inner"><dt class="%2-header"></dt><dd class="%2-cnt"></dd></dl></div></div>',
			  '<div class="%2-b2"><div class="%2-b3"></div></div><div class="%2-b1"/></div>'].join(''),	
	
	
	$define : {
		cd: function(){
			this._currentDate = new Date(this._cd);			
			this._updateDateRange();			
		},
		firstDayOfWeek: function(){
			this._updateDateRange();
		},
		cleardd: function(){
			if(this._cleardd)
				this.clearGhost();
		}
	},


	bind_ : function() {// after compose
		this.$supers('bind_', arguments);
		zWatch.listen({onSize: this, onShow: this});
	},
	
	unbind_ : function() {
		this.clearGhost();
		// just in case
		this.closeFloats();
		zWatch.unlisten({onSize: this, onShow: this});
		this.$supers('unbind_', arguments);
	},
	
	getZclass: function() {
		var zcls = this._zclass;
		return zcls ? zcls : "z-calendars";
	},	
	
	_isExceedOneDay: function(bd,ed) {  	
		if (bd < this._beginDate || bd.getFullYear() != ed.getFullYear() ||
			(bd.getDOY() != ed.getDOY() && (ed.getHours() != 0 ||ed.getMinutes() != 0)) ||
			(ed.getTime() - bd.getTime() >= this.DAYTIME && ed.getTime() - this._beginDate.getTime() >= this.DAYTIME))
	 		return true;
	},
	
	_drawEvent: function(preOffset, className, tr, dayNode){
		var html = [],
			s = '<td class="' + className + '">&nbsp;</td>';
		for (var n = preOffset; n--;) 
			html.push(s);
		
		html.push('<td class="' + className + '" colspan="' + dayNode._days + '"></td>');		
		tr.append(html.join(''));			
		jq(tr[0].lastChild).append(dayNode);
	},	
	
	_putInDaylongSpace: function(list,node){
		var bd = node.upperBoundBd,
			ed = node.lowerBoundEd,
			rowSpace,
			findSpace;
		//find space from first row
		for (var k = 0, l = list.length; k < l; k++) {
			rowSpace = list[k];
			// compare with all daylong event in row and find space
			for (var m = 0, n = rowSpace.length; m < n; m++) {
				findSpace = false;
				var evt = rowSpace[m],
					preBd = evt.upperBoundBd,
					preEd = evt.lowerBoundEd;
					
				if (bd >= preEd || ed <= preBd)
					findSpace = true;
			}
			if (findSpace) break;
		}		
			
		//not row space
		if (findSpace)			
			rowSpace.push(node);		
		else list.push([node]);
	},
	
	fixTimeZoneFromServer: function (date, tzOffset) {
		return new Date(date.getTime() + (date.getTimezoneOffset() + tzOffset) * 60000);
	},
	
	getTimeZoneTime: function (date, tzOffset) {
		return new Date(date.getTime() + (tzOffset - this._zonesOffset[0])  * 60000);
	},
	
	getLocalTime: function (date) {			
		return new Date(date.getTime() + (date.getTimezoneOffset() + this._zonesOffset[0])  * 60000);
	},
	
	_fixRope: function (infos, n, cols, rows, offs, dim, dur) {
		if (!n || !offs || !dim) return;

		n.style.top = jq.px(dim.hs[rows] * rows + offs.t);
		n.style.left = jq.px(infos[cols].l + offs.l);
		n.style.height = jq.px(dim.hs[rows]);

		if (!dur)
			n.style.width = jq.px(dim.w);
		else {
			var i =	offs.s - cols;
			if (dur < i)
				i = dur;

			var w = 0;
			for (var len = 0; len < i; len++)
				w += infos[cols + len].w;

			n.style.width = jq.px(w);
			dur -= i;

			if (dur && ++rows < dim.hs.length)
				this._fixRope(infos, n.nextSibling, 0, rows, offs, dim, dur);
			else
				for (var e = n.nextSibling; e; e = e.nextSibling)
					e.style.cssText = "";
		}
	},
	
	clearGhost: function () {	
		if (this.$n()) {
			if (this._ghost[this.uuid])
				this._ghost[this.uuid]();
		} else {
			for (var f in this._ghost)
				this._ghost[f]();				
		}
	},

	closeFloats: function () {
		if (this._pp) {
			jq(document.body).unbind("click", this.unMoreClick);
			jq(this._pp).remove();
			this._pp = null;
		}		
	},
	
	onPopupClick: function (evt) {	
		var childWidget = zk.Widget.$(evt.target);
		if (childWidget) {
			this.fire("onEventEdit",{data:[childWidget.uuid,evt.pageX,evt.pageY,jq.innerWidth(),jq.innerHeight()]});
			evt.stop();
		}
	},
	
	isLegalChild: function (n) {
		if (!n.id.endsWith("-body"))
			return n;
	}

},{	
	_drawdrag: function (dg, p, evt) {
		var node = dg.node;
		if (node.id.endsWith('-dd')) {
			var w = node.offsetWidth,
				h = node.offsetHeight,
				x = evt.pageX - (w/2),
				y = evt.pageY - h,
				x1 = dg._zoffs.l,
				y1 = dg._zoffs.t,
				w1 = dg._zoffs.w,
				h1 = dg._zoffs.h;
			if (x < x1)
				x = x1;
			else if (x + w > x1 + w1)
				x = x1 + w1 - w;

			if (y < y1)
				y = y1;
			else if (y + h > y1 + h1)
				y = y1 + h1 - h;
			node.style.left = jq.px(x);
			node.style.top = jq.px(y);
		}
	},
	
	_changedrag: function(dg, p, evt) {		
		var widget = dg.control,
			x = p[0],
			y = p[1],
			x1 = dg._zoffs.l,
			y1 = dg._zoffs.t,
			w1 = dg._zoffs.w,
			h1 = dg._zoffs.h;
		if (x < x1)
			x = x1;
		else if (x > x1 + w1)
			x = x1 + w1;

		if (y < y1)
			y = y1;
		else if (y > y1 + h1)
			y = y1 + h1;

		x -= x1;
		y -= y1;

	 	var cols = Math.floor(x/dg._zdim.w),
			rows = Math.floor(y/dg._zdim.h),
			dur = dg._zdur,
			size = dg._zrope.childNodes.length;

		if (rows == size)
			--rows
		if (cols == dg._zoffs.s)
			cols = dg._zoffs.s - 1;

		if (!dg._zevt) {
		 	var c = dg._zpos[0],
				r = dg._zpos[1],
				b = dg._zoffs.s * r + c,
				e = dg._zoffs.s * rows + cols;

			dur = (b < e ? e - b: b - e) + 1;
			cols = b < e ? c : cols;
			rows = b < e ? r : rows;

		 } else {
		 	var total = dg._zoffs.s * size,
				count = dg._zoffs.s * rows + cols + dur;

			if (total < count)
				dur = total - (dg._zoffs.s * rows + cols);
		 }
		 if (!dg._zpos1 || dg._zpos1[2] != dur || dg._zpos1[0] != cols || dg._zpos1[1] != rows) {
		 	dg._zpos1 = [cols, rows, dur];
		 	widget._fixRope(dg._zinfo, dg._zrope.firstChild, cols, rows, dg._zoffs, dg._zdim, dur);
		 }
	}
});
