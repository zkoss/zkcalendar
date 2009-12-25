/* CalendarDataListener.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mar 17, 2009 4:38:23 PM , Created by jumperchen
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.calendar.event;

import org.zkoss.calendar.api.CalendarModel;

/**
 * Defines the methods used to listener when the content of
 * {@link CalendarModel} is changed.
 * 
 * @author jumperchen
 *
 */
public interface CalendarDataListener {
	/** Sent when the contents of the calendar has changed.
	 */
	public void onChange(CalendarDataEvent event);
}
