/* Calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
calendar.DaylongItem = zk.$extends(calendar.LongItem, {
	
	getCornerStyle_: function () {
		return '';
	},
	
	getDays: function () {
		var node = this.$n();
		return this.parent._days - node._preOffset - node._afterOffset;
	}
});