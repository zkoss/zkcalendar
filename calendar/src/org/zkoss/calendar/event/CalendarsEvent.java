/* CalendarEvent.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mar 31, 2009 5:17:31 PM , Created by jumperchen
		Thu Nov 10 9:32:58 TST 2009, Created by Jimmy
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
 */
package org.zkoss.calendar.event;

import java.util.Date;
import java.util.TimeZone;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.api.CalendarEvent;
import org.zkoss.calendar.impl.Util;
import org.zkoss.json.JSONArray;
import org.zkoss.zk.au.AuRequest;
import org.zkoss.zk.mesg.MZk;
import org.zkoss.zk.ui.*;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.sys.WebAppCtrl;

/**
 * The event is used for Calendars when user create/update/edit the calendar event.
 * <p> The event is able to stop or clear the dragging ghost from server to client,
 *  that is, when application developer doesn't invoke the {@link #stopClearGhost()},
 *  the dragging ghost will be cleared by default. Otherwise, application developer
 *  has to responsibly invoke the {@link #clearGhost()}.
 *  
 * @author jumperchen,jimmy
 */
public class CalendarsEvent extends Event {
	private static final long serialVersionUID = 20090331L;

	public static final String ON_EVENT_CREATE = "onEventCreate";
	public static final String ON_EVENT_EDIT = "onEventEdit";
	public static final String ON_EVENT_UPDATE = "onEventUpdate";
	public static final String ON_DAY_CLICK = "onDayClick";
	public static final String ON_WEEK_CLICK = "onWeekClick";
	
	private Date _beginDate;

	private Date _endDate;

	private CalendarEvent _ce;

	private final int _x, _y, _dtwd, _dthgh;

	public CalendarsEvent(String name, Component target, CalendarEvent ce,
			Date beginDate, Date endDate, int x, int y, int dtwd, int dthgh) {
		super(name, target);
		_ce = ce;
		_beginDate = beginDate;
		_endDate = endDate;
		_x = x;
		_y = y;
		_dtwd = dtwd;
		_dthgh = dthgh;
		clear(target,true);
	}

	/** Creates an instance of {@link Event} based on the specified request.
	 */
	public static CalendarsEvent getCreateEvent(AuRequest request) {
		final JSONArray data = (JSONArray) request.getData().get("data");
		final Calendars cmp = verifyEvent(request, data, 6);
		TimeZone tz = cmp.getDefaultTimeZone();
		Date eventBegin = Util.fixDSTTime(tz, new Date(getLong(data.get(0))));
		Date eventEnd = Util.fixDSTTime(tz, new Date(getLong(data.get(1))));
		
		return new CalendarsEvent(ON_EVENT_CREATE, cmp, null,
				eventBegin, eventEnd,
				getInt(data.get(2)), getInt(data.get(3)),
				getInt(data.get(4)),getInt(data.get(5)));
	}
	
	public static CalendarsEvent getEditEvent(AuRequest request) {
		final JSONArray data = (JSONArray) request.getData().get("data");
		final Calendars cmp = verifyEvent(request, data, 5);
		
		CalendarEvent ce = cmp.getCalendarEventById(String.valueOf(data.get(0)));
		
		if (ce == null) return null;
		
		return new CalendarsEvent(ON_EVENT_EDIT, cmp, ce, null, null,
				getInt(data.get(1)), getInt(data.get(2)),
				getInt(data.get(3)), getInt(data.get(4)));
	}	
	
	public static CalendarsEvent getUpdateEvent(AuRequest request) {
		final JSONArray data = (JSONArray) request.getData().get("data");
		final Calendars cmp = verifyEvent(request, data, 7);
		
		CalendarEvent ce = cmp.getCalendarEventById(String.valueOf(data.get(0)));
		
		if (ce == null) return null;
		TimeZone tz = cmp.getDefaultTimeZone();
		Date eventBegin = Util.fixDSTTime(tz, new Date(getLong(data.get(1))));
		Date eventEnd = Util.fixDSTTime(tz, new Date(getLong(data.get(2))));

		return new CalendarsEvent(ON_EVENT_UPDATE, cmp, ce, 
				eventBegin, eventEnd,
				getInt(data.get(3)), getInt(data.get(4)),
				getInt(data.get(5)),getInt(data.get(6)));
	}
	
	public static Event getClickEvent(AuRequest request, String cmd) {
		final JSONArray data = (JSONArray) request.getData().get("data");
		final Calendars cmp = verifyEvent(request, data, 1);		
		
		return new Event(cmd, cmp, Util.fixDSTTime(cmp.getDefaultTimeZone(), new Date(getLong(data.get(0)))));
	}
	
	private static int getInt(Object obj){
		return Integer.parseInt(String.valueOf(obj));
	}
	
	private static long getLong(Object obj){
		return Long.parseLong(String.valueOf(obj));
	}
	
	private static Calendars verifyEvent(AuRequest request, JSONArray data, int size) {
		final Calendars cmp = (Calendars)request.getComponent();
		if (cmp == null)
			throw new UiException(MZk.ILLEGAL_REQUEST_COMPONENT_REQUIRED, request);

		if (data == null || data.size() != size)
			throw new UiException(MZk.ILLEGAL_REQUEST_WRONG_DATA, 
					new Object[] {data, request});
		return cmp;
	}
	
	/**
	 * Stops to clear the dragging ghost command from server to client.
	 * <p>Note: If the method is invoked, application developer has to invoke
	 * {@link #clearGhost()} to clear the dragging ghost.
	 */
	public void stopClearGhost() {
		clear(getTarget(),false);
	}
	
	/**
	 * Clears the dragging ghost from server to client.
	 * <p> The CalendarsEvent will clear the ghost by default, except invoking
	 * {@link #stopClearGhost()}.
	 */
	public void clearGhost() {
		clear(getTarget(),true);
	}
	
	/**
	 * Returns the update beginning date. If the event name is onEventEdit, null is assumed.
	 */
	public Date getBeginDate() {
		return _beginDate;
	}

	/**
	 * Returns the update end date. If the event name is onEventEdit, null is assumed.
	 */
	public Date getEndDate() {
		return _endDate;
	}

	/**
	 * Returns the calendar event. If the event name is onEventCreate, null is assumed.
	 */
	public CalendarEvent getCalendarEvent() {
		return _ce;
	}

	/**
	 * Returns the x coordination of the mouse pointer relevant to the
	 * component.
	 */
	public final int getX() {
		return _x;
	}

	/**
	 * Returns the y coordination of the mouse pointer relevant to the
	 * component.
	 */
	public final int getY() {
		return _y;
	}	
	
	/** Returns the pixel width of the client's desktop.
	 */
	public int getDesktopWidth() {
		return _dtwd;
	}
	/** Returns the pixel height of the client's desktop.
	 */
	public int getDesktopHeight() {
		return _dthgh;
	}
	/**@since 2.0-RC
	 * do smart update, send an attribute to js 
	 * @param target
	 * @param isClear
	 */
	private void clear(Component target,boolean isClear){		
		((WebAppCtrl)((AbstractComponent)getTarget()).getDesktop().getWebApp()).getUiEngine().addSmartUpdate(target, "cleardd", Boolean.valueOf(isClear));		
	}
}
