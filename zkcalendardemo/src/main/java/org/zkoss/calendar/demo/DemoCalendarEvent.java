package org.zkoss.calendar.demo;

import org.zkoss.bind.annotation.Immutable;
import org.zkoss.calendar.impl.SimpleCalendarEvent;

import java.util.Date;

public class DemoCalendarEvent extends SimpleCalendarEvent {
	private static final long serialVersionUID = 1L;

	public DemoCalendarEvent(Date beginDate, Date endDate, String headerColor, String contentColor, String content) {
		setHeaderColor(headerColor);
		setContentColor(contentColor);
		setContent(content);
		setBeginDate(beginDate);
		setEndDate(endDate);
	}

	public DemoCalendarEvent(Date beginDate, Date endDate, String headerColor, String contentColor, String content,
			String title) {
		setHeaderColor(headerColor);
		setContentColor(contentColor);
		setContent(content);
		setTitle(title);
		setBeginDate(beginDate);
		setEndDate(endDate);
	}

	public DemoCalendarEvent(Date beginDate, Date endDate, String headerColor, String contentColor, String content,
			String title, boolean locked) {
		setHeaderColor(headerColor);
		setContentColor(contentColor);
		setContent(content);
		setTitle(title);
		setBeginDate(beginDate);
		setEndDate(endDate);
		setLocked(locked);
	}
	
	public DemoCalendarEvent() {
		setHeaderColor("#FFFFFF");
		setContentColor("#000000");
	}
	
	@Override
	@Immutable
	public Date getBeginDate() {
		return super.getBeginDate();
	}

	@Override
	@Immutable
	public Date getEndDate() {
		return super.getEndDate();
	}
}
