/* CalendarDataEvent.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mar 17, 2009 4:40:42 PM , Created by jumperchen
		Thu Nov 10 9:32:58 TST 2009, Created by Jimmy
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.calendar.event;

import java.util.Date;
import java.util.TimeZone;

import org.zkoss.calendar.api.CalendarEvent;
import org.zkoss.calendar.api.CalendarModel;

/**
 * Defines an event that encapsulates changes to a date range. 
 * 
 * @author jumperchen,jimmy
 */
public class CalendarDataEvent {
	/** Identifies one or more changes in the lists contents. */
	public static final int CONTENTS_CHANGED = 0;
    /** Identifies the addition of one or more contiguous items to the list. */    
	public static final int INTERVAL_ADDED = 1;
    /** Identifies the removal of one or more contiguous items from the list. */   
	public static final int INTERVAL_REMOVED = 2;

	private final CalendarModel _model;
	private final int _type;
	private final Date _begin, _end;
	private final TimeZone _timezone;
	private final CalendarEvent _e;
	
	/** Contructor.
	 *@deprecated As of release 2.0-RC, replaced with {@link #CalendarDataEvent(CalendarModel model, int type, CalendarEvent e, TimeZone timezone)}
	 * @param type one of {@link #CONTENTS_CHANGED},
	 * {@link #INTERVAL_ADDED}, {@link #INTERVAL_REMOVED}.
	 */
	public CalendarDataEvent(CalendarModel model, int type, Date begin, Date end, TimeZone timezone) {
		if (model == null)
			throw new IllegalArgumentException();
		_model = model;
		_type = type;
		_begin = begin;
		_end = end;
		_timezone = timezone;
		_e = null;
	}
	
	/** Contructor.
	 * @since 1.1.1_50
	 * @param type one of {@link #CONTENTS_CHANGED},
	 * {@link #INTERVAL_ADDED}, {@link #INTERVAL_REMOVED}.
	 */
	public CalendarDataEvent(CalendarModel model, int type, CalendarEvent e, TimeZone timezone) {
		if (model == null)
			throw new IllegalArgumentException();
		_model = model;
		_type = type;
		_begin = e != null ? e.getBeginDate() : null;
		_end = e != null ? e.getEndDate() : null;
		_e = e;
		_timezone = timezone;
	}
	/** Returns the calendar model that fires this event.
	 */
	public CalendarModel getModel() {
		return _model;
	}
	/** Returns the event type. One of {@link #CONTENTS_CHANGED},
	 * {@link #INTERVAL_ADDED}, {@link #INTERVAL_REMOVED}.
	 */
	public int getType() {
		return _type;
	}
	/** Returns the begin date of the change range.
	 */
	public Date getBeginDate() {
		return _begin;
	}
	/** Returns the end date of the change range.
	 */
	public Date getEndDate() {
		return _end;
	}
	/**
	 * Return the time zone of the calendar
	 */
	public TimeZone getTimeZone() {
		return _timezone;
	}
	/**
	 * @since 1.1.1_50
	 * Return the CalendarEvent of the calendar
	 */
	public CalendarEvent getCalendarEvent() {
		return _e;
	}
	
	//Object//
	public String toString() {
		return "[CalendarDataEvent type=" + _type +", begin="+_begin+", end="+_end+']';
	}
}
