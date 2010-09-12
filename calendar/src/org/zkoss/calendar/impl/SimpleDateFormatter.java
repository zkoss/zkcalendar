/* SimpleDateFormatHandler.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mar 16, 2009 3:12:08 PM , Created by jumperchen
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.calendar.impl;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import org.zkoss.calendar.api.DateFormatter;
import org.zkoss.util.Locales;
import org.zkoss.util.TimeZones;

/**
 * A simple implementation of {@link DateFormatter}
 * @author jumperchen
 *
 */
public class SimpleDateFormatter implements DateFormatter {

	private String _dayFormat = "EEE MM/d";
	private String _weekFormat = "EEE";
	private String _timeFormat = "HH:mm";
	private String _ppFormat = "EEE, MMM/d";
	private SimpleDateFormat _df, _wf, _tf, _pf;
	
	public String getCaptionByDate(Date date, Locale locale, TimeZone timezone) {
		if (_df == null) {
			_df = new SimpleDateFormat(_dayFormat, locale);
		}
		_df.setTimeZone(timezone);
		return _df.format(date);
	}
	
	public String getCaptionByDateOfMonth(Date date, Locale locale, TimeZone timezone) {
		Calendar cal = Calendar.getInstance(timezone, locale);
		cal.setTime(date);
		if (cal.get(Calendar.DAY_OF_MONTH) == 1) {
			SimpleDateFormat sd = new SimpleDateFormat("MMM d", locale);
			sd.setTimeZone(timezone);
			return sd.format(date);
		}
		return Integer.toString(cal.get(Calendar.DAY_OF_MONTH));
	}

	public String getCaptionByDayOfWeek(Date date, Locale locale, TimeZone timezone) {
		if (_wf == null) {
			_wf = new SimpleDateFormat(_weekFormat, locale);
		}
		_wf.setTimeZone(timezone);
		return _wf.format(date);
	}

	public String getCaptionByTimeOfDay(Date date, Locale locale, TimeZone timezone) {
		if (_tf == null) {
			_tf = new SimpleDateFormat(_timeFormat, locale);
		}
		_tf.setTimeZone(timezone);
		return _tf.format(date);
	}
	public String getCaptionByPopup(Date date, Locale locale, TimeZone timezone) {
		if (_pf == null) {
			_pf = new SimpleDateFormat(_ppFormat, locale);
		}
		_pf.setTimeZone(timezone);
		return _pf.format(date);
	}
	public String getCaptionByWeekOfYear(Date date, Locale locale,
			TimeZone timezone) {
		Calendar cal = Calendar.getInstance(timezone, locale);
		cal.setTime(date);
		return String.valueOf(cal.get(Calendar.WEEK_OF_YEAR));
	}

}
