/* CalendarItem.java

{{IS_NOTE
	Purpose:

	Description:

	History:
		Mar 10, 2009 3:10:27 PM , Created by jumperchen
		Dec 3, 2009 7:10:27 PM , Created by jimmy
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
 */
package org.zkoss.calendar.api;

import java.time.Instant;
import java.util.Date;

/**
 * This interface defines the methods used for {@link Calendars} to render the
 * event data.
 *
 * @author jumperchen,jimmy
 *
 */
public interface CalendarItem {
	/**
	 * Returns the beginning date of the calendar item.
	 * <p>
	 * @deprecated since 3.0.0
	 */
	@Deprecated
	default public Date getBeginDate() {
		return getBegin() == null ? null : Date.from(getBegin());
	}

	/**
	 * Returns the beginning date of the calendar item in Instant.
	 * <p>
	 * @since 3.0.0
	 */
	public Instant getBegin();

	/**
	 * Returns the end date of the calendar item. (exclusive)
	 * <p>
	 * @deprecated since 3.0.0
	 */
	@Deprecated
	default public Date getEndDate() {
		return getEnd() == null ? null : Date.from(getEnd());
	}

	/**
	 * Returns the beginning date of the calendar item in Instant.
	 * <p>
	 * @since 3.0.0
	 */
	public Instant getEnd();

	/**
	 * Returns the title of the calendar item.
	 * <p>
	 * Note: never null
	 */
	public String getTitle();
	
	/**
	 * Returns the content of the calendar item.
	 * <p>
	 * Note: never null
	 */
	public String getContent();

	/**
	 * Returns the color of the header in the calendar item.
	 * Only allows the value being recognized by CSS. 
	 * <p>
	 * Note: never null
	 */
	public String getHeaderColor();

	/**
	 * Returns the color of the content in the calendar item.
	 * Only allows the value being recognized by CSS. 
	 * <p>
	 * Note: never null
	 */
	public String getContentColor();

	/**
	 * Returns the zclass of the calendar item.
	 * <p>
	 * Note: never null
	 */
	public String getZclass();

	/** Returns the CSS class.
	 *
	 * <p>The default styles of CalendarItem doesn't depend on the value
	 * of {@link #getSclass}. Rather, sclass is provided to
	 * perform small adjustment, e.g., only changing the font size.
	 * In other words, the default style is still applied if you change
	 * the value of {@link #getSclass}, unless you override it.
	 * To replace the default style completely, use
	 * zclass instead.
	 *
	 * Note: never null
	 *
	 * @see #getZclass
	 * @since 3.0.2
	 */
	public String getSclass();

	/**
	 * When it returns true, an end-user can't move the calendar item by mouse drag and drop in a browser.
	 * Otherwise, an end-user can freely move the item.
	 */
	public boolean isLocked();
}
