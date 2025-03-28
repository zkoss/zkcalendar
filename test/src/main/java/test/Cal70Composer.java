/* Cal70Composer.java

		Purpose:
		
		Description:
		
		History:
				Tue Nov 24 09:58:57 CST 2020, Created by leon

Copyright (C) 2020 Potix Corporation. All Rights Reserved.
*/
package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;

import java.util.Calendar;

public class Cal70Composer extends SelectorComposer {

	@Wire("#calendars")
	private Calendars zkcalendar;
	private SimpleCalendarModel model = new SimpleCalendarModel();

	@Override
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		zkcalendar.setModel(model);
		add();
	}

	@Listen("onClick = #add")
	public void add(){
		SimpleCalendarItem event1 = new SimpleCalendarItem();
		Calendar calendar  = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		calendar.set(Calendar.MINUTE, 40);
		event1.setBeginDate(calendar.getTime());
		calendar.set(Calendar.MINUTE, 50);
		event1.setEndDate(calendar.getTime());
		model.add(event1);

		SimpleCalendarItem event2 = new SimpleCalendarItem();
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		calendar.set(Calendar.MINUTE, 45);
		event2.setBeginDate(calendar.getTime());
		calendar.set(Calendar.MINUTE, 50);
		event2.setEndDate(calendar.getTime());
		model.add(event2);

		SimpleCalendarItem event3 = new SimpleCalendarItem();
		calendar.set(Calendar.HOUR_OF_DAY, 18);
		calendar.set(Calendar.MINUTE, 33);
		event3.setBeginDate(calendar.getTime());
		calendar.set(Calendar.HOUR_OF_DAY, 20);
		calendar.set(Calendar.MINUTE, 56);
		event3.setEndDate(calendar.getTime());
		model.add(event3);
	}
}