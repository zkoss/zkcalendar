package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;

import java.util.Calendar;

public class Cal70Composer extends SelectorComposer{

    @Wire("#calendars")
    private Calendars zkcalendar;
    private SimpleCalendarModel model = new SimpleCalendarModel();

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        zkcalendar.setModel(model);
        add();
        add2();
        add1H();
        addOver1d();
    }

    @Listen("onClick = #add")
    public void add(){
        SimpleCalendarEvent event1 = new SimpleCalendarEvent();
        java.util.Calendar calendar  = java.util.Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 40);
        event1.setBeginDate(calendar.getTime());
        calendar.set(Calendar.MINUTE, 50);
        event1.setEndDate(calendar.getTime());
        model.add(event1);

        SimpleCalendarEvent event2 = new SimpleCalendarEvent();
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 45);
        event2.setBeginDate(calendar.getTime());
        calendar.set(Calendar.MINUTE, 50);
        event2.setEndDate(calendar.getTime());
        model.add(event2);
    }

    public void add2(){
        java.util.Calendar calendar  = java.util.Calendar.getInstance();
        int today = calendar.get(Calendar.DAY_OF_MONTH);
        calendar.set(Calendar.DAY_OF_MONTH, today-1);

        SimpleCalendarEvent event1 = new SimpleCalendarEvent();
        calendar.set(Calendar.HOUR_OF_DAY, 3);
        calendar.set(Calendar.MINUTE, 0);
        event1.setBeginDate(calendar.getTime());
        calendar.set(Calendar.MINUTE, 28);
        event1.setEndDate(calendar.getTime());
        model.add(event1);

        SimpleCalendarEvent event2 = new SimpleCalendarEvent();
        calendar.set(Calendar.HOUR_OF_DAY, 4);
        calendar.set(Calendar.MINUTE, 35);
        event2.setBeginDate(calendar.getTime());
        calendar.set(Calendar.MINUTE, 59);
        event2.setEndDate(calendar.getTime());
        model.add(event2);
    }

    public void add1H(){
        java.util.Calendar calendar  = java.util.Calendar.getInstance();
        int today = calendar.get(Calendar.DAY_OF_MONTH);
        calendar.set(Calendar.DAY_OF_MONTH, today-1);

        SimpleCalendarEvent event1 = new SimpleCalendarEvent();
        calendar.set(Calendar.HOUR_OF_DAY, 8);
        calendar.set(Calendar.MINUTE, 0);
        event1.setBeginDate(calendar.getTime());
        calendar.set(Calendar.HOUR_OF_DAY, 9);
        event1.setEndDate(calendar.getTime());
        model.add(event1);
    }

    public void addOver1d(){
        java.util.Calendar calendar  = java.util.Calendar.getInstance();
        int today = calendar.get(Calendar.DAY_OF_MONTH);
        calendar.set(Calendar.DAY_OF_MONTH, today-3);

        SimpleCalendarEvent event1 = new SimpleCalendarEvent();
        event1.setContent("over 1 day");
        calendar.set(Calendar.HOUR_OF_DAY, 8);
        calendar.set(Calendar.MINUTE, 0);
        event1.setBeginDate(calendar.getTime());

        calendar.set(Calendar.DAY_OF_MONTH, today-2);
        calendar.set(Calendar.HOUR_OF_DAY, 9);
        event1.setEndDate(calendar.getTime());
        model.add(event1);

    }
}
