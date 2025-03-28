/* Cal73DateFormatter.java

		Purpose:
		
		Description:
		
		History:
				Wed Jan 06 14:59:55 CST 2021, Created by leon

Copyright (C) 2021 Potix Corporation. All Rights Reserved.
*/
package test;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.IsoFields;
import java.util.Locale;

import org.zkoss.calendar.api.ZonedDateTimeFormatter;

public class Cal73DateFormatter implements ZonedDateTimeFormatter {
	private String _dayFormat = "EEE MM-d";
	private String _weekFormat = "EEE";
	private String _timeFormat = "HH-mm";
	private String _ppFormat = "EEE, MMM-d";
	private DateTimeFormatter _df, _wf, _tf, _pf;

	public String getCaptionByDate(ZonedDateTime date, Locale locale) {
		if (_df == null) {
			_df = DateTimeFormatter.ofPattern(_dayFormat, locale);
		}
		return date.format(_df);
	}

	@Override
	public String getCaptionByDateOfMonth(ZonedDateTime date, Locale locale) {
		if (date.getDayOfMonth() == 1) {
			DateTimeFormatter df = DateTimeFormatter.ofPattern("MMM-d", locale);
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
