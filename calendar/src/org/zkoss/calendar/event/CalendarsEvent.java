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

import org.zkoss.calendar.api.CalendarEvent;
import org.zkoss.zk.ui.AbstractComponent;
import org.zkoss.zk.ui.Component;
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
