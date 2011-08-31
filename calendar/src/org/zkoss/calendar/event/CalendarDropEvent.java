/* CalendarDropEvent.java

	Purpose:
		
	Description:
		
	History:
		Aug 30, 2011 6:15:07 PM, Created by jimmy

Copyright (C) 2011 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
package org.zkoss.calendar.event;

import java.util.Date;
import java.util.Map;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.api.CalendarEvent;
import org.zkoss.calendar.impl.Util;
import org.zkoss.zk.au.AuRequest;
import org.zkoss.zk.au.AuRequests;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.DropEvent;

/**
 * Represents an event cause by user's dragging and dropping a component.
 *
 * <p>The component being dragged can be retrieved by {@link #getDragged}.
 * The component that received the dragged component is {@link #getTarget}.
 * @author jimmy
 * 
 */
public class CalendarDropEvent extends DropEvent {

	
	private Date _date;
	private CalendarEvent _ce;
	
	/** Converts an AU request to a drop event.
	 * @since 5.0.0
	 */
	public static CalendarDropEvent getDropEvent(AuRequest request) {
		Calendars cmp = (Calendars)request.getComponent();
		final Map data = request.getData();
		final int keys = AuRequests.parseKeys(data);
		Date date = null;
		
		Object t = data.get("time");
		
		if (t != null)
			date = Util.fixDSTTime(cmp.getDefaultTimeZone(), 
					new Date(Long.parseLong(t.toString())));
		
		return new CalendarDropEvent(request.getCommand(), request.getComponent(),
			request.getDesktop().getComponentByUuid((String)data.get("dragged")),
			AuRequests.getInt(data, "x", 0), AuRequests.getInt(data, "y", 0),
			AuRequests.getInt(data, "pageX", 0), AuRequests.getInt(data, "pageY", 0),
			keys, date, cmp.getCalendarEventById(String.valueOf(data.get("ce"))));
	}


	public CalendarDropEvent(String name, Component target, Component dragged,
			int x, int y, int pageX, int pageY, int keys, Date date, CalendarEvent ce) {
		super(name, target, dragged, x, y, pageX, pageY, keys);
		_date = date;
		_ce = ce;
		
	}

	/**
	 * Returns the date of drop area.
	 */
	public Date getDate() {
		return _date;
	}
	
	/**
	 * Returns the calendar event.
	 */
	public CalendarEvent getCalendarEvent() {
		return _ce;
	}
}
