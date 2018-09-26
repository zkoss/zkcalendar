package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;
import sun.awt.geom.AreaOp;

import java.text.*;
import java.time.*;
import java.util.*;


public class Cal71Controller extends SelectorComposer<Component> {

    private static final long serialVersionUID = 1L;

    @Wire
    private Calendars calendars;

    private SimpleCalendarModel calendarModel = new SimpleCalendarModel();
    ;
    private final SimpleDateFormat DATA_FORMAT = new SimpleDateFormat("yyyy/MM/dd HH:mm");
    private LocalDateTime today = LocalDateTime.now();

    private Date getDate(String dateText) {
        try {
            return DATA_FORMAT.parse(dateText);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Date toDate(LocalDateTime localDateTime){
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        calendars.setModel(this.calendarModel);
        calendars.setMold("month");
        calendars.setCurrentDate(toDate(today));
        addManyEvents();
    }


    public void addManyEvents() {
        SimpleCalendarEvent calendarEvent = null;
        for (int n = 0; n < 100; n++) {
            calendarEvent = new SimpleCalendarEvent();
            calendarEvent.setBeginDate(toDate(today));
            calendarEvent.setEndDate(toDate(today.plusHours(2)));
            calendarEvent.setContent("event " + n);
            calendarModel.add(calendarEvent);
        }

        LocalDateTime tomorrow = today.plusDays(1);
        for (int n = 0; n < 10; n++) {
            calendarEvent = new SimpleCalendarEvent();
            calendarEvent.setBeginDate(toDate(tomorrow));
            calendarEvent.setEndDate(toDate(tomorrow.plusHours(2)));
            calendarEvent.setContent("event " + n);
            calendarModel.add(calendarEvent);
        }
    }
}
