package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;

import java.text.*;
import java.util.Date;


public class Cal68Controller extends SelectorComposer<Component> {

	private static final long serialVersionUID = 1L;

	@Wire
	private Calendars calendars;
	
	private SimpleCalendarModel calendarModel;
	private final SimpleDateFormat DATA_FORMAT = new SimpleDateFormat("yyyy/MM/dd HH:mm");
	
	private Date getDate(String dateText) {
		try {
			return DATA_FORMAT.parse(dateText);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		calendarModel = new SimpleCalendarModel();
		SimpleCalendarItem calEvent = new SimpleCalendarItem();
		calEvent.setBeginDate(getDate("2016/11/01 13:00"));
		calEvent.setEndDate(getDate("2016/11/01 18:00"));
		calEvent.setTitle("zkcal issue");
		calendarModel.add(calEvent);
		calendars.setModel(this.calendarModel);
		calendars.setMold("default");
		calendars.setDays(7);
		calendars.setCurrentDate(getDate("2016/11/01 13:00"));
	}
	
	
	//listen to the calendar-update of event data, usually send when user drag the event data 
	@Listen("onItemUpdate = #calendars")
	public void updateEvent(CalendarsEvent event) {
		SimpleCalendarItem data = (SimpleCalendarItem) event.getCalendarItem();
		data.setBeginDate(event.getBeginDate());
		data.setEndDate(event.getEndDate());
		calendarModel.update(data);
	}	
}
