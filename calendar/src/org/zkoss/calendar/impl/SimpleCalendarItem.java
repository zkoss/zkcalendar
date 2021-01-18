/* SimpleCalendarItem.java

{{IS_NOTE
	Purpose:

	Description:

	History:
		Mar 16, 2009 2:31:35 PM , Created by jumperchen
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.calendar.impl;

import java.io.Serializable;
import java.time.Instant;
import java.util.Date;

import org.zkoss.calendar.api.CalendarItem;

/**
 * A simple implementation of {@link CalendarItem}
 * @author jumperchen
 * @see AbstractCalendarItem
 */
public class SimpleCalendarItem extends AbstractCalendarItem<Date> implements Serializable {
	private static final long serialVersionUID = 20090316143135L;

	public SimpleCalendarItem() {
		super("", "", "", "", false, null, null);
	}

	public SimpleCalendarItem(String title, String content, String headerColor, String contentColor, boolean locked, Date begin, Date end) {
		super(title, content, headerColor, contentColor, locked, begin, end);
	}

	@Override
	protected Instant convertToInstant(Date date) {
		return date == null ? null : date.toInstant();
	}

	public void setBeginDate(Date begin) {
		setBegin(begin);
	}

	public void setEndDate(Date end) {
		setEnd(end);
	}
}
