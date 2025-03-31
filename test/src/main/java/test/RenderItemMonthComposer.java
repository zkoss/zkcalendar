package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.*;
import org.zkoss.util.TimeZones;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;

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
        addSameBeginEndTime(); //ZKCAL-92
        addDaySpanItems();
        addOverWeekendItems();
        addEndtimeAfter1200();
        addZkcal127Item();
        addLongTextItem();
        addColoredItems();
        addItemForChanged();
    }

    private void addOverWeekendItems() {
        LocalDateTime day13 = day1.plusDays(12).plusHours(8);
        DefaultCalendarItem overWeekend = new DefaultCalendarItem.Builder()
                .withBegin(day13)
                .withEnd(day13.plusDays(2))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withTitle("over a weekend")
                .withSclass("over-weekend")
                .build();
        model.add(overWeekend);
    }

    private void addDaySpanItems() {
        LocalDateTime day2 = day1.plusDays(1);
        DefaultCalendarItem span2Item = new DefaultCalendarItem.Builder()
                .withBegin(day2)
                .withEnd(day2.plusDays(1).plusHours(2))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass("span2")
                .withTitle("span 2d")
                .build();
        model.add(span2Item);

        DefaultCalendarItem span3Item = new DefaultCalendarItem.Builder()
                .withBegin(day2)
                .withEnd(day2.plusDays(2).plusHours(2))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass("span3")
                .withTitle("span 3d")
                .build();
        model.add(span3Item);
        DefaultCalendarItem span4Item = new DefaultCalendarItem.Builder()
                .withBegin(day2)
                .withEnd(day2.plusDays(3).plusHours(2))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass("span4")
                .withTitle("span 4d")
                .build();
        model.add(span4Item);
    }

    private void addSameBeginEndTime() { //ZKCAL-119
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

    // ZKCAL-124 endtime at any minute later than 12:00 will cause the problem
    private void addEndtimeAfter1200(){
        LocalDateTime day = LocalDateTime.of(2023, 1, 5, 11, 0);
        LocalDateTime endTime = LocalDateTime.of(2023, 1, 5, 13, 01);
        DefaultCalendarItem problemItem = new DefaultCalendarItem.Builder()
                .withBegin(day)
                .withEnd(endTime)
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withTitle("end after 12:00")
                .withSclass("end-after-12")
                .build();
        model.add(problemItem);
    }

    private void addZkcal127Item() {
        LocalDateTime start = LocalDateTime.of(2023, 1, 6, 13, 30);
        LocalDateTime end = LocalDateTime.of(2023, 1, 6, 14, 0);
        DefaultCalendarItem item = new DefaultCalendarItem.Builder()
                .withBegin(start)
                .withEnd(end)
                .withZoneId(TimeZones.getCurrent().toZoneId())
                .withTitle("ZKCAL-127")
                .withSclass("zkcal-127")
                .build();
        model.add(item);
    }

    private void addLongTextItem() {
        LocalDateTime start = LocalDateTime.of(2023, 1, 7, 0, 0);
        LocalDateTime end = start.plusHours(1);
        DefaultCalendarItem item = new DefaultCalendarItem.Builder()
                .withBegin(start)
                .withEnd(end)
                .withZoneId(TimeZones.getCurrent().toZoneId())
                .withTitle("ZKCAL-80 Calendar item text is cut if not enough space to display")
                .withSclass("zkcal-80")
                .build();
        model.add(item);
    }

    private void addColoredItems() {
        LocalDateTime start = LocalDateTime.of(2023, 1, 25, 0, 0);
        DefaultCalendarItem shortItem = new DefaultCalendarItem.Builder()
                .withBegin(start)
                .withEnd(start.plusHours(1))
                .withZoneId(TimeZones.getCurrent().toZoneId())
                .withTitle("ZKCAL-94 header content color")
                .withHeaderStyle("background: DarkGreen")
                .withSclass("color-short")
                .build();
        model.add(shortItem);

        DefaultCalendarItem colorSpan2dItem = new DefaultCalendarItem.Builder()
                .withBegin(start)
                .withEnd(start.plusDays(1).plusHours(2))
                .withZoneId(TimeZones.getCurrent().toZoneId())
                .withTitle("ZKCAL-94 header content color")
                .withHeaderStyle("background: DarkBlue")
                .withSclass("color-long")
                .build();
        model.add(colorSpan2dItem);
    }

    SimpleCalendarItem itemForChange = new SimpleCalendarItem();

    public void addItemForChanged() {
        //add a simple item at 2023-01-23 00:00
        LocalDateTime startDay = LocalDateTime.of(2023, 1, 23, 0, 0);
        itemForChange.setBeginDate(Date.from(startDay.atZone(calendars.getDefaultTimeZone().toZoneId()).toInstant()));
        itemForChange.setEndDate(Date.from(startDay.plusDays(1).plusHours(2).atZone(calendars.getDefaultTimeZone().toZoneId()).toInstant()));
        itemForChange.setSclass("for-change");
        itemForChange.setTitle("for change");
        model.add(itemForChange);
    }

    @Listen("onClick = #changeItem")
    public void changeItem() {
        itemForChange.setTitle("changed");
        model.update(itemForChange);
    }
}
