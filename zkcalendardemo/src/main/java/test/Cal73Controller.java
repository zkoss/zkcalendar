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
import java.time.temporal.ChronoUnit;
import java.util.Calendar;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.LocaleDateTimeCalendarItem;
import org.zkoss.calendar.impl.SimpleCalendarItem;
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

		LocalDateTime start = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS);
		LocalDateTime end = start.plusMinutes(120);
		ZoneId zoneId = ZoneId.of("Europe/Paris");
		LocaleDateTimeCalendarItem event = new LocaleDateTimeCalendarItem(start, end, zoneId);
		event.setContent("LocaleDateTimeCalendarEvent: " + start.toString());
		calendarModel.add(event);

		SimpleCalendarItem event2 = new SimpleCalendarItem();
		java.util.Calendar calendar  = java.util.Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, 9);
		calendar.set(Calendar.MINUTE, 30);
		event2.setBeginDate(calendar.getTime());
		calendar.set(Calendar.HOUR_OF_DAY, 18);
		calendar.set(Calendar.MINUTE, 30);
		event2.setEndDate(calendar.getTime());
		event2.setContent("event old Date: " + event2.getBeginDate().toString());
		calendarModel.add(event2);
	}
}
