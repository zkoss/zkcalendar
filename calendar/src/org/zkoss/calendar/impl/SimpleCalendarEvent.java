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
import java.time.LocalDateTime;
import java.time.ZoneId;
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
	private ZonedDateTime _beginDate;
	private ZonedDateTime _endDate;
	private boolean _locked;

	public void setBeginDate(Date beginDate) {
		setBeginDateInZonedDateTime(beginDate == null ? null : ZonedDateTime.ofInstant(beginDate.toInstant(), ZoneId.systemDefault()));
	}

	public ZonedDateTime getBeginDateInZonedDateTime() {
		return _beginDate;
	}

	public void setBeginDateInZonedDateTime(ZonedDateTime beginDate) {
		if (beginDate == null)
			beginDate = ZonedDateTime.now();
		if (!beginDate.equals(_beginDate))
			_beginDate = beginDate;
	}

	public LocalDateTime getBeginDateInLocalDateTime() {
		return getBeginDateInZonedDateTime().toLocalDateTime();
	}

	public void setBeginDateInLocalDateTime(LocalDateTime beginDate) {
		setBeginDateInZonedDateTime(beginDate == null ? null : beginDate.atZone(ZoneId.systemDefault()));
	}

	public void setEndDate(Date endDate) {
		setEndDateInZonedDateTime(endDate == null ? null : ZonedDateTime.ofInstant(endDate.toInstant(), ZoneId.systemDefault()));
	}

	public ZonedDateTime getEndDateInZonedDateTime() {
		return _endDate;
	}

	public void setEndDateInZonedDateTime(ZonedDateTime endDate) {
		if (endDate == null)
			endDate = ZonedDateTime.now();
		if (!endDate.equals(_endDate))
			_endDate = endDate;
	}

	public LocalDateTime getEndDateInLocalDateTime() {
		return getEndDateInZonedDateTime().toLocalDateTime();
	}

	public void setEndDateInLocalDateTime(LocalDateTime endDate) {
		setEndDateInZonedDateTime(endDate == null ? null : endDate.atZone(ZoneId.systemDefault()));
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
