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

import java.util.Date;
import org.zkoss.calendar.api.CalendarEvent;

/**
 * A simple implementation of {@link CalendarEvent}
 * @author jumperchen
 *
 */
public class SimpleCalendarEvent implements CalendarEvent {
	private String _headerColor = "";
	private String _contentColor = "";
	private String _content = "";
	private String _title = "";
	private Date _beginDate;
	private Date _endDate;
	private boolean _locked;

	public Date getBeginDate() {
		return _beginDate;
	}
	public void setBeginDate(Date beginDate) {
		_beginDate = beginDate;
	}
	public Date getEndDate() {
		return _endDate;
	}
	public void setEndDate(Date endDate) {
		_endDate = endDate;
	}

	public String getContent() {
		return _content;
	}
	public void setContent(String content) {
		_content = content;
	}

	public String getTitle() {
		return _title;
	}

	public void setTitle(String title) {
		_title = title;
	}

	public String getContentColor() {
		return _contentColor;
	}

	public void setContentColor(String ccolor) {
		_contentColor = ccolor;
	}
	public String getHeaderColor() {
		return _headerColor;
	}
	public void setHeaderColor(String hcolor) {
		_headerColor = hcolor;
	}
	public String getZclass() {
		return "z-calevent";
	}

	public boolean isLocked() {
		return _locked;
	}
	public void setLocked(boolean locked) {
		_locked = locked;
	}
}
