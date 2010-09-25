/* calUtils.js

	Purpose:
		
	Description:
		
	History:
		Sun Apr 18 11:36:43 2010, Created by jimmyshiau

Copyright (C) 2010 Potix Corporation. All Rights Reserved.

This program is distributed under LGPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
*/
calUtil = {
	DAYTIME: 86400000,
	AWEEK: 604800000,
	isZeroTime: function(date) {
		return (date.getHours() + date.getMinutes() + 
			date.getSeconds() + date.getMilliseconds() == 0);
	},
	isTheSameDay: function(date1, date2) {
		return (date1.getFullYear() == date2.getFullYear() && 
				date1.getMonth() == date2.getMonth() && 
				date1.getDate() == date2.getDate());
	},
	getDur: function(ce) {
		var bd = new Date(ce.zoneBd),
			ed = new Date(ce.zoneEd);
			
		if (this.isZeroTime(ed))
			ed = new Date(ed.getTime() - 1000);
		
		bd.setHours(0,0,0,0);
		ed.setHours(23,59,59,0);

		return Math.ceil((ed - bd)/ this.DAYTIME);
	}
	
	
};