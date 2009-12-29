/* AbstractCalendarModel.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mar 17, 2009 4:45:25 PM , Created by jumperchen
		Thu Nov 10 9:32:58 TST 2009, Created by Jimmy
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.calendar.impl;

import java.io.Serializable;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.TimeZone;

import org.zkoss.calendar.api.CalendarEvent;
import org.zkoss.calendar.api.CalendarModel;
import org.zkoss.calendar.event.CalendarDataEvent;
import org.zkoss.calendar.event.CalendarDataListener;
import org.zkoss.io.Serializables;

/**
 * A skeletal implementation for {@link CalendarModel}
 * @author jumperchen,jimmy
 *
 */
abstract public class AbstractCalendarModel implements CalendarModel, Serializable {
	private static final long serialVersionUID = 20090317L;
	private transient List<CalendarDataListener> _listeners = new LinkedList<CalendarDataListener>();
		
	/** 
	 * @deprecated As of release 2.0-RC, replaced with {@link #fireEvent(int type, CalendarEvent e)}
	 * Fires a {@link CalendarDataEvent} for all registered listener
	 * (thru {@link #addCalendarDataListener}.
	 *
	 * @see #fireEvent(int, Date, Date, TimeZone)
	 */
	protected void fireEvent(int type, Date begin, Date end) {
		fireEvent(type, begin, end, null);
	}
	/** Fires a {@link CalendarDataEvent} for all registered listener
	 * (thru {@link #addCalendarDataListener}.
	 *
	 * @see #fireEvent(int, Date, Date, TimeZone)
	 */
	protected void fireEvent(int type, CalendarEvent e) {
		fireEvent(type, e, null);
	}
	/** 
	 * @deprecated As of release 2.0-RC, replaced with {@link #fireEvent(int type, CalendarEvent e, TimeZone timezone)}
	 * Fires a {@link CalendarDataEvent} for all registered listener
	 * (thru {@link #addCalendarDataListener}.
	 *
	 * <p>Note: you can invoke this method only in an event listener.
	 */
	protected void fireEvent(int type, Date begin, Date end, TimeZone timezone) {
		final CalendarDataEvent evt = new CalendarDataEvent(this, type, begin, end, timezone);
		for (CalendarDataListener listener : _listeners)
			listener.onChange(evt);
	}
	/** Fires a {@link CalendarDataEvent} for all registered listener
	 * (thru {@link #addCalendarDataListener}.
	 *
	 * <p>Note: you can invoke this method only in an event listener.
	 */
	protected void fireEvent(int type, CalendarEvent e, TimeZone timezone) {
		final CalendarDataEvent evt = new CalendarDataEvent(this, type, e, timezone);
		for (CalendarDataListener listener : _listeners)
			listener.onChange(evt);		
	}
	
	public void addCalendarDataListener(CalendarDataListener l) {
		if (l == null)
			throw new NullPointerException();
		_listeners.add(l);
	}

	public void removeCalendarDataListener(CalendarDataListener l) {
		_listeners.remove(l);
	}
	
	//Serializable//
	private synchronized void writeObject(java.io.ObjectOutputStream s)
	throws java.io.IOException {
		s.defaultWriteObject();
		Serializables.smartWrite(s, _listeners);
	}
	private synchronized void readObject(java.io.ObjectInputStream s)
	throws java.io.IOException, ClassNotFoundException {
		s.defaultReadObject();

		_listeners = new LinkedList<CalendarDataListener>();
		Serializables.smartRead(s, _listeners);
	}
}
