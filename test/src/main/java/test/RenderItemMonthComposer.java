package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.DefaultCalendarItem;
import org.zkoss.calendar.impl.SimpleCalendarModel;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Wire;

import java.sql.Date;
import java.time.LocalDateTime;

public class RenderItemMonthComposer extends SelectorComposer {

    @Wire("calendars")
    private Calendars calendars;
    private SimpleCalendarModel model;

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        initModel();
        calendars.setModel(model);
    }

    private void initModel() {
        model = new SimpleCalendarModel();
        LocalDateTime day1 = LocalDateTime.of(2023, 10, 22, 0, 0);
        calendars.setCurrentDate(Date.from(day1.atZone(calendars.getDefaultTimeZone().toZoneId()).toInstant()));

        DefaultCalendarItem start0End0 = new DefaultCalendarItem.Builder()
                .withBegin(day1)
                .withEnd(day1)
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass("instant")
                .build();

        model.add(start0End0);

        DefaultCalendarItem dayLong2 = new DefaultCalendarItem.Builder()
                .withBegin(day1.plusHours(1))
                .withEnd(day1.plusHours(2))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .build();
        model.add(dayLong2);

    }
}
