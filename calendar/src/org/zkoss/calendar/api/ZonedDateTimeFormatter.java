package org.zkoss.calendar.api;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

/**
 * A date ({@link ZonedDateTime}) formatter is used to display the different date format in the calendar.
 * @author leon
 * @since 3.0.0
 *
 */
public interface ZonedDateTimeFormatter extends DateFormatter {
	/**
	 * Returns the caption of the day of week.
	 * @deprecated As of release 3.0.0
	 */
	@Deprecated
	default public String getCaptionByDayOfWeek(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByDayOfWeek(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the day of week.
	 */
	public String getCaptionByDayOfWeek(ZonedDateTime date, Locale locale);

	/**
	 * Returns the caption of the time of day.
	 * @deprecated As of release 3.0.0
	 */
	@Deprecated
	default public String getCaptionByTimeOfDay(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByTimeOfDay(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the time of day.
	 */
	public String getCaptionByTimeOfDay(ZonedDateTime date, Locale locale);

	/**
	 * Returns the caption of the date.
	 * @deprecated As of release 3.0.0
	 */
	@Deprecated
	default public String getCaptionByDate(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByDate(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the date.
	 */
	public String getCaptionByDate(ZonedDateTime date, Locale locale);

	/**
	 * Returns the caption of the date of month.
	 * @deprecated As of release 3.0.0
	 */
	@Deprecated
	default public String getCaptionByDateOfMonth(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByDateOfMonth(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the date of month.
	 */
	public String getCaptionByDateOfMonth(ZonedDateTime date, Locale locale);

	/**
	 * Returns the caption of the popup title.
	 * @deprecated As of release 3.0.0
	 */
	@Deprecated
	default public String getCaptionByPopup(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByPopup(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the popup title.
	 */
	public String getCaptionByPopup(ZonedDateTime date, Locale locale);

	/**
	 * Returns the caption of the week number within the current year.
	 * @deprecated As of release 3.0.0
	 */
	@Deprecated
	default public String getCaptionByWeekOfYear(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByWeekOfYear(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the week number within the current year.
	 */
	public String getCaptionByWeekOfYear(ZonedDateTime date, Locale locale);
}
