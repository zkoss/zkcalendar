/* Cal73Controller.java

		Purpose:
		
		Description:
		
		History:
				Tue Jan 05 12:38:37 CST 2021, Created by leon

Copyright (C) 2021 Potix Corporation. All Rights Reserved.
*/
package test;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.SimpleCalendarEvent;
import org.zkoss.calendar.impl.SimpleCalendarModel;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Wire;

public class Cal73Controller extends SelectorComposer {
	@Wire
	private Calendars calendars;

	private SimpleCalendarModel calendarModel = new SimpleCalendarModel();

	@Override
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		calendars.setModel(this.calendarModel);

		SimpleCalendarEvent event = new SimpleCalendarEvent();
		LocalDateTime localDateTimeNow = LocalDateTime.now();
		event.setBeginDateInLocalDateTime(localDateTimeNow);
		event.setEndDateInLocalDateTime(localDateTimeNow.plusHours(3));
		event.setContent("event with LocalDateTime: " + localDateTimeNow.toString());
		calendarModel.add(event);

		SimpleCalendarEvent event2 = new SimpleCalendarEvent();
		ZoneId zoneId = ZoneId.of("Europe/Paris");
		ZonedDateTime zonedDateTimeNow = ZonedDateTime.of(localDateTimeNow, zoneId);
		event2.setBeginDateInZonedDateTime(zonedDateTimeNow);
		event2.setEndDateInZonedDateTime(zonedDateTimeNow.plusHours(3));
		event2.setContent("event with ZonedDateTime: " + zonedDateTimeNow.toString());
		calendarModel.add(event2);

		SimpleCalendarEvent event3 = new SimpleCalendarEvent();
		java.util.Calendar calendar  = java.util.Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, 9);
		calendar.set(Calendar.MINUTE, 30);
		event3.setBeginDate(calendar.getTime());
		calendar.set(Calendar.HOUR_OF_DAY, 18);
		calendar.set(Calendar.MINUTE, 30);
		event3.setEndDate(calendar.getTime());
		event3.setContent("event old Date");
		calendarModel.add(event3);
	}
}
