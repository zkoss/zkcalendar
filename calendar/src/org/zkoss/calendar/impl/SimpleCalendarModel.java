/* SimpleCalendarModel.java

{{IS_NOTE
	Purpose:

	Description:

	History:
		Mar 20, 2009 5:57:12 PM , Created by jumperchen
		Thu Nov 10 9:32:58 TST 2009, Created by jimmy
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.calendar.impl;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.TimeZone;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.api.CalendarEvent;
import org.zkoss.calendar.api.CalendarModel;
import org.zkoss.calendar.api.RenderContext;
import org.zkoss.calendar.event.CalendarDataEvent;
import org.zkoss.zul.event.ListDataEvent;

/**
 * A simple implementation of {@link CalendarModel}.
 * @author jumperchen,jimmy
 *
 */
public class SimpleCalendarModel extends AbstractCalendarModel implements
		Serializable {
	private static final long serialVersionUID = 20090320L;

	protected List<CalendarEvent> _list;

	/**
	 * Constructor
	 *
	 * @param list the list to represent
	 * @param live whether to have a 'live' {@link CalendarModel} on top of
	 * the specified list.
	 * If false, the content of the specified list is copied.
	 * If true, this object is a 'facade' of the specified list,
	 * i.e., when you add or remove items from this SimpleCalendarModel,
	 * the inner "live" list would be changed accordingly.
	 *
	 * However, it is not a good idea to modify <code>list</code>
	 * if it is passed to this method with live is true,
	 * since {@link Calendars} is not smart enough to handle it.
	 * Instead, modify it thru this object.
	 */
	public SimpleCalendarModel(List<CalendarEvent> list, boolean live) {
		_list = live ? list: new ArrayList<CalendarEvent>(list);
	}

	/**
	 * Constructor.
	 */
	public SimpleCalendarModel() {
		_list = new ArrayList<CalendarEvent>();
	}

	/**
	 * Constructor.
	 * It makes a copy of the specified collection (i.e., not live).
	 */
	public SimpleCalendarModel(Collection<CalendarEvent> c) {
		_list = new ArrayList<CalendarEvent>(c);
	}
	/**
	 * Constructor.
	 * It makes a copy of the specified array (i.e., not live).
	 */
	public SimpleCalendarModel(CalendarEvent[] array) {
		_list = Arrays.asList(array);
	}

	/**
	 * Constructor.
	 * @param initialCapacity the initial capacity for this SimpleCalendarModel.
	 */
	public SimpleCalendarModel(int initialCapacity) {
		_list = new ArrayList<CalendarEvent>(initialCapacity);
	}

	/**
	 * Adds the calendar event to the specified index of the list.
	 */
	public void add(int index, CalendarEvent e) {
		if (e == null) throw new NullPointerException("CalendarEvent cannot be null!");
 		_list.add(index, e);
 		fireEvent(CalendarDataEvent.INTERVAL_ADDED, e);
 	}

	/**
	 * Adds the calendar event to the list.
	 */
	public boolean add(CalendarEvent e) {
		if (e == null) throw new NullPointerException("CalendarEvent cannot be null!");
		boolean ret = _list.add(e);
 		fireEvent(CalendarDataEvent.INTERVAL_ADDED, e);
		return ret;
	}

	/**
	 * Update the calendar event to the list.
	 */
	public boolean update(CalendarEvent e) {
		if (e == null) throw new NullPointerException("CalendarEvent cannot be null!");
		fireEvent(CalendarDataEvent.CONTENTS_CHANGED, e);
		boolean ret = _list.remove(e);
		if(!ret) return ret;
		ret = _list.add(e);		
		return ret;
	}
	/**
	 * Removes the calendar event from the specified index.
	 */
	public CalendarEvent remove(int index) {
		CalendarEvent ret = (CalendarEvent)_list.remove(index);
		fireEvent(CalendarDataEvent.INTERVAL_REMOVED, ret);
		return ret;
	}
	
	/**
	 * Returns the index of the first occurrence of the specified element
     * in this list.
	 */
	public int indexOf(CalendarEvent elem) {
		return _list.indexOf(elem);
	}
	
	/**
	 * Removes from the specified calendar event.
	 */
	public boolean remove(CalendarEvent e) {
		if (e == null) throw new NullPointerException("CalendarEvent cannot be null!");
		int index = indexOf(e);
		if (index >= 0) {
			remove(index);
		}
		return false;
	}
	
	/**
	 * Removes all of the elements from this list (optional operation).
     * The list will be empty after this call returns.
	 */
	public void clear() {
		if (_list.isEmpty()) return;
		
		_list.clear();
		fireEvent(ListDataEvent.INTERVAL_REMOVED, null, TimeZone.getDefault());
	}
	
    /**
     * Returns the number of elements in this list.
     */
	public int size() {
		return _list.size();
	}
	/**
	 * Returns the list that must be a list of {@link CalendarEvent} type.
	 * 
	 * @param beginDate the begin date
	 * @param endDate the end date
	 * @param rc a RenderContext encapsulates the information needed for Calendars.
	 */
	public List<CalendarEvent> get(Date beginDate, Date endDate, RenderContext rc) {
		List<CalendarEvent> list = new LinkedList<CalendarEvent>();
		long begin = beginDate.getTime();
		long end = endDate.getTime();
		
		for (CalendarEvent ce : _list) {
			long b = ce.getBeginDate().getTime();
			long e = ce.getEndDate().getTime();

			if (e < begin || b >= end)
				continue;

			list.add(ce);
		}		
		return list;
	}

}
