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
	getPeriod: function (date1, date2) {
		return Math.round(this.getPeriodDoubleValue(date1, date2)); //ZKCAL-50: across DST time will return float number
	},
	getPeriodDoubleValue: function (date1, date2) {
		//adjust for begin and end are not the same in DST time
		var tzOffset1 = date1.getTimezoneOffset(),
			tzOffset2 = date2.getTimezoneOffset(),
			offset = (tzOffset1 != tzOffset2) ? (Math.abs(tzOffset1 - tzOffset2) * 60000) : 0,
			period = Math.abs(date1 - date2 - offset) / this.DAYTIME;

		return period; // ZKCAL-63: Math.round will cause _isExceedOneDay to get a wrong result
	},
	isTheSameDay: function (date1, date2) {
		return (date1.getFullYear() == date2.getFullYear() &&
				date1.getMonth() == date2.getMonth() &&
				date1.getDate() == date2.getDate());
	},
	addDay: function (date, days) {
		var result = new Date(date),
			tzOffset1 = date.getTimezoneOffset(),
			tzOffset2, offset;
		result.setDate(date.getDate() + days);
		tzOffset2 = result.getTimezoneOffset();
		offset = (tzOffset1 - tzOffset2);
		
		if (offset && (date.getHours() != result.getHours()))
			result.setMinutes(result.getMinutes() + Math.abs(offset));
		
		return new Date(result);
	},
	format: function (str, args) {
		for (var i = 0; i < args.length; i++) {
			str = str.replace(new RegExp("\\{" + i + "\\}", "gm"), args[i]);
		}
		return str;
	}
	
};