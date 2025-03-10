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
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.calendar.api.CalendarItem;
import org.zkoss.util.Maps;

/**
 * A simple implementation of {@link CalendarItem}. Calling setters doesn't actually update a {@link CalendarItem} in a browser, you need to call {@link SimpleCalendarModel#update(CalendarItem)} after you modify an item.
 * @author jumperchen
 * @see AbstractCalendarItem
 */
public class SimpleCalendarItem extends AbstractCalendarItem<Date> implements Serializable {
	private static final long serialVersionUID = 20090316143135L;
	private static final Logger log = LoggerFactory.getLogger(SimpleCalendarItem.class);
	
	public SimpleCalendarItem() {
		super("", "", "", "", false, null, null);
	}

	@Deprecated
	public SimpleCalendarItem(String title, String content, String headerColor, String contentColor, boolean locked, Date begin, Date end) {
		super(title, content, headerColor, contentColor, locked, begin, end);
	}
	
	public SimpleCalendarItem(String title, String content, String style, String contentStyle, String headerStyle, boolean locked, Date begin, Date end) {
		super(title, content, style, contentStyle, headerStyle, locked, begin, end);
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

	public void setBegin(Date begin) {
		this._begin = begin;
	}

	public void setEnd(Date end) {
		this._end = end;
	}

	public void setTitle(String title) {
		this._title = title;
	}

	public void setContent(String content) {
		this._content = content;
	}

	@Deprecated
	/**
	 * Use setHeaderStyle(String headerStyle) instead.
	 */
	public void setHeaderColor(String hcolor) {
		Map styleMap = new HashMap<>();
		Maps.parse(styleMap, this._headerStyle, ':', ';', (char)0);
		styleMap.put("background-color", hcolor);
		this._headerStyle = Maps.toString(styleMap, (char) 0, ';', ':').replaceAll("\\\\ ", " ");
	}
	
	/**
	 * Use setContentStyle(String contentStyle) instead.
	 */
	@Deprecated
	public void setContentColor(String contentColor) {
		Map styleMap = new HashMap<>();
		Maps.parse(styleMap, this._style, ':', ';', (char)0);
		styleMap.put("background-color", contentColor);
		this._style= Maps.toString(styleMap, (char) 0, ';', ':').replaceAll("\\\\ ", " ");
	}
	
	/** Sets the css style applied to the main Dom node of the calendar item.
	 *
	 * @since 3.1.0
	 */
	public void setStyle(String style){
		this._style = style;
	}
	
	/** Sets the css style applied to the content Dom node of the calendar item.
	 *
	 * @since 3.1.0
	 */
	public void setContentStyle(String contentStyle){
		this._contentStyle = contentStyle;
	}
	
	/** Sets the css style applied to the header Dom node of the calendar item.
	 *
	 * @since 3.1.0
	 */
	public void setHeaderStyle(String headerStyle){
		this._headerStyle = headerStyle;
	}

	/** Sets the CSS class.
	 *
	 * @since 3.1.0
	 */
	public void setSclass(String scalss) {
		_sclass = scalss;
	}

	/**
	 * When setting it to true, an end-user can't move a calendar item by mouse drag and drop in a browser.
	 * @param locked
	 */
	public void setLocked(boolean locked) {
		_locked = locked;
	}
}
