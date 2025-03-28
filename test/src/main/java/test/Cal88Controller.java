/* Cal88Controller.java

		Purpose:
		
		Description:
		
		History:
				Wed Dec 22 17:20:31 CST 2021, Created by leon

Copyright (C) 2021 Potix Corporation. All Rights Reserved.
*/
package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Wire;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;

public class Cal88Controller extends SelectorComposer {
	@Wire
	private Calendars calendars;

	private SimpleCalendarModel calendarModel = new SimpleCalendarModel();

	@Override
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		calendars.setModel(this.calendarModel);

		// SimpleCalendarItem test
		SimpleCalendarItem item = new SimpleCalendarItem();
		Calendar calendar  = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, 9);
		calendar.set(Calendar.MINUTE, 30);
		item.setBeginDate(calendar.getTime());
		calendar.set(Calendar.HOUR_OF_DAY, 11);
		calendar.set(Calendar.MINUTE, 30);
		item.setEndDate(calendar.getTime());
		item.setContent("event old Date: " + item.getBeginDate().toString());
		item.setSclass("custom myclass");
		calendarModel.add(item);

		// DefaultCalendarItem test
		LocalDateTime start = LocalDateTime.now().withHour(12).withMinute(30).truncatedTo(ChronoUnit.HOURS);
		LocalDateTime end = start.plusMinutes(120);
		ZoneId zoneId = ZoneId.of("Asia/Taipei");
		DefaultCalendarItem event = new DefaultCalendarItem.Builder()
				.withTitle("title text")
				.withContent("content text")
				.withSclass("myclass")
				.withLocked(false)
				.withBegin(start)
				.withEnd(end)
				.withZoneId(zoneId)
				.build();
		calendarModel.add(event);
	}
}
