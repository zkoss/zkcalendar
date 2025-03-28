/* Cal71Controller.java

		Purpose:
		
		Description:
		
		History:
				Thu Nov 26 11:24:06 CST 2020, Created by leon

Copyright (C) 2020 Potix Corporation. All Rights Reserved.
*/
package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Wire;

import java.util.Calendar;

public class Cal71Controller extends SelectorComposer {
	@Wire
	private Calendars calendars;

	private SimpleCalendarModel calendarModel = new SimpleCalendarModel();

	@Override
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		calendars.setModel(this.calendarModel);
		Calendar calendar  = Calendar.getInstance();

		for (int i = 0; i < 100; i++) {
			SimpleCalendarItem event = new SimpleCalendarItem();
			calendar.set(Calendar.HOUR_OF_DAY, 9);
			calendar.set(Calendar.MINUTE, 30);
			event.setBeginDate(calendar.getTime());
			calendar.set(Calendar.HOUR_OF_DAY, 18);
			calendar.set(Calendar.MINUTE, 30);
			event.setEndDate(calendar.getTime());
			event.setContent("event: " + (i + 1));
			calendarModel.add(event);
		}
	}
}
