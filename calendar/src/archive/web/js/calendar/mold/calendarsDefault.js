/* calendars.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
*/
function (out) {
	this._prepareData();
	
	
	var uuid = this.uuid,
		zcls = this.getZclass(),	
		toolbar = this.firstChild,
		days = this._days,
		bdTime = this._beginDate.getTime(),
		begin = new Date(bdTime),
		current = new Date(),
		weekend = [-1, -1, -1],
		ONE_DAY = this.DAYTIME;	
	
	// round corner
	var t1 = zcls + "-t1",
		t2 = zcls + "-t2",
		t3 = zcls + "-t3",
		b1 = zcls + "-b1",
		b2 = zcls + "-b2",
		b3 = zcls + "-b3";
	
	// CSS ClassName
	var header 				= zcls + "-header",
		body   				= zcls + "-body",
		inner 				= zcls + "-inner",
	
		week 				= zcls + "-week",
		tzone 				= zcls + "-timezone",
		tzone_end 			= zcls + "-timezone-end",
		week_header 		= zcls + "-week-header",
		week_header_cnt 	= week_header + "-cnt",
		week_header_arrow 	= week_header + "-arrow",

		week_body			= zcls + "-week-body",
		week_cnt			= zcls + "-week-cnt",
		week_day 			= zcls + "-week-day",
		week_today  		= zcls + "-week-today",
		week_day_cnt 		= week_day + "-cnt",
		week_weekend 		= zcls + "-week-weekend",

		day_header 			= zcls + "-day-header",

		day_of_week 		= zcls + "-day-of-week",
		day_of_week_inner	= day_of_week + "-inner",
		day_of_week_cnt 	= day_of_week + "-cnt",
		day_of_week_end   	= day_of_week + "-end",

		daylong 			= zcls + "-daylong",
		daylong_body   		= daylong + "-body",
		daylong_inner  		= daylong + "-inner",
		daylong_cnt   		= daylong + "-cnt",
		daylong_evt    		= daylong + "-evt",
		daylong_more   		= daylong + "-more",
		daylong_end    		= daylong + "-end",

		hour 		 		= zcls + "-hour",
		hour_inner 		 	= zcls + "-hour-inner",
		hour_sep    		= hour + "-sep",
		hour_of_day 		= hour + "-of-day";
	
	
	out.push('<div', this.domAttrs_(), '>');	
	if (toolbar) {
		out.push('<div id="', uuid, '-tb" class="', header, '">');
		toolbar.redraw(out);
		out.push('</div>');
	}			
	out.push('<div class="', t1, '"></div>',
			'<div class="', t2, '">',
			'<div class="', t3, '"></div></div>',
			'<div id="', uuid, '-body" class="', body, '">',
			'<div class="', inner, '">',
			'<div id="', uuid,'-inner" class="', week,'">',
/**************************************************************************************/	
	
/*************** week header ******************/
	// week header
			'<div class="', week_header, '">',
			'<table class="', week_header, '-cnt" cellpadding="0" cellspacing="0">',
			'<tbody>',

	
/*************** day's header ******************/	
	// day's header
			'<tr id="', uuid, '-header" class="', day_header, '">');

	
/*************** zone area ******************/

	for (var i = 0, j = this._zones.length - 1; i < j ; i++) 
		out.push('<th rowspan="3" class="', tzone,'">', this._zones[i], '</th>');
	
	out.push('<th rowspan="3" class="', tzone, ' ', tzone_end, '">', this._zones[this._zones.length - 1],
			'<div id="', uuid, '-hdarrow" class="', week_header_arrow, '"></div></th>');

/*************** date title ******************/	
	var captionByDate = this._captionByDate;
	// day-of-week
	for (var index = 0 , j = 0; j < days; ++j) {
		var content = captionByDate ? captionByDate[j] : 
									zk.fmt.Date.formatDate(begin,'EEE MM/d');
		
		out.push('<th class="', day_of_week, '">',
				'<div class="', day_of_week_inner);

		if (begin.getDay() == 0 || begin.getDay() == 6) {//SUNDAY or SATURDAY
			weekend[index++] = j;
			out.push(' ', week_weekend);
		}
		
		if (weekend[2] == -1 && current.getFullYear() == begin.getFullYear() &&
				current.getDOY() == begin.getDOY()) {// today
			weekend[2] = j;
			out.push(' ', week_today);
		}

		out.push('"><span class="', day_of_week_cnt, '">', content, '</span></div></th>');
		begin.setTime(begin.getTime() + ONE_DAY);
	}
	out.push('<th class="',day_of_week_end,'">&nbsp;</th></tr>',

/*************** daylong ******************/
	// daylong
			'<tr class="', daylong, '">',
			'<td class="', daylong_body, '" colspan="', days, '">',
			'<div id="', uuid, '-daylong" class="', daylong_inner, '">',
			'<table class="', daylong_cnt, '" cellpadding="0" cellspacing="0">',
			'<tbody>',
			'<tr>');
	for (var j = 0; j < days; ++j)
		out.push('<td class="', daylong_evt, ' ', daylong_more, '">&nbsp;</td>');

	out.push('</tr></tbody></table></div></td></tr>',
			'<tr><td colspan="', days, '" class="', daylong_end, '">&nbsp;</td></tr></tbody></table></div>');
	
	
/***************  cnt  ****************************************************************************/	
	out.push('<div id="', uuid, '-cnt" class="', week_body, '">');

	if (zk.ie)
		out.push('<table cellpadding="0" cellspacing="0" style="table-layout:fixed;"><tbody><tr><td>');

	out.push('<table class="', week_cnt, '" cellpadding="0" cellspacing="0">',
			'<tbody>',
			'<tr>');
	
/*************** zone bottom separator ******************/	
	for (var i = 0; i < this._zones.length - 1; i++) 
		out.push('<td class="', tzone, '"></td>');
	
	out.push('<td class="', tzone, ' ', tzone_end, '"></td>',	

	
/*************** hours rows ******************/
			'<td colspan="', days, '">',
			'<div class="', hour, '">',
			'<div class="', hour_inner, '">');

	for (var k = 0; k < 24; k++)
		out.push('<div class="', hour_sep, '"></div>');

	// the end of hours separator
	out.push('</div></div></td></tr>',	
	
/*************** column ******************/	
			'<tr>');

/*************** time zone and hours column ******************/
	current.setMinutes(0);
	for (var i = 0, j = this._zones.length; i < j; i++) {
		out.push('<td class="', tzone);
		if (!this._zones[i+1])
			out.push(' ', tzone_end);
		out.push('">');		
		
		for (var k = 0; k < 24; k++) {
			current.setHours(k);			
			out.push('<div class="', hour_of_day, '">',
				this._captionByTimeOfDay ? 
					this._captionByTimeOfDay[i * 24 + k] : 
					zk.fmt.Date.formatDate(this.getTimeZoneTime(current,this._zonesOffset[i]),'HH:mm'),
				'</div>');
		}
		out.push("</td>");
	}	
	
/*************** day column ******************/	
	for (var j = 0; j < days; ++j) {
		out.push('<td class="', week_day);
		if (weekend[0] == j || weekend[1] == j)
			out.push(' ', week_weekend);
		if (weekend[2] == j)
			out.push(' ', week_today);
		out.push('"><div class="', week_day_cnt, '"></div></td>');		
	}

	// the end of the content of day
	out.push('</tr></tbody></table>');

	if (zk.ie)
		out.push('</td></tr></tbody></table>');

	// the end of week content
	out.push('</div></div>');
	
	
/***************************************************************************/			
	out.push('</div></div>',
			'<div class="',b2,'">',
			'<div class="',b3,'"></div></div>',
			'<div class="',b1,'"></div>',
			'<div id="',uuid,'-sdw" class="',zcls,'-fl">',
			'<div class="',zcls,'-fr">',
			'<div class="',zcls,'-fm"></div></div></div></div>');			
}