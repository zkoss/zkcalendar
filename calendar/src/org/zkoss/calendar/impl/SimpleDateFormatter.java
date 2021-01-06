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

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.IsoFields;
import java.util.Locale;

import org.zkoss.calendar.api.ZonedDateTimeFormatter;

/**
 * A simple implementation of {@link ZonedDateTimeFormatter}
 * @author jumperchen
 *
 */
public class SimpleDateFormatter implements ZonedDateTimeFormatter, Serializable {

	private static final long serialVersionUID = 20090316151208L;
	private String _dayFormat = "EEE MM/d";
	private String _weekFormat = "EEE";
	private String _timeFormat = "HH:mm";
	private String _ppFormat = "EEE, MMM/d";
	private DateTimeFormatter _df, _wf, _tf, _pf;

	public String getCaptionByDate(ZonedDateTime date, Locale locale) {
		if (_df == null) {
			_df = DateTimeFormatter.ofPattern(_dayFormat, locale);
		}
		return date.format(_df);
	}

	public String getCaptionByDateOfMonth(ZonedDateTime date, Locale locale) {
		if (date.getDayOfMonth() == 1) {
			DateTimeFormatter df = DateTimeFormatter.ofPattern("MMM d", locale);
			return df.format(date);
		}
		return Integer.toString(date.getDayOfMonth());
	}

	public String getCaptionByDayOfWeek(ZonedDateTime date, Locale locale) {
		if (_wf == null) {
			_wf = DateTimeFormatter.ofPattern(_weekFormat, locale);
		}
		return date.format(_wf);
	}

	public String getCaptionByTimeOfDay(ZonedDateTime date, Locale locale) {
		if (_tf == null) {
			_tf = DateTimeFormatter.ofPattern(_timeFormat, locale);
		}
		return date.format(_tf);
	}

	public String getCaptionByPopup(ZonedDateTime date, Locale locale) {
		if (_pf == null) {
			_pf = DateTimeFormatter.ofPattern(_ppFormat, locale);
		}
		return date.format(_pf);
	}

	public String getCaptionByWeekOfYear(ZonedDateTime date, Locale locale) {
		return String.valueOf(date.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR));
	}
}
