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
	default public String getCaptionByDayOfWeek(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByDayOfWeek(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the day of week.
	 * @since 3.0.0
	 */
	public String getCaptionByDayOfWeek(ZonedDateTime date, Locale locale);

	default public String getCaptionByTimeOfDay(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByTimeOfDay(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the time of day.
	 * @since 3.0.0
	 */
	public String getCaptionByTimeOfDay(ZonedDateTime date, Locale locale);

	default public String getCaptionByDate(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByDate(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the date.
	 * @since 3.0.0
	 */
	public String getCaptionByDate(ZonedDateTime date, Locale locale);

	default public String getCaptionByDateOfMonth(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByDateOfMonth(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the date of month.
	 * @since 3.0.0
	 */
	public String getCaptionByDateOfMonth(ZonedDateTime date, Locale locale);

	default public String getCaptionByPopup(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByPopup(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the popup title.
	 * @since 3.0.0
	 */
	public String getCaptionByPopup(ZonedDateTime date, Locale locale);

	default public String getCaptionByWeekOfYear(Date date, Locale locale, TimeZone timezone) {
		return getCaptionByWeekOfYear(ZonedDateTime.ofInstant(date.toInstant(), timezone.toZoneId()), locale);
	}

	/**
	 * Returns the caption of the week number within the current year.
	 * @since 3.0.0
	 */
	public String getCaptionByWeekOfYear(ZonedDateTime date, Locale locale);
}
