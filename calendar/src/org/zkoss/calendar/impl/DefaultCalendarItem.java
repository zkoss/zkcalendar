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

	/**
	 * @deprecated since 3.0.2, please use {@link Builder} instead
	 */
	@Deprecated
	public DefaultCalendarItem(LocalDateTime begin, LocalDateTime end, ZoneId zoneId) {
		this("", "", "", "", false, begin, end, zoneId);
	}

	/**
	 * @deprecated since 3.0.2, please use {@link Builder} instead
	 */
	@Deprecated
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

	/**
	 * The {@link Builder} for creating {@link DefaultCalendarItem}.
	 * @since 3.0.2
	 */
	public static class Builder {

		private LocalDateTime begin;
		private LocalDateTime end;
		private ZoneId zoneId;
		private String title = "";
		private String content = "";
		private String headerColor = "";
		private String contentColor = "";
		private boolean locked = false;

		public Builder withBegin(LocalDateTime begin) {
			this.begin = begin;
			return this;
		}

		public Builder withEnd(LocalDateTime end) {
			this.end = end;
			return this;
		}

		public Builder withZoneId(ZoneId zoneId) {
			this.zoneId = zoneId;
			return this;
		}

		public Builder withTitle(String title) {
			this.title = title;
			return this;
		}

		public Builder withContent(String content) {
			this.content = content;
			return this;
		}

		public Builder withHeaderColor(String headerColor) {
			this.headerColor = headerColor;
			return this;
		}

		public Builder withContentColor(String contentColor) {
			this.contentColor = contentColor;
			return this;
		}

		public Builder withLocked(boolean locked) {
			this.locked = locked;
			return this;
		}

		public DefaultCalendarItem build() {
			return new DefaultCalendarItem(title, content, headerColor, contentColor, locked, begin, end, zoneId);
		}
	}
}