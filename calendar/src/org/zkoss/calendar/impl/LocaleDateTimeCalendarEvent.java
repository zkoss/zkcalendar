/* LocaleDateTimeCalendarEvent.java

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

import org.zkoss.zk.ui.WrongValueException;

/**
 * A LocaleDateTime implementation of {@link AbstractCalendarEvent}
 * @author leon
 * @since since 3.0.0
 */
public class LocaleDateTimeCalendarEvent extends AbstractCalendarEvent<LocalDateTime> implements Serializable {
	private static final long serialVersionUID = 20210112095645L;
	private ZoneId _zoneId;

	public LocaleDateTimeCalendarEvent(LocalDateTime begin, LocalDateTime end, ZoneId zoneId) {
		super("", "", "", "", false, begin, end);
		this._zoneId = zoneId;
	}

	public LocaleDateTimeCalendarEvent(String title, String content, String headerColor, String contentColor, boolean locked, LocalDateTime begin, LocalDateTime end, ZoneId zoneId) {
		super(title, content, headerColor, contentColor, locked, begin, end);
		this._zoneId = zoneId;
	}

	@Override
	protected Instant convertToInstant(LocalDateTime dateTime) throws WrongValueException {
		if (_zoneId == null)
			throw new WrongValueException("Must specify ZoneId");
		return dateTime == null ? null : dateTime.atZone(_zoneId).toInstant();
	}
}