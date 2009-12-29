/* Calendars.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mar 10, 2009 3:08:27 PM , Created by jumperchen
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
 */
package org.zkoss.calendar.api;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

/**
 * This interface defines the methods used for Calendars.
 * 
 * @author jumperchen
 * 
 */
public interface Calendars extends org.zkoss.zul.impl.api.XulElement {
	/**
	 * Returns the current time zone of the calendar.
	 */
	public TimeZone getDefaultTimeZone();

	/**
	 * Returns the calendar model.
	 */
	public CalendarModel getModel();

	/**
	 * Sets the calendar model.
	 */
	public void setModel(CalendarModel model);

	/**
	 * Adds the time zone to the calendar.
	 * <p>
	 * Note: the first added will be the default time zone of the calendar.
	 * 
	 * @param label
	 *            the description of the time zone.
	 * @param timezone
	 *            a time zone. (Cannot duplicate)
	 */
	public void addTimeZone(String label, TimeZone timezone);

	/**
	 * Adds the time zone to the calendar.
	 * <p>
	 * Note: the first added will be the default time zone of the calendar.
	 * 
	 * @param label
	 *            the description of the time zone.
	 * @param timezone
	 *            a id of time zone. (Cannot duplicate)
	 * @see TimeZone#getTimeZone(String)
	 * @see #addTimeZone(String, TimeZone)
	 */
	public void addTimeZone(String label, String timezone);

	/**
	 * Sets the time zone to the calendar, it is easily used for ZUL file. e.g.
	 * 
	 * <pre>
	 * &lt;calendars timeZone=&quot;Taiwan=GMT+8, Sweden=GMT+1,&quot;&gt;
	 * </pre>
	 * 
	 * @param timezone
	 */
	public void setTimeZone(String timezone);

	/**
	 * Removes the time zone from the calendar
	 */
	public boolean removeTimeZone(TimeZone timezone);

	/**
	 * Returns the unmodifiable map including all the timezone inside the
	 * calendar.
	 */
	public Map<TimeZone, String> getTimeZones();

	/**
	 * 
	 * Returns the unmodifiable list including all the calendar events matching
	 * from the specified date in the same date. e.g. "20090324" exclusive the
	 * time of the date "23:30".
	 * <p>
	 * Note: never null.
	 */
	public List<CalendarEvent> getEvent(Date beginDate);

	/**
	 * @deprecated As of release 2.0-RC
	 * Returns the event renderer used for {@link CalendarEvent} to draw its
	 * outline (i.e. HTML), like the DSP renderer of ZK component.
	 * <p>
	 * Note: never null.
	 */
	public EventRender getEventRender();

	/**
	 * @deprecated As of release 2.0-RC
	 * Sets the event renderer.
	 */
	public void setEventRender(EventRender render);

	/**
	 * Sets the date formatter. In fact, there are five places in the calendar
	 * must have different date display.
	 * 
	 * @see DateFormatter
	 */
	public void setDateFormatter(DateFormatter dfmater);

	/**
	 * 
	 * Sets the date formatter by a class name.
	 * 
	 * @see DateFormatter
	 * @see #setDateFormatter(DateFormatter)
	 */
	public void setDateFormatter(String clsnm) throws Exception;

	/**
	 * Returns the date formatter.
	 * <p>
	 * Note: never null.
	 */
	public DateFormatter getDateFormatter();

	/**
	 * Returns the beginning date, which is based on {@link #getCurrentDate()} in
	 * the current view depended on which {@link #getMold()} is using.
	 */
	public Date getBeginDate();

	/**
	 * Returns the end date, which is based on {@link #getCurrentDate()} in the
	 * current view depended on which {@link #getMold()} is using. 
	 */
	public Date getEndDate();

	/**
	 * Returns the number of the week of the month in the current date.
	 */
	public int getWeekOfMonth();

	/**
	 * Navigates the current date to the previous page, that is, when the {@link #getDays()}
	 * is seven with default mold, the previous page means the previous week.
	 * In the month mold, it means the previous month.
	 */
	public void previousPage();

	/**
	 * Navigates the current date to the next page, that is, when the {@link #getDays()}
	 * is seven with default mold, the next page means the next week.
	 * In the month mold, it means the next month.
	 */
	public void nextPage();

	/**
	 * Sets the current date.
	 * <p> Default: today (depend on which timezone the calendar is using).
	 */
	public void setCurrentDate(Date curDate);

	/**
	 * Returns the current date.
	 * <p> Default: today (depend on which timezone the calendar is using).
	 */
	public Date getCurrentDate();

	/**
	 * Sets the days, that is, how many column should be displayed on the default mold.
	 * <p> Default: 7. (i.e. one week), in month view, the attribute will be ignored.
	 */
	public void setDays(int days);

	/**
	 * Returns the days.
	 * <p> Default: 7. (i.e. one week)
	 * If the days is less than 1, 1 is assumed.
	 */
	public int getDays();

	/**
	 * Sets what the first day of the week is; e.g., <code>SUNDAY</code> in the
	 * U.S., <code>MONDAY</code> in France.
	 * <p> Default: {@link Calendar#SUNDAY}
	 * <p> Note: it is only allowed when days with 7 in the default mold or using the month mold.
	 * @param value
	 *            the given first day of the week.
	 * @see #getFirstDayOfWeek()
	 * @see java.util.Calendar#setFirstDayOfWeek
	 */
	public void setFirstDayOfWeek(int value);
	
	/**
	 * Sets what the first day of the week is.
	 * <p> Note: it is only allowed when days with 7 in the default mold or using the month mold.
	 * @param day <code>SUNDAY</code>, <code>MONDAY</code>,
	 * <code>TUESDAY</code>, <code>WEDNESDAY</code>, <code>THURSDAY</code>, <code>FRIDAY</code>,
	 * and <code>SATURDAY</code>. Case insensitive
 	 */
	public void setFirstDayOfWeek(String day);

	/**
	 * Gets what the first day of the week is; e.g., <code>SUNDAY</code> in the
	 * U.S., <code>MONDAY</code> in France.
	 * <p> Default: {@link Calendar#SUNDAY}
	 * 
	 * @return the first day of the week.
	 * @see #setFirstDayOfWeek(int)
	 * @see java.util.Calendar#getFirstDayOfWeek
	 */
	public int getFirstDayOfWeek();

	/**
	 * Sets whether enable to show the week number within the current year or not.
	 */
	public void setWeekOfYear(boolean weekOfYear);	
	/**
	 * Returns whether enable to show the week number within the current year or not.
	 * <p>Default: false
	 */
	public boolean isWeekOfYear();
	/** Returns whether it is readonly.
	 * <p>Default: false.
	 */
	public boolean isReadonly();
	/** Sets whether it is readonly.
	 */
	public void setReadonly(boolean readonly);
}
