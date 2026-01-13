package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.DefaultCalendarItem;
import org.zkoss.calendar.impl.SimpleCalendarModel;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Wire;

import java.sql.Date;
import java.time.LocalDateTime;

public class SaturdayEventComposer extends SelectorComposer {

    @Wire("calendars")
    private Calendars calendars;
    private SimpleCalendarModel model;
    private LocalDateTime day1;

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        day1 = LocalDateTime.of(2023, 1, 1, 0, 0);
        calendars.setCurrentDate(Date.from(day1.atZone(calendars.getDefaultTimeZone().toZoneId()).toInstant()));
        model = new SimpleCalendarModel();
        calendars.setModel(model);
        addSaturdayItem();
    }

    private void addSaturdayItem() {
        // January 1, 2023 is Sunday, so Saturday is January 7, 2023
        LocalDateTime saturday = LocalDateTime.of(2023, 1, 7, 11, 30); // 11:30 AM
        LocalDateTime endTime = LocalDateTime.of(2023, 1, 7, 12, 0);   // 12:00 PM

        DefaultCalendarItem saturdayItem = new DefaultCalendarItem.Builder()
                .withBegin(saturday)
                .withEnd(endTime)
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withTitle("Saturday Event")
                .withSclass("saturday-event")
                .build();
        model.add(saturdayItem);
    }
}
