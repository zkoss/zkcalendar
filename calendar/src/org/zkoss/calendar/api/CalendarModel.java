/* EventRenderer.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mar 12, 2009 4:45:21 PM , Created by jumperchen
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.calendar.api;

import java.util.Date;
import java.util.List;

import org.zkoss.calendar.event.CalendarDataListener;

/**
 * This interface defines the methods used for {@link Calendars} to store the
 * event datum.
 * @author jumperchen
 *
 */
public interface CalendarModel {
	/**
	 * Returns the list that must be a list of {@link CalendarEvent} type.
	 * 
	 * @param beginDate the begin date
	 * @param endDate the end date
	 * @param rc a RenderContext encapsulates the information needed for Calendars.
	 */
	public List<CalendarEvent> get(Date beginDate, Date endDate, RenderContext rc);	
	/** Adds a listener to the calendar model that's notified each time a change
	 * to the data model occurs. 
	 */
	public void addCalendarDataListener(CalendarDataListener l);
    /** Removes a listener from the calendar model that's notified each time
     * a change to the data model occurs. 
     */
	public void removeCalendarDataListener(CalendarDataListener l) ;
}
