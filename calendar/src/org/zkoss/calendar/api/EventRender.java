/* EventDrawer.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mar 16, 2009 3:00:11 PM , Created by jumperchen
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.calendar.api;

import java.util.Date;

import org.zkoss.calendar.Calendars;

/**
 * A renderer of the calendar event.(Like the mold renderer of ZK component)
 * @author jumperchen
 */
public interface EventRender {
	/**
	 * Draws the day in the default mold of the calendar.
	 * @param id auto-created by the calendars component
	 */
	public String drawDay(Calendars cal, CalendarEvent evt, String id);

	/**
	 * Draws the all day in the default mold of the calendar.
	 * @param id auto-created by the calendars component
	 */
	public String drawAllDay(Calendars cal, CalendarEvent evt, String id);

	/**
	 * Draws the day in the month mold of the calendar.
	 * @param id auto-created by the calendars component
	 */
	public String drawDayByMonth(Calendars cal, CalendarEvent evt, String id);

	/**
	 * Draws the all day in the month mold of the calendar.
	 * @param id auto-created by the calendars component
	 */
	public String drawAllDayByMonth(Calendars cal, CalendarEvent evt, String id, Date begin, Date end);
}
