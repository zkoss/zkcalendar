/* AbstractCalendarItem.java

		Purpose:
		
		Description:
		
		History:
				Tue Jan 12 09:34:16 CST 2021, Created by leon

Copyright (C) 2021 Potix Corporation. All Rights Reserved.
*/
package org.zkoss.calendar.impl;

import java.time.Instant;

import org.zkoss.calendar.api.CalendarItem;

/**
 * A skeletal implementation for {@link CalendarItem}
 * @author leon
 * @since 3.0.0
 */
public abstract class AbstractCalendarItem<T> implements CalendarItem {
	private String _title;
	private String _content;
	private String _headerColor;
	private String _contentColor;
	private boolean _locked;
	private T _begin;
	private T _end;

	public AbstractCalendarItem(String title, String content, String headerColor, String contentColor, boolean locked, T begin, T end) {
		this._title = title;
		this._content = content;
		this._headerColor = headerColor;
		this._contentColor = contentColor;
		this._locked = locked;
		this._begin = begin;
		this._end = end;
	}

	public Instant getBegin() {
		return convertToInstant(_begin);
	}

	public void setBegin(T begin) {
		this._begin = begin;
	}

	public Instant getEnd() {
		return convertToInstant(_end);
	}

	public void setEnd(T end) {
		this._end = end;
	}

	protected abstract Instant convertToInstant(T date);

	@Override
	public String getTitle() {
		return _title;
	}

	public void setTitle(String title) {
		_title = title;
	}

	@Override
	public String getContent() {
		return _content;
	}

	public void setContent(String content) {
		_content = content;
	}

	@Override
	public String getHeaderColor() {
		return _headerColor;
	}

	public void setHeaderColor(String hcolor) {
		_headerColor = hcolor;
	}

	@Override
	public String getContentColor() {
		return _contentColor;
	}

	public void setContentColor(String contentColor) {
		_contentColor = contentColor;
	}

	@Override
	public String getZclass() {
		return "z-calitem";
	}

	@Override
	public boolean isLocked() {
		return _locked;
	}

	/**
	 * When setting it to true, an end-user can't move a calendar item by mouse drag & drop in a browser.
	 * @param locked
	 */
	public void setLocked(boolean locked) {
		_locked = locked;
	}
}
