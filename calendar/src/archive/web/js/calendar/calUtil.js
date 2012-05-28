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
	getPeriod: function(date1, date2) {
		//adjust for begin and end are not the same in DST time
		var tzOffset1 = date1.getTimezoneOffset(),
			tzOffset2 = date2.getTimezoneOffset(),
			offset = (tzOffset1 != tzOffset2) ? ((tzOffset1 - tzOffset2) * 60000): 0;
		
		return Math.abs(date1 - date2 - offset) / this.DAYTIME;	
	},
	isTheSameDay: function(date1, date2) {
		return (date1.getFullYear() == date2.getFullYear() && 
				date1.getMonth() == date2.getMonth() && 
				date1.getDate() == date2.getDate());
	},
	addDay: function(date, days) {
		var resoult = new Date(date),
			tzOffset1 = date.getTimezoneOffset(),
			tzOffset2, offset;
		resoult.setDate(date.getDate() + days);
		tzOffset2 = resoult.getTimezoneOffset();
		offset = (tzOffset1 - tzOffset2);
		
		if (offset && (date.getHours() != resoult.getHours()))
			resoult.setMinutes(resoult.getMinutes() + Math.abs(offset));
		
		return new Date(resoult);
	},
    format: function(str, args){
        for (var i = 0; i < args.length; i++) {
            str = str.replace(new RegExp("\\{" + i + "\\}", "gm"), args[i]);
        }
        return str;
    }
	
};