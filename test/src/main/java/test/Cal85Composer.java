/* Cal85Composer.java

		Purpose:
		
		Description:
		
		History:
				Mon Oct 04 15:51:02 CST 2021, Created by leon

Copyright (C) 2021 Potix Corporation. All Rights Reserved.
*/
package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.util.*;

import java.time.*;

public class Cal85Composer implements Composer<Calendars> {

	private Calendars cal;

	@Override
	public void doAfterCompose(Calendars cal) throws Exception {
		this.cal = cal;
		this.cal.setModel(new SimpleCalendarModel());
		cal.addEventListener(CalendarsEvent.ON_ITEM_CREATE, (CalendarsEvent event) -> createCalendarItem(event));
		cal.addEventListener(CalendarsEvent.ON_ITEM_UPDATE, (CalendarsEvent event) -> updateCalendarItem(event));
	}

	private void updateCalendarItem(CalendarsEvent event) {
		getModel().remove(event.getCalendarItem());
		createCalendarItem(event);
	}

	private void createCalendarItem(CalendarsEvent event) {
		Clients.log("end time received at server side: " + event.getEndDate());
		ZoneId zoneId = cal.getDefaultTimeZone().toZoneId();
		getModel().add(new DefaultCalendarItem(
				LocalDateTime.ofInstant(event.getBeginDate().toInstant(), zoneId),
				LocalDateTime.ofInstant(event.getEndDate().toInstant(), zoneId),
				zoneId));
	}

	private SimpleCalendarModel getModel() {
		return (SimpleCalendarModel) cal.getModel();
	}
}