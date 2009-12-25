/* ContentHandler.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mar 11, 2009 4:27:29 PM , Created by jumperchen
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.calendar.api;

import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

/**
 * A date formatter is used to display the different date format in the calendar.
 * @author jumperchen
 *
 */
public interface DateFormatter {
	/**
	 * Returns the caption of the day of week.
	 */
	public String getCaptionByDayOfWeek(Date date, Locale locale, TimeZone timezone);

	/**
	 * Returns the caption of the time of day.
	 */
	public String getCaptionByTimeOfDay(Date date, Locale locale, TimeZone timezone);

	/**
	 * Returns the caption of the date.
	 */
	public String getCaptionByDate(Date date, Locale locale, TimeZone timezone);
	/**
	 * Returns the caption of the date of month.
	 */
	public String getCaptionByDateOfMonth(Date date, Locale locale, TimeZone timezone);
	
	/**
	 * Returns the caption of the popup title.
	 */
	public String getCaptionByPopup(Date date, Locale locale, TimeZone timezone);
	
	/**
	 * Returns the caption of the week number within the current year.
	 */
	public String getCaptionByWeekOfYear(Date date, Locale locale, TimeZone timezone);
}
