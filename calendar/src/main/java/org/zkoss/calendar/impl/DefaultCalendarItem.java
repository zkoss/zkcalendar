/* DefaultCalendarItem.java

		Purpose:
		
		Description:
		
		History:
				Tue Jan 12 09:56:45 CST 2021, Created by leon

Copyright (C) 2021 Potix Corporation. All Rights Reserved.
*/
package org.zkoss.calendar.impl;

import org.zkoss.calendar.api.CalendarItem;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * We provide this implementation to support Java new Date API: {@link LocalDateTime}. Because you cannot modify a {@link CalendarItem} in a browser by changing its data, it doesn't provide any setter methods. It avoids to mislead you that setters can change a {@link CalendarItem}'s status in a browser.
 * To update an {@link CalendarItem}, you need to {@link SimpleCalendarModel#remove(CalendarItem)} an old item and {@link SimpleCalendarModel#add(CalendarItem)} new item.
 * @author leon
 * @since since 3.0.0
 */
public class DefaultCalendarItem extends AbstractCalendarItem<LocalDateTime> implements Serializable {
	private static final long serialVersionUID = 20210112095645L;
	protected ZoneId zoneId;

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
		this.zoneId = zoneId;
	}

	@Override
	protected Instant convertToInstant(LocalDateTime dateTime) {
		return dateTime == null ? null : dateTime.atZone(zoneId).toInstant();
	}

	public ZoneId getZoneId() {
		return zoneId;
	}

	// implement equals() and hashCode() breaks the logic in Calendars.getCalendarItemId()

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

		/**
		 * Initialize builder with values from an existing DefaultCalendarItem
		 * @param item the existing DefaultCalendarItem to copy values from
		 * @return a Builder initialized with the existing item's values
		 * @since 3.2.0
		 */
		public static Builder from(DefaultCalendarItem item) {
			Builder builder = new Builder();
			builder.begin = LocalDateTime.ofInstant(item.getBegin(), item.zoneId);
			builder.end = LocalDateTime.ofInstant(item.getEnd(), item.zoneId);
			builder.zoneId = item.zoneId;
			builder.title = item.getTitle();
			builder.content = item.getContent();
			builder.headerColor = item.getHeaderColor();
			builder.contentColor = item.getContentColor();
			builder.headerStyle = item.getHeaderStyle();
			builder.contentColor = item.getContentStyle();
			builder.sclass = item.getSclass();
			builder.locked = item.isLocked();
			return builder;
		}

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
		 * @deprecated use {@link #withHeaderColor(String)} instead.
		 */
		@Deprecated
		public Builder withHeaderColor(String headerColor) {
			this.headerColor = "background-color:"+headerColor;
			return this;
		}

		/**
		 * set background color
		 * @param contentColor CSS accepted color code
		 * @deprecated use {@link #withContent(String)} instead.
		 */
		@Deprecated
		public Builder withContentColor(String contentColor) {
			this.contentColor = "background-color:"+contentColor;
			return this;
		}


		/**
		 * This is useful to apply a predefined style on a set of {@link DefaultCalendarItem}
		 * @param sclass
		 * @see #withHeaderStyle(String) 
		 * @see #withContentStyle(String)
		 */
		public Builder withSclass(String sclass) {
			this.sclass = sclass;
			return this;
		}

		public Builder withLocked(boolean locked) {
			this.locked = locked;
			return this;
		}

		/**
		 * Set the CSS style for the header. This method is useful for applying dynamic styles to specific calendar items without affecting other items or creating a CSS class. The component renders the specified style into an item's inline style (the highest priority).
		 * This method overrides the value set by {@link #withHeaderColor(String)}, if you set both.
		 * @param headerStyle CSS style string
		 * @since 3.2.0
		 */
		public Builder withHeaderStyle(String headerStyle) {
		    this.headerStyle = headerStyle;
		    return this;
		}

		/**
		 * Set the CSS style for the content. This method overrides the value set by {@link #withContentColor(String)} (String)}
		 * @param contentStyle CSS style string
		 * @see #withHeaderStyle(String)       
		 * @since 3.2.0
		 */
		public Builder withContentStyle(String contentStyle) {
		    this.contentStyle = contentStyle;
		    return this;
		}

		public DefaultCalendarItem build() {
			String finalHeaderStyle = headerStyle.isEmpty() ? headerColor : headerStyle;
			String finalContentStyle = contentStyle.isEmpty() ? contentColor : contentStyle;
			return new DefaultCalendarItem(title, content, finalHeaderStyle, finalContentStyle, sclass, locked, begin, end, zoneId);
		}
	}
}