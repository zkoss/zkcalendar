/* Cal83Controller.java

		Purpose:
		
		Description:
		
		History:
				Fri Jan 15 11:09:18 CST 2021, Created by leon

Copyright (C) 2021 Potix Corporation. All Rights Reserved.
*/
package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.util.Composer;
import org.zkoss.zul.*;

import java.time.*;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static java.time.temporal.ChronoUnit.*;
import static org.zkoss.zk.ui.event.Events.ON_CLICK;

public class Cal83Controller  implements Composer {

	private static ZoneId tz = ZoneId.systemDefault();

	private Calendars calendars;
	private SimpleCalendarModel calendarModel;
	private Hlayout buttonBar;

	@Override
	public void doAfterCompose(Component comp) throws Exception {
		ZonedDateTime testDay = ZonedDateTime.of(2021, 1, 13, 14, 0, 0, 0, tz);
		SimpleCalendarItem shortEvent = createCalendarEvent(testDay, 1, HOURS, "short event");
		SimpleCalendarItem longEvent = createCalendarEvent(testDay.minusDays(2).truncatedTo(DAYS), 5, DAYS, "long event");
		calendarModel = new SimpleCalendarModel();
		calendarModel.add(shortEvent);
		calendarModel.add(longEvent);

		buttonBar = new Hlayout();
		buttonBar.appendChild(shiftEndDateButton(shortEvent, "short to long event", 4));
		buttonBar.appendChild(shiftEndDateButton(longEvent, "long to longer event", 4));
		buttonBar.appendChild(switchMoldButton("default"));
		buttonBar.appendChild(switchMoldButton("month"));
		comp.appendChild(buttonBar);

		comp.appendChild(createCalendar());
		calendars.setModel(calendarModel);
		calendars.setCurrentDate(Date.from(testDay.toInstant()));
	}

	private Component shiftEndDateButton(SimpleCalendarItem calendarItem, String buttonLabel, int days) {
		Button button = new Button(buttonLabel);
		button.addEventListener(ON_CLICK, e -> {
			Instant shiftedEnd = calendarItem.getEndDate().toInstant().atZone(tz)
					.plusDays(days).toInstant();
			calendarItem.setEndDate(Date.from(shiftedEnd));
			// ERRORS happen after this *******************************
			calendarModel.update(calendarItem);
//			workaround call remove/add separately instead of update
//			calendarModel.remove(calendarItem);
//			calendarModel.add(calendarItem);
		});
		return button;
	}

	private Button switchMoldButton(String mold) {
		Button button = new Button("mold: " + mold);
		button.addEventListener(ON_CLICK, e -> calendars.setMold(mold));
		return button;
	}

	private SimpleCalendarItem createCalendarEvent(ZonedDateTime start, int duration, ChronoUnit unit, String text) {
		SimpleCalendarItem item = new SimpleCalendarItem();
		ZonedDateTime begin = start.truncatedTo(HOURS);
		ZonedDateTime end = begin.plus(duration, unit);

		item.setBeginDate(Date.from(begin.toInstant()));
		item.setEndDate(Date.from(end.toInstant()));
		item.setContent(text);
		item.setHeaderColor("red");
		item.setContentColor("lightcoral");
		return item;
	}

	private Calendars createCalendar() {
		calendars = new Calendars();
		calendars.addTimeZone(tz.getDisplayName(TextStyle.FULL, Locale.ENGLISH), tz.getId());
		calendars.setMold("month");
		return calendars;
	}
}
