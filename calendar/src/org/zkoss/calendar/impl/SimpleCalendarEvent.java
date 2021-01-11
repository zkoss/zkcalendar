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
import java.time.ZonedDateTime;
import java.util.Date;

import org.zkoss.calendar.api.CalendarEvent;

/**
 * A simple implementation of {@link CalendarEvent}
 * @author jumperchen
 *
 */
public class SimpleCalendarEvent implements CalendarEvent, Serializable {
	private static final long serialVersionUID = 20090316143135L;
	private String _headerColor = "";
	private String _contentColor = "";
	private String _content = "";
	private String _title = "";
	private Instant _beginDate;
	private Instant _endDate;
	private boolean _locked;

	public void setBeginDate(Date beginDate) {
		setBeginDateInInstant(beginDate == null ? null : beginDate.toInstant());
	}

	public Instant getBeginDateInInstant() {
		return _beginDate;
	}

	public void setBeginDateInInstant(Instant beginDate) {
		if (beginDate == null)
			beginDate = Instant.now();
		if (!beginDate.equals(_beginDate))
			_beginDate = beginDate;
	}

	public void setBeginDateInZonedDateTime(ZonedDateTime beginDate) {
		setBeginDateInInstant(beginDate == null ? null : beginDate.toInstant());
	}

	public void setEndDate(Date endDate) {
		setEndDateInInstant(endDate == null ? null : endDate.toInstant());
	}

	public Instant getEndDateInInstant() {
		return _endDate;
	}

	public void setEndDateInZonedDateTime(ZonedDateTime endDate) {
		setEndDateInInstant(endDate == null ? null : endDate.toInstant());
	}

	public void setEndDateInInstant(Instant endDate) {
		if (endDate == null)
			endDate = Instant.now();
		if (!endDate.equals(_endDate))
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
