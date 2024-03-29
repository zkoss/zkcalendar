package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.DefaultCalendarItem;
import org.zkoss.calendar.impl.SimpleCalendarModel;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.Wire;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class RenderItemsComposer extends SelectorComposer {

    public static final String CONSECUTIVE = "consecutive";
    @Wire("calendars")
    private Calendars calendars;
    private SimpleCalendarModel model;
    private ZoneId defaultZoneId;
    private LocalDateTime day1;

    private void initModel() {
        model = new SimpleCalendarModel();
        addNonOverlappingItems();
        add3consecutiveItems();
        add3OverlappingItems();
        add1Overlap2Items();
        addConsecutiveOverlapping();
        addShortIntervalItem();
        addDaySpanItem();
    }

    private void addDaySpanItem() {
        LocalDateTime day6 = day1.plusDays(5);
        DefaultCalendarItem span2Item = new DefaultCalendarItem.Builder()
                .withTitle("span 2 days")
                .withContent("span 2 days")
                .withBegin(day6)
                .withEnd(day6.plusDays(1).plusHours(2))
                .withContentColor("blue")
                .withSclass("span2")
                .withZoneId(defaultZoneId)
                .build();
        model.add(span2Item);
        DefaultCalendarItem span3Item = new DefaultCalendarItem.Builder()
                .withTitle("span 3 days")
                .withContent("span 3 days")
                .withBegin(day1)
                .withEnd(day1.plusDays(2).plusHours(8))
                .withContentColor("red")
                .withSclass("span3")
                .withZoneId(defaultZoneId)
                .build();
        model.add(span3Item);

        LocalDateTime day7 = day1.plusDays(6);
        DefaultCalendarItem spanOverWeekendItem = new DefaultCalendarItem.Builder()
                .withContent("span over weekend")
                .withBegin(day7)
                .withEnd(day7.plusDays(3).plusHours(8))
                .withContentColor("orange")
                .withZoneId(defaultZoneId)
                .build();
        model.add(spanOverWeekendItem);
    }

    private void addShortIntervalItem() {
        LocalDateTime day6 = day1.plusDays(5);
        DefaultCalendarItem instantItem = new DefaultCalendarItem.Builder()
                .withBegin(day6)
                .withEnd(day6)
                .withSclass("instant")
                .withZoneId(defaultZoneId)
                .build();
        model.add(instantItem);
        DefaultCalendarItem halfHourItem = new DefaultCalendarItem.Builder()
                .withBegin(day6)
                .withEnd(day6.plusMinutes(30))
                .withZoneId(defaultZoneId)
                .withSclass("half-hour")
                .build();
        model.add(halfHourItem);

        DefaultCalendarItem tenMinuteItem = new DefaultCalendarItem.Builder()
                .withBegin(day6.plusHours(2))
                .withEnd(day6.plusHours(2).plusMinutes(10))
                .withZoneId(defaultZoneId)
                .withSclass("10minute")
                .build();
        model.add(tenMinuteItem);

    }

    private void addNonOverlappingItems() {
        DefaultCalendarItem nonOverlappedItem = new DefaultCalendarItem.Builder()
                .withTitle("non overlapped")
                .withContent("my content")
                .withBegin(day1.withHour(0))
                .withEnd(day1.withHour(1))
                .withSclass("separate")
                .withZoneId(defaultZoneId)
                .build();
        model.add(nonOverlappedItem);

        DefaultCalendarItem colorItem = new DefaultCalendarItem.Builder()
                .withTitle("blue")
                .withContent("yellow")
                .withBegin(day1.withHour(2))
                .withEnd(day1.withHour(4))
                .withHeaderColor("blue")
                .withContentColor("yellow")
                .withSclass("colored")
                .withZoneId(defaultZoneId)
                .build();
        model.add(colorItem);
    }

    /* 1st and 2nd items are consecutive items
    *  2nd and 3rd items are overlapping*/
    private void addConsecutiveOverlapping() {
        LocalDateTime day4 = day1.plusDays(3);
        DefaultCalendarItem item1 = new DefaultCalendarItem.Builder()
                .withBegin(day4.withHour(0))
                .withEnd(day4.withHour(1))
                .withZoneId(defaultZoneId)
                .build();
        DefaultCalendarItem item2 = new DefaultCalendarItem.Builder()
                .withBegin(day4.withHour(1))
                .withEnd(day4.withHour(2))
                .withZoneId(defaultZoneId)
                .build();
        DefaultCalendarItem item3 = new DefaultCalendarItem.Builder()
                .withBegin(day4.withHour(1))
                .withEnd(day4.withHour(2))
                .withZoneId(defaultZoneId)
                .build();

        model.add(item1);
        model.add(item2);
        model.add(item3);
    }


    private void add3consecutiveItems() {
        LocalDateTime day5 = day1.plusDays(4);
        DefaultCalendarItem calendarItem = new DefaultCalendarItem.Builder()
                .withContent("1hour 1")
                .withBegin(day5.withHour(2))
                .withEnd(day5.withHour(3))
                .withZoneId(defaultZoneId)
                .withSclass(CONSECUTIVE)
                .build();
        DefaultCalendarItem calendarItem2 = new DefaultCalendarItem.Builder()
                .withContent("1hour 2")
                .withBegin(day5.withHour(3))
                .withEnd(day5.withHour(4))
                .withSclass(CONSECUTIVE)
                .withZoneId(defaultZoneId)
                .build();
        DefaultCalendarItem calendarItem3 = new DefaultCalendarItem.Builder()
                .withContent("1hour 3")
                .withBegin(day5.withHour(4))
                .withEnd(day5.withHour(5))
                .withSclass(CONSECUTIVE)
                .withZoneId(defaultZoneId)
                .build();
        model.add(calendarItem);

        model.add(calendarItem2);
        model.add(calendarItem3);
    }

    private void add1Overlap2Items() {
        //overlap 2 item in the middle
        LocalDateTime day3 = day1.plusDays(2);
        model.add(new DefaultCalendarItem.Builder()
                .withBegin(day3.withHour(1))
                .withEnd(day3.withHour(3))
                .withSclass("2overlapping")
                .withZoneId(defaultZoneId)
                .build());
        model.add(new DefaultCalendarItem.Builder()
                .withBegin(day3.withHour(2))
                .withEnd(day3.withHour(5))
                .withSclass("2overlapping")
                .withZoneId(defaultZoneId)
                .build());
        model.add(new DefaultCalendarItem.Builder()
                .withBegin(day3.withHour(4))
                .withEnd(day3.withHour(6))
                .withSclass("2overlapping")
                .withZoneId(defaultZoneId)
                .build());
    }

    private void add3OverlappingItems() {
        LocalDateTime day2 = day1.plusDays(1);
        DefaultCalendarItem overlappedItem1 = new DefaultCalendarItem.Builder()
                .withBegin(day2.withHour(1))
                .withEnd(day2.withHour(4))
                .withZoneId(defaultZoneId)
                .withSclass("3overlapping")
                .build();
        DefaultCalendarItem overlappedItem2 = new DefaultCalendarItem.Builder()
                .withBegin(day2.withHour(2))
                .withEnd(day2.withHour(4))
                .withZoneId(defaultZoneId)
                .withSclass("3overlapping")
                .build();
        DefaultCalendarItem overlappedItem3 = new DefaultCalendarItem.Builder()
                .withBegin(day2.withHour(3))
                .withEnd(day2.withHour(4))
                .withZoneId(defaultZoneId)
                .withSclass("3overlapping")
                .build();

        model.add(overlappedItem1);
        model.add(overlappedItem2);
        model.add(overlappedItem3);
    }

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        defaultZoneId = calendars.getDefaultTimeZone().toZoneId();
        day1 = LocalDateTime.of(2023, 1, 1, 0, 0);
        calendars.setCurrentDate(Date.from(day1.atZone(defaultZoneId).toInstant()));
        initModel();
        calendars.setModel(model);
    }

    private DefaultCalendarItem selectedItem;
    @Listen(CalendarsEvent.ON_ITEM_UPDATE + " = calendars")
    public void move(CalendarsEvent event) {
        selectedItem = (DefaultCalendarItem) event.getCalendarItem();
        model.remove(selectedItem);

        DefaultCalendarItem movedItem = new CalendarItemHelper(selectedItem)
                .setBegin(event.getBeginDate().toInstant())
                .setEnd(event.getEndDate().toInstant())
                .build();
        model.add(movedItem);
    }

    @Listen(Events.ON_CLICK + " = #previous")
    public void previous(){
        calendars.previousPage();
    }

    @Listen(Events.ON_CLICK + " = #next")
    public void next(){
        calendars.nextPage();
    }

    @Listen(CalendarsEvent.ON_DAY_CLICK + "=calendars")
    public void toOneDayView(Event event){
        Date clickedDate = (Date) event.getData();
        calendars.setDays(1);
        calendars.setCurrentDate(clickedDate);
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
