package org.zkoss.calendar.demo;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.SimpleCalendarItem;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;
import org.zkoss.zkmax.ui.select.annotation.Subscribe;
import org.zkoss.zul.Textbox;

import java.util.*;


public class CalendarController extends SelectorComposer<Component> {

	private static final long serialVersionUID = 1L;

	@Wire
	private Calendars calendars;
	@Wire
	private Textbox filter;
	
	private FilteringCalendarModel calendarModel;
	
	//the in editing calendar ui event
	private CalendarsEvent calendarsEvent = null;

	@Override
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		calendarModel = new FilteringCalendarModel(new DemoCalendarData().getCalendarEvents());
		calendars.setModel(this.calendarModel);
	}


	//control the calendar position
	@Listen("onClick = #today")
	public void gotoToday() {
		TimeZone timeZone = calendars.getDefaultTimeZone();
		calendars.setCurrentDate(Calendar.getInstance(timeZone).getTime());
	}

	@Listen("onClick = #next")
	public void gotoNext() {
		calendars.nextPage();
	}

	@Listen("onClick = #prev")
	public void gotoPrev() {
		calendars.previousPage();
	}
	
	//control page display
	@Listen("onClick = #pageDay")
	public void changeToDay() {
		calendars.setMold("default");
		calendars.setDays(1);
	}
	@Listen("onClick = #pageWeek")
	public void changeToWeek() {
		calendars.setMold("default");
		calendars.setDays(7);
	}
	@Listen("onClick = #pageMonth")
	public void changeToYear() {
		calendars.setMold("month");
	}
	
	//control the filter
	@Listen("onClick = #applyFilter")
	public void applyFilter() {
		calendarModel.setFilterText(filter.getValue());
		calendars.setModel(calendarModel);
	}
	@Listen("onClick = #resetFilter")
	public void resetFilter() {
		filter.setText("");
		calendarModel.setFilterText("");
		calendars.setModel(calendarModel);
	}

	//listen to the calendar-create and edit of a event data
	@Listen(CalendarsEvent.ON_ITEM_CREATE + " = #calendars; "
			+ CalendarsEvent.ON_ITEM_EDIT + "  = #calendars")
	public void createEvent(CalendarsEvent event) {
		calendarsEvent = event;
		
		//to display a shadow when editing
		calendarsEvent.stopClearGhost();
		
		SimpleCalendarItem data = (SimpleCalendarItem) event.getCalendarItem();

		if (data == null) {
			data = new SimpleCalendarItem();
			data.setHeaderColor("#3366ff");
			data.setContentColor("#6699ff");
			data.setBeginDate(event.getBeginDate());
			data.setEndDate(event.getEndDate());
		} else {
			data = (SimpleCalendarItem) event.getCalendarItem();
		}
		//notify the editor
		QueueUtil.lookupQueue().publish(
				new QueueMessage(QueueMessage.Type.EDIT, data));
	}
	
	//listen to the calendar-update of event data, usually send when user drag the event data 
	@Listen(CalendarsEvent.ON_ITEM_UPDATE + " = #calendars")
	public void updateEvent(CalendarsEvent event) {
		SimpleCalendarItem data = (SimpleCalendarItem) event.getCalendarItem();
		data.setBeginDate(event.getBeginDate());
		data.setEndDate(event.getEndDate());
		calendarModel.update(data);
	}
	
	//listen to queue message from other controller
	@Subscribe(value = QueueUtil.QUEUE_NAME)
	public void handleQueueMessage(Event event) {
		if (!(event instanceof QueueMessage)) {
			return;
		} 
		QueueMessage message = (QueueMessage) event;
		switch (message.getType()) {
		case DELETE:
			calendarModel.remove((SimpleCalendarItem) message.getData());
			//clear the shadow of the event after editing
			calendarsEvent.clearGhost(); 
			calendarsEvent = null;
			break;
		case OK:
			if (calendarModel.indexOf((SimpleCalendarItem) message.getData()) >= 0) {
				calendarModel.update((SimpleCalendarItem) message.getData());
			} else {
				calendarModel.add((SimpleCalendarItem) message.getData());
			}
		case CANCEL:
			//clear the shadow of the event after editing
			calendarsEvent.clearGhost();
			calendarsEvent = null;
			break;
		}
	}	
}
