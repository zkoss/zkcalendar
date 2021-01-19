/* DefaultCalendarItem.java

		Purpose:
		
		Description:
		
		History:
				Tue Jan 12 09:56:45 CST 2021, Created by leon

Copyright (C) 2021 Potix Corporation. All Rights Reserved.
*/
package org.zkoss.calendar.impl;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * An immutable implementation of {@link AbstractCalendarItem} using LocalDateTime and ZoneId.
 * @author leon
 * @since since 3.0.0
 */
public class DefaultCalendarItem extends AbstractCalendarItem<LocalDateTime> implements Serializable {
	private static final long serialVersionUID = 20210112095645L;
	private ZoneId _zoneId;

	public DefaultCalendarItem(LocalDateTime begin, LocalDateTime end, ZoneId zoneId) {
		this("", "", "", "", false, begin, end, zoneId);
	}

	public DefaultCalendarItem(String title, String content, String headerColor, String contentColor, boolean locked, LocalDateTime begin, LocalDateTime end, ZoneId zoneId) {
		super(title, content, headerColor, contentColor, locked, begin, end);
		if (zoneId == null)
			throw new IllegalArgumentException("Must specify ZoneId");
		this._zoneId = zoneId;
	}

	@Override
	protected Instant convertToInstant(LocalDateTime dateTime) {
		return dateTime == null ? null : dateTime.atZone(_zoneId).toInstant();
	}
}