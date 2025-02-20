package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.*;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;

import java.time.*;
import java.util.Date;

public class MoldComposer extends SelectorComposer {

    @Wire("calendars")
    private Calendars calendars;
    private SimpleCalendarModel model = new SimpleCalendarModel();
    private ZoneId defaultZoneId;
    private LocalDateTime day1;
    static ZoneId twZoneId = ZoneId.of("Asia/Taipei");

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        day1 = LocalDateTime.of(2023, 1, 1, 0, 0);
        calendars.setCurrentDate(Date.from(day1.atZone(twZoneId).toInstant()));
        calendars.setModel(model);
    }


    @Listen("onClick = #monthMold")
    public void toMonthMold(){
        calendars.setMold("month");
    }

    @Listen("onClick = #defaultMold")
    public void toDefaultMold(){
        calendars.setMold("default");
    }
}
