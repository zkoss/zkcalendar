/* DaylongOfMonthItem.js

	Purpose:
		an item over one day in month mold
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DaylongOfMonthItem = zk.$extends(calendar.LongItem, {
	
	$init: function () {
		this.$supers('$init', arguments);
		this.cloneNodes = [];
	},
	getCornerStyle_: function () {
		return this.params.contentStyle;
	},
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);
		return scls + ' ' + this.getZclass() + '-daylong-month';
	},
	getDays: function () {
		var node = this.$n();
			
		if (this.cloneCount)
			return 7 - node._preOffset;

		return 7 - node._preOffset - node._afterOffset;
	},
	
	processCloneNode_: function (node) {
		var parent = this.parent,
			weekDates = parent._weekDates,
			ed = node.lowerBoundEd,
			startWeek = node.startWeek,
			cloneCount;
		//calculate over next week
		if (ed > startWeek.zoneEd)
			cloneCount = Math.ceil(calUtil.getPeriod(ed, startWeek.zoneEd) / 7);
		this._processCloneNode(weekDates, cloneCount);
		
		node.zoneEd = cloneCount ? startWeek.zoneEd : this.item.zoneEd;
	},
			
	_createCloneNode: function (index) {
		var uuid = this.uuid,
			item = this.item,
			cloneNode = this.$n().cloneNode(true),
			body = jq(cloneNode).children('#' + this.uuid + '-body')[0],
			cnt = body.firstChild.firstChild;
			
		//change id
		cloneNode.id = uuid + '-sub' + index;
		body.id = uuid + '-sub' + index + '-body';
		cnt.id = uuid + '-sub' + index + '-cnt';
		
		cloneNode.cnt = cnt;
		cloneNode.body = body;
		cloneNode._preOffset = 0;
		cloneNode._afterOffset = 0;
		cloneNode.zoneBd = item.zoneBd;
		cloneNode.zoneEd = item.zoneEd;
		cloneNode._days = 7;
		
		return cloneNode;
	},
		
	_processCloneNode: function (weekDates, cloneCount) {
		this.cloneNodes = [];
		this.cloneCount = cloneCount;
		if (!cloneCount) return;
			
		var node = this.$n(),
			body = jq(this.$n('body')),
			startWeekIndex = weekDates.indexOf(node.startWeek) + 1,
			p = this.params,
			left_arrow = p.left_arrow,
			hasLeftArrow = body.hasClass(left_arrow);
			left_arrowCnt = p.left_arrowCnt;
		
		//add right arrow if over next week
		body.addClass(p.right_arrow);
		
		//clone node
		for (var i = 0, j = cloneCount; i < j; i++) {
			var cloneNode = this._createCloneNode(i),
				cloneBody = jq(cloneNode.body),
				startWeek = weekDates[startWeekIndex + i];

			cloneNode.startWeek = startWeek;
			cloneNode.upperBoundBd = startWeek.zoneBd;
			cloneNode.lowerBoundEd = startWeek.zoneEd;
			
			// always has left arrow because clone node always over previous week
			if (!hasLeftArrow) {
				cloneBody.addClass(left_arrow);
			}
			this.cloneNodes.push(cloneNode);
		}
		
		this._processLastCloneNode(cloneCount);
		
	},
	
	_processLastCloneNode: function (cloneCount) {
		var cloneNode = this.cloneNodes[cloneCount - 1],
			cloneBody = jq(cloneNode.body),
			lowerBoundEd = this.$n().lowerBoundEd,
			p = this.params,
			isAfter = this.item.zoneEd > this.parent.zoneEd;
					
		cloneNode.lowerBoundEd = lowerBoundEd;
		cloneNode._afterOffset = calUtil.getPeriod(cloneNode.startWeek.zoneEd, lowerBoundEd);
		cloneNode._days = 7 - cloneNode._afterOffset;
		
		if (!isAfter) {
			cloneBody.removeClass(p.right_arrow);
		}
	},
	
	defineClassName_: function () {
		this.$super('defineClassName_', arguments);
		var innerStyle = this.item.innertStyle;
		this.params.innerStyle = innerStyle;
	},
	
	defineCss_: function () {
		this.$super('defineCss_', arguments);
		var innerStyle = this.item.style;
		this.params.innerStyle = innerStyle;
	},
	
	updateContentStyle_: function (contentStyle) {
		// do nothing after ZKCAL-76, t2/b2 was removed
	}
});