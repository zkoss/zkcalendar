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

import java.io.*;
import java.util.Calendar;

public class Cal104Controller extends SelectorComposer {
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

		ByteArrayOutputStream serializedData = new ByteArrayOutputStream();
		ObjectOutputStream serializedObject = new ObjectOutputStream(serializedData);
		serializedObject.writeObject(calendarModel);
		serializedObject.close();
		serializedData.close();
		
		System.out.println("Calendar model has been serialized");
		
		ByteArrayInputStream deserializedData = new ByteArrayInputStream(serializedData.toByteArray());
		ObjectInputStream deserializedObject = new ObjectInputStream(deserializedData);
		SimpleCalendarModel deserializedModel = (SimpleCalendarModel) deserializedObject.readObject();

		if(!(deserializedModel.size() == calendarModel.size())) {
			throw new RuntimeException("model was deserialized incorrectly");
		}
		
		System.out.println("Calendar model has been deserialized");
		
	}
}
