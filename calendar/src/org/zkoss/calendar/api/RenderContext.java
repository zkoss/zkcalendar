/* RenderContext.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Mar 24, 2009 11:26:31 AM , Created by jumperchen
}}IS_NOTE

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.calendar.api;

import java.util.TimeZone;

/**
 * A RenderContext encapsulates the information needed to produce a
 * specific rendering from a Calendars.
 * @author jumperchen
 *
 */
public interface RenderContext {
	/**
	 * Returns the current time zone of the  calendar.
	 */
	public TimeZone getTimeZone();
}
