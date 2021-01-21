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
	protected String _title;
	protected String _content;
	protected String _headerColor;
	protected String _contentColor;
	protected boolean _locked;
	protected T _begin;
	protected T _end;

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

	public Instant getEnd() {
		return convertToInstant(_end);
	}

	protected abstract Instant convertToInstant(T date);

	@Override
	public String getTitle() {
		return _title;
	}

	@Override
	public String getContent() {
		return _content;
	}

	@Override
	public String getHeaderColor() {
		return _headerColor;
	}

	@Override
	public String getContentColor() {
		return _contentColor;
	}

	@Override
	public String getZclass() {
		return "z-calitem";
	}

	@Override
	public boolean isLocked() {
		return _locked;
	}
}
