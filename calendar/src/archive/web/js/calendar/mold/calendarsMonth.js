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
	this.prepareData_();
	
	var uuid = this.uuid,
		zcls = this.getZclass(),
		toolbar = this.firstChild,
		bdTime = this.zoneBd.getTime(),
		current = new Date(),
		weekend = [-1, -1];
	
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
		month 				= zcls + "-month-cnt",
		monthInner 			= month + "-inner",

		month_header 		= zcls + "-month-header",
		month_body 			= zcls + "-month-body",
		month_week 			= zcls + "-month-week",

		month_date 			= zcls + "-month-date",
		month_date_off		= zcls + "-month-date-off",
		month_date_cnt 		= month_date + "-cnt",
		
		week_weekend 		= zcls + "-week-weekend",
		week_today  		= zcls + "-week-today",

		day_of_week 		= zcls + "-day-of-week",
		day_of_month_bg 	= zcls + "-day-of-month-bg",
		day_of_month_body 	= zcls + "-day-of-month-body",
		week_of_year		= zcls + "-week-of-year",
		week_of_year_text	= zcls + "-week-of-year-text";
	
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
/***************************************************************************/
			'<div id="', uuid, '-inner" class="', month, '">',
			'<div class="', monthInner, '">',

	// title
			'<table class="', month_header, '" cellpadding="0" cellspacing="0"><tbody><tr>');

	// day-of-week
	var bd = new Date(bdTime),
		captionByDayOfWeek = this._captionByDayOfWeek;
	for (var index = 0, k = 0; k < 7; ++k) {
		var content = captionByDayOfWeek ? captionByDayOfWeek[k] :
			zk.fmt.Date.formatDate(bd,'EEE');
		
		out.push('<th class="', day_of_week);

		if (bd.getDay() == 0 || bd.getDay() == 6) {//SUNDAY or SATURDAY		
			weekend[index++] = k;
			out.push(' ', week_weekend);
		}
		out.push('">', content, '</th>');
		bd.setDate(bd.getDate() + 1);
	}
	out.push('</tr></tbody></table>');
	
	// calculate how many weeks we should display
	var weeks = this.weekOfMonth,
		number = 100 / weeks,
		captionByWeekOfYear = this._captionByWeekOfYear;
	if (this.woy) {//weekOfYear
		var woy = zk.parseInt(this.woy);
		bd.setTime(bdTime);
		out.push('<div id="', uuid, '-woy" class="', week_of_year, '">');
		for (var j = 0; j < weeks; j++) {
			bd.setMilliseconds(0);
			var content = captionByWeekOfYear ? captionByWeekOfYear[j] : woy,
				year = bd.getFullYear();
			out.push('<div class="', month_week,
					'" style="top:', (number * j),
					'%; height:', number, '%;"><span class="',
					week_of_year_text, '">', content, '</span></div>');
			bd.setDate(bd.getDate() + 7);
			if (year != bd.getFullYear())
				woy = 1;
			else woy++;
		}
		out.push('</div>');
	}
	
	//events content
	out.push('<div id="',uuid,'-cnt" class="',month_body,'">');
	
	// reset date
	bd.setTime(bdTime);
	
	// current date
	var curMonth = current.getMonth(),
		captionByDateOfMonth = this._captionByDateOfMonth;

	for (var j = 0; j < weeks; j++) {
		out.push('<div class="', month_week, '" style="top:',
				(number * j), '%; height:', number, '%;">',
				'<table class="', day_of_month_bg,
				'" cellpadding="0" cellspacing="0"><tbody><tr>');

		var tempBd = new Date(bd);
		for (var i = 0; i < 7; i++) {
			out.push('<td class="');

			if (weekend[0] == i || weekend[1] == i)
				out.push(' ', week_weekend);
		
			if (this.isTheSameDay_(current, tempBd))
				out.push(' ', week_today);

			out.push('">&nbsp;</td>');
			tempBd.setDate(tempBd.getDate() + 1);
		}

		out.push('</tr></tbody></table>',
				'<table class="', day_of_month_body, '" cellpadding="0" cellspacing="0">',
				'<tbody><tr>');
		
		// the title of day of week
		for (var i = 0; i < 7; i++) {
			var content = captionByDateOfMonth? captionByDateOfMonth[j * 7 + i]:
												bd.getDate();
			out.push('<td class="', month_date);

			if (weekend[0] == i || weekend[1] == i)
				out.push(' ', week_weekend);

			if (this.isTheSameDay_(current, bd))//today
				out.push(' ', week_today);
		

			if (curMonth != bd.getMonth())
				out.push(' ', month_date_off);			
			
			if(bd.getDate() == 1 && !captionByDateOfMonth)
				content = zk.fmt.Date.formatDate(bd,'MMM d');
			out.push('"><span class="', month_date_cnt, '">', content, '</span></td>');

			bd.setDate(bd.getDate() + 1);
		}
		out.push('</tr></tbody></table></div>');
	}
	out.push('</div></div></div>',
/***************************************************************************/
			'</div></div>',
			'<div class="',b2,'">',
			'<div class="',b3,'"></div></div>',
			'<div class="',b1,'"></div>',
			'<div id="',uuid,'-sdw" class="',zcls,'-fl">',
			'<div class="',zcls,'-fr">',
			'<div class="',zcls,'-fm"></div></div></div></div>');	
}