/* CalendarEventImpl.java

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

import org.zkoss.calendar.api.CalendarEvent;

/**
 * A simple implementation of {@link CalendarEvent}
 * @author jumperchen
 * @deprecated since 3.0.0
 * @see AbstractCalendarEvent
 */
@Deprecated
public class SimpleCalendarEvent extends AbstractCalendarEvent<Date> implements Serializable {
	private static final long serialVersionUID = 20090316143135L;

	public SimpleCalendarEvent() {
		super("", "", "", "", false, null, null);
	}

	public SimpleCalendarEvent(String title, String content, String headerColor, String contentColor, boolean locked, Date begin, Date end) {
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
