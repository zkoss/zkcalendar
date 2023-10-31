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
	 * @deprecated since 3.1.0, please use {@link Builder} instead
	 */
	@Deprecated
	public DefaultCalendarItem(LocalDateTime begin, LocalDateTime end, ZoneId zoneId) {
		this("", "", "", "", "", false, begin, end, zoneId);
	}

	/**
	 * @deprecated since 3.1.0, please use {@link Builder} instead
	 */
	@Deprecated
	public DefaultCalendarItem(String title, String content, boolean locked, LocalDateTime begin, LocalDateTime end, ZoneId zoneId) {
		this(title, content, "", "", "", locked, begin, end, zoneId);
	}

	private DefaultCalendarItem(String title, String content, String headerColor, String contentColor, String sclass, boolean locked, LocalDateTime begin, LocalDateTime end, ZoneId zoneId) {
		super(title, content, sclass, "",  contentColor, headerColor, locked, begin, end);
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
	 * @since 3.1.0
	 */
	public static class Builder {

		private LocalDateTime begin;
		private LocalDateTime end;
		private ZoneId zoneId;
		private String title = "";
		private String content = "";
		private String headerColor = "";
		private String contentColor = "";
		private String sclass = "";
		private boolean locked = false;
		private String headerStyle = "";
		private String contentStyle = "";

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

		/**
		 * set background color
		 * @param headerColor CSS accepted color code
		 * @deprecated use {@link #withSclass(String)} and CSS instead.
		 */
		@Deprecated
		public Builder withHeaderColor(String headerColor) {
			this.headerColor = "background-color:"+headerColor;
			return this;
		}

		/**
		 * set background color
		 * @param contentColor CSS accepted color code
		 * @deprecated use {@link #withSclass(String)} and CSS instead.
		 */
		@Deprecated
		public Builder withContentColor(String contentColor) {
			this.contentColor = "background-color:"+contentColor;
			return this;
		}


		public Builder withSclass(String sclass) {
			this.sclass = sclass;
			return this;
		}

		public Builder withLocked(boolean locked) {
			this.locked = locked;
			return this;
		}

		public DefaultCalendarItem build() {
			return new DefaultCalendarItem(title, content, headerColor, contentColor, sclass, locked, begin, end, zoneId);
		}
	}
}