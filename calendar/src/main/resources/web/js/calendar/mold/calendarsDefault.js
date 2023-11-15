/* calendarsDefault.js

	Purpose:
		
	Description:
		
	History:
		Thu Nov  5 12:33:21 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
*/
(function (out) {
	var uuid = this.uuid,
		zcls = this.getZclass(),
		toolbar = this.firstChild,
		days = this._days,
		bdTime = this.zoneBd.getTime(),
		begin = new Date(bdTime),		
		current = new Date(),
		weekend = [-1, -1, -1],
		beginHour = this._bt,
		endHour = this._et;
	
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
		week_cnt_row		= zcls + "-week-cnt-row",
		week_day 			= zcls + "-week-day",
		week_today  		= zcls + "-week-today",
		week_day_cnt 		= week_day + "-cnt",
		week_weekend 		= zcls + "-week-weekend",

		day_header 			= zcls + "-day-header",

		day_of_week 		= zcls + "-day-of-week",
		day_of_week_inner	= day_of_week + "-inner",
		day_of_week_cnt 	= day_of_week + "-cnt",
		day_of_week_fmt 	= day_of_week + "-fmt",
		day_of_week_end   	= day_of_week + "-end",

		daylong 			= zcls + "-daylong",
		daylong_body   		= daylong + "-body",
		daylong_inner  		= daylong + "-inner",
		daylong_cnt   		= daylong + "-cnt",
		daylong_tbody  		= daylong + "-tbody",
		daylong_evt    		= daylong + "-evt",
		daylong_more   		= daylong + "-more",
		daylong_morerows	= daylong + "-morerows",
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
	out.push('<div id="', uuid, '-body" class="', body, '">',
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
		var content;
		if (captionByDate)
			content = captionByDate[j];
		else
			content = zk.fmt.Date.formatDate(begin, 'EEE ') +
				'<div class="' + day_of_week_fmt + '">' + zk.fmt.Date.formatDate(begin, this.weekFmt) + '</div>';
		
		out.push('<th class="', day_of_week, '">',
				'<div class="', day_of_week_inner);

		if (begin.getDay() == 0 || begin.getDay() == 6) {//SUNDAY or SATURDAY
			weekend[index++] = j;
			out.push(' ', week_weekend);
		}
		
		if (weekend[2] == -1 && calUtil.isTheSameDay(current, begin)) {// today
			weekend[2] = j;
			out.push(' ', week_today);
		}

		out.push('"><div class="', day_of_week_cnt, '">', content, '</div></div></th>');
		begin = calUtil.addDay(begin, 1);
	}
	out.push('<th class="',day_of_week_end,'">&nbsp;</th></tr>',

/*************** daylong ******************/
	// daylong
			'<tr class="', daylong, '">',
			'<td class="', daylong_body, '" colspan="', days, '">',
			'<div id="', uuid, '-daylong" class="', daylong_inner, '">',
			'<table class="', daylong_cnt, '" cellpadding="0" cellspacing="0">',
			'<tbody id="',uuid,'-daylong-tbody">',
			'<tr id="',uuid,'-daylong-morerows" class="', daylong_morerows, '">');
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
	
	var html = [];
	for (var i = this._timeslots/2;i--;)
		html.push('<div class="' + hour_sep + '"></div>');
	html = html.join('');		
	for (var k = beginHour; k < endHour; k++)
		out.push(html);

	// the end of hours separator
	out.push('</div></div></td></tr>',
	
/*************** column ******************/	
			'<tr id="',uuid,'-cnt-rows">');

/*************** time zone and hours column ******************/
	current.setMinutes(0);
	
	var zones = this._zones,
		zonesOffset = this._zonesOffset,
		captionByTimeOfDay = this._captionByTimeOfDay;
	for (var i = 0, j = this._zones.length; i < j; i++) {
		out.push('<td class="', tzone);
		if (!zones[i+1])
			out.push(' ', tzone_end);
		out.push('">');
		
		for (var k = beginHour; k < endHour; k++) {
			current.setHours(k);
			out.push('<div class="', hour_of_day, '">',
				captionByTimeOfDay ?
					captionByTimeOfDay[i * 24 + k] :
					zk.fmt.Date.formatDate(this.getTimeZoneTime(current, zonesOffset[i]),'HH:mm'),
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
	out.push('</div></div></div>');
})