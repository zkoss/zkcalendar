/* Calevent.java

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
public interface CalendarEvent {
	/**
	 * Returns the beginning date of the calendar event.
	 * <p>
	 * @deprecated since 3.0.0
	 */
	@Deprecated
	default public Date getBeginDate() {
		return getBeginDateInInstant() == null ? null : Date.from(getBeginDateInInstant());
	}

	/**
	 * Returns the beginning date of the calendar event in Instant.
	 * <p>
	 * @since 3.0.0
	 */
	public Instant getBeginDateInInstant();

	/**
	 * Returns the end date of the calendar event. (exclusive)
	 * <p>
	 * @deprecated since 3.0.0
	 */
	@Deprecated
	default public Date getEndDate() {
		return getEndDateInInstant() == null ? null : Date.from(getEndDateInInstant());
	}

	/**
	 * Returns the beginning date of the calendar event in Instant.
	 * <p>
	 * @since 3.0.0
	 */
	public Instant getEndDateInInstant();

	/**
	 * Returns the title of the calendar event.
	 * <p>
	 * Note: never null
	 */
	public String getTitle();
	
	/**
	 * Returns the content of the calendar event.
	 * <p>
	 * Note: never null
	 */
	public String getContent();

	/**
	 * Returns the color of the header in the calendar event.
	 * Only allows the value being recognized by CSS. 
	 * <p>
	 * Note: never null
	 */
	public String getHeaderColor();

	/**
	 * Returns the color of the content in the calendar event.
	 * Only allows the value being recognized by CSS. 
	 * <p>
	 * Note: never null
	 */
	public String getContentColor();

	/**
	 * Returns the zclass of the calendar event.
	 * <p>
	 * Note: never null
	 */
	public String getZclass();

	/**
	 * Returns whether the calendar event is locked or not.
	 */
	public boolean isLocked();
}
