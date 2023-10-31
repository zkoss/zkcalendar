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
    private LocalDateTime day1;

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        day1 = LocalDateTime.of(2023, 1, 1, 0, 0);
        calendars.setCurrentDate(Date.from(day1.atZone(calendars.getDefaultTimeZone().toZoneId()).toInstant()));
        model = new SimpleCalendarModel();
        calendars.setModel(model);
        addSameBeginEndTime();
        addDaySpanItems();
    }

    private void addDaySpanItems() {
        LocalDateTime day2 = day1.plusDays(1);
        DefaultCalendarItem span2Item = new DefaultCalendarItem.Builder()
                .withBegin(day2)
                .withEnd(day2.plusDays(1))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass("span2")
                .build();
        model.add(span2Item);

        DefaultCalendarItem span3Item = new DefaultCalendarItem.Builder()
                .withBegin(day2)
                .withEnd(day2.plusDays(2))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass("span3")
                .build();
        model.add(span3Item);
        DefaultCalendarItem span4Item = new DefaultCalendarItem.Builder()
                .withBegin(day2)
                .withEnd(day2.plusDays(3))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass("span4")
                .build();
        model.add(span4Item);
    }

    private void addSameBeginEndTime() {
        DefaultCalendarItem start0End0 = new DefaultCalendarItem.Builder()
                .withBegin(day1)
                .withEnd(day1)
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass("instant")
                .build();
        model.add(start0End0);

        DefaultCalendarItem start3End3 = new DefaultCalendarItem.Builder()
                .withBegin(day1.plusHours(3))
                .withEnd(day1.plusHours(3))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass("instant")
                .build();
        model.add(start3End3);

        DefaultCalendarItem itemOnSameDay = new DefaultCalendarItem.Builder()
                .withBegin(day1.plusHours(1))
                .withEnd(day1.plusHours(2))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .build();
        model.add(itemOnSameDay);

        LocalDateTime day22 = day1.plusDays(21);
        DefaultCalendarItem start0End0Item2 = new DefaultCalendarItem.Builder()
                .withBegin(day22)
                .withEnd(day22)
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass("instant")
                .build();
        model.add(start0End0Item2);

        DefaultCalendarItem itemOnSameDay2 = new DefaultCalendarItem.Builder()
                .withBegin(day22.plusHours(1))
                .withEnd(day22.plusHours(2))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .build();
        model.add(itemOnSameDay2);
    }
}
