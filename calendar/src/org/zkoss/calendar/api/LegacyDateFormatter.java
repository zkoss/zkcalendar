package org.zkoss.calendar.api;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

/**
 * A date ({@link Date}) formatter is used to display the different date format in the calendar.
 * Note: For compatibility only
 * @author leon
 * @deprecated As of release 3.0.0, please use {@link ZonedDateTimeFormatter}
 * @since 3.0.0
 *
 */
@Deprecated
public interface LegacyDateFormatter extends DateFormatter {
	public String getCaptionByDayOfWeek(Date date, Locale locale, TimeZone timezone);

	default public String getCaptionByDayOfWeek(ZonedDateTime date, Locale locale) {
		return getCaptionByDayOfWeek(Date.from(java.time.ZonedDateTime.now().toInstant()), locale, TimeZone.getTimeZone(date.getZone()));
	}

	public String getCaptionByTimeOfDay(Date date, Locale locale, TimeZone timezone);

	default public String getCaptionByTimeOfDay(ZonedDateTime date, Locale locale) {
		return getCaptionByTimeOfDay(Date.from(java.time.ZonedDateTime.now().toInstant()), locale, TimeZone.getTimeZone(date.getZone()));
	}

	public String getCaptionByDate(Date date, Locale locale, TimeZone timezone);

	default public String getCaptionByDate(ZonedDateTime date, Locale locale) {
		return getCaptionByDate(Date.from(java.time.ZonedDateTime.now().toInstant()), locale, TimeZone.getTimeZone(date.getZone()));
	}

	public String getCaptionByDateOfMonth(Date date, Locale locale, TimeZone timezone);

	default public String getCaptionByDateOfMonth(ZonedDateTime date, Locale locale) {
		return getCaptionByDateOfMonth(Date.from(java.time.ZonedDateTime.now().toInstant()), locale, TimeZone.getTimeZone(date.getZone()));
	}

	public String getCaptionByPopup(Date date, Locale locale, TimeZone timezone);

	default public String getCaptionByPopup(ZonedDateTime date, Locale locale) {
		return getCaptionByPopup(Date.from(java.time.ZonedDateTime.now().toInstant()), locale, TimeZone.getTimeZone(date.getZone()));
	}

	public String getCaptionByWeekOfYear(Date date, Locale locale, TimeZone timezone);

	default public String getCaptionByWeekOfYear(ZonedDateTime date, Locale locale) {
		return getCaptionByWeekOfYear(Date.from(java.time.ZonedDateTime.now().toInstant()), locale, TimeZone.getTimeZone(date.getZone()));
	}
}
