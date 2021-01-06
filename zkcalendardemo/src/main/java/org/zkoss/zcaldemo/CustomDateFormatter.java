package org.zkoss.zcaldemo;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import org.zkoss.calendar.api.LegacyDateFormatter;

public class CustomDateFormatter implements LegacyDateFormatter {

	private SimpleDateFormat _datefmt, _weekfmt, _timefmt, _popupfmt;

	public String getCaptionByDayOfWeek(Date date, Locale locale,
			TimeZone timezone) {
		if (_weekfmt == null) {
			_weekfmt = new SimpleDateFormat("EEE", locale);
		}
		_weekfmt.setTimeZone(timezone);
		return _weekfmt.format(date);
	}

	public String getCaptionByTimeOfDay(Date date, Locale locale,
			TimeZone timezone) {
		if (_timefmt == null) {
			_timefmt = new SimpleDateFormat("a H:mm", locale);
		}
		_timefmt.setTimeZone(timezone);
		return _timefmt.format(date);
	}

	public String getCaptionByDate(Date date, Locale locale, TimeZone timezone) {
		if (_datefmt == null) {
			_datefmt = new SimpleDateFormat("EEE MM/d", locale);
		}
		_datefmt.setTimeZone(timezone);
		return _datefmt.format(date);
	}

	public String getCaptionByDateOfMonth(Date date, Locale locale,
			TimeZone timezone) {
		Calendar cal = Calendar.getInstance(timezone, locale);
		cal.setTime(date);
		if (cal.get(Calendar.DAY_OF_MONTH) == 1) {
			SimpleDateFormat sd = new SimpleDateFormat("MMM d", locale);
			sd.setTimeZone(timezone);
			return sd.format(date);
		}
		return Integer.toString(cal.get(Calendar.DAY_OF_MONTH));
	}

	public String getCaptionByPopup(Date date, Locale locale, TimeZone timezone) {
		if (_popupfmt == null) {
			_popupfmt = new SimpleDateFormat("EEE, MMM/d", locale);
		}
		_popupfmt.setTimeZone(timezone);
		return _popupfmt.format(date);
	}

	public String getCaptionByWeekOfYear(Date date, Locale locale,
			TimeZone timezone) {
		Calendar cal = Calendar.getInstance(timezone, locale);
		cal.setTime(date);
		return String.valueOf(cal.get(Calendar.WEEK_OF_YEAR));
	}

}
