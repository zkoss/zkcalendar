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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.TimeZone;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.api.CalendarItem;
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
	private static final long serialVersionUID = 20090320175712L;

	protected List<CalendarItem> _list;

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
	public SimpleCalendarModel(List<CalendarItem> list, boolean live) {
		_list = live ? list: new ArrayList<CalendarItem>(list);
	}

	/**
	 * Constructor.
	 */
	public SimpleCalendarModel() {
		_list = new ArrayList<CalendarItem>();
	}

	/**
	 * Constructor.
	 * It makes a copy of the specified collection (i.e., not live).
	 */
	public SimpleCalendarModel(Collection<CalendarItem> c) {
		_list = new ArrayList<CalendarItem>(c);
	}
	/**
	 * Constructor.
	 * It makes a copy of the specified array (i.e., not live).
	 */
	public SimpleCalendarModel(CalendarItem[] array) {
		_list = Arrays.asList(array);
	}

	/**
	 * Constructor.
	 * @param initialCapacity the initial capacity for this SimpleCalendarModel.
	 */
	public SimpleCalendarModel(int initialCapacity) {
		_list = new ArrayList<CalendarItem>(initialCapacity);
	}

	/**
	 * Adds the calendar item to the specified index of the list.
	 */
	public void add(int index, CalendarItem e) {
		if (e == null) throw new NullPointerException("CalendarItem cannot be null!");
 		_list.add(index, e);
 		fireEvent(CalendarDataEvent.INTERVAL_ADDED, e);
 	}

	/**
	 * Adds the calendar item to the list.
	 */
	public boolean add(CalendarItem e) {
		if (e == null) throw new NullPointerException("CalendarItem cannot be null!");
		boolean ret = _list.add(e);
 		fireEvent(CalendarDataEvent.INTERVAL_ADDED, e);
		return ret;
	}

	/**
	 * Update the calendar item to the list.
	 */
	public boolean update(CalendarItem e) {
		if (e == null) throw new NullPointerException("CalendarItem cannot be null!");
		fireEvent(CalendarDataEvent.CONTENTS_CHANGED, e);
		boolean ret = _list.remove(e);
		if(!ret) return ret;
		ret = _list.add(e);		
		return ret;
	}
	/**
	 * Removes the calendar item from the specified index.
	 */
	public CalendarItem remove(int index) {
		CalendarItem ret = (CalendarItem)_list.remove(index);
		fireEvent(CalendarDataEvent.INTERVAL_REMOVED, ret);
		return ret;
	}
	
	/**
	 * Returns the index of the first occurrence of the specified element
     * in this list.
	 */
	public int indexOf(CalendarItem elem) {
		return _list.indexOf(elem);
	}
	
	/**
	 * Removes from the specified calendar item.
	 */
	public boolean remove(CalendarItem e) {
		if (e == null) throw new NullPointerException("CalendarItem cannot be null!");
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
	 * Retrieves a list of {@link CalendarItem} that overlap with the specified time range.
	 *
	 * @param beginDate the begin date
	 * @param endDate the end date
	 * @param rc a RenderContext encapsulates the information needed for Calendars.
	 * @deprecated 3.2.0
	 * @see #get(LocalDateTime, LocalDateTime, RenderContext)
	 */
	public List<CalendarItem> get(Date beginDate, Date endDate, RenderContext rc) {
		List<CalendarItem> matchingItems = new LinkedList<CalendarItem>();

		for (Iterator<CalendarItem> it = _list.iterator(); it.hasNext();) {
			CalendarItem item = it.next();
			if ( isTimeOverlapping(item.getBeginDate(), item.getEndDate(), beginDate, endDate)) {
				matchingItems.add(item);
			}

		}
		return matchingItems;
	}

	/**
	 * @see #get(Date, Date, RenderContext)
	 * @since 3.2.0
	 */
	@Override //ZKCAL-84
	public List<CalendarItem> get(LocalDateTime beginDate, LocalDateTime endDate, RenderContext context) {
		TimeZone zone = context.getTimeZone();
		Date begin = Date.from(beginDate.atZone(zone.toZoneId()).toInstant());
		Date end = Date.from(endDate.atZone(zone.toZoneId()).toInstant());
		return get(begin, end, context);
	}

	public static boolean isTimeOverlapping(Date begin1, Date end1, Date begin2, Date end2) {
		long beginTime1 = begin1.getTime();
		long endTime1 = end1.getTime();
		long beginTime2 = begin2.getTime();
		long endTime2 = end2.getTime();

		return (beginTime2 >= beginTime1 && beginTime2 < endTime1) || // item1 inside item2
				(beginTime1 >= beginTime2 && beginTime1 < endTime2) || // item2 inside item1
				(beginTime1 <= beginTime2 && endTime1 > beginTime2) || // Overlap at ends
				(beginTime2 <= beginTime1 && endTime2 > beginTime1);
	}
}
