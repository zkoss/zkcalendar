package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.api.CalendarItem;
import org.zkoss.calendar.event.*;
import org.zkoss.calendar.impl.DefaultCalendarItem;
import org.zkoss.calendar.impl.SimpleCalendarModel;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.Wire;
import org.zkoss.zul.Label;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

public class EventComposer extends SelectorComposer {

    @Wire("calendars")
    private Calendars calendars;
    @Wire
    private Label firedEvent;
    private SimpleCalendarModel model;
    private ZoneId defaultZoneId;
    private LocalDateTime day1 = LocalDateTime.of(2023,1,1,0,0);

    private void initModel() {
        defaultZoneId = calendars.getDefaultTimeZone().toZoneId();
        model = new SimpleCalendarModel();
        addNonOverlappingItems();
        calendars.setModel(model);
    }

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        calendars.setCurrentDate(Date.from(day1.atZone(calendars.getDefaultTimeZone().toZoneId()).toInstant()));
        initModel();
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

    @Listen(CalendarsEvent.ON_ITEM_CREATE + "=calendars;" +
            CalendarsEvent.ON_ITEM_EDIT + "=calendars;" +
            CalendarsEvent.ON_ITEM_UPDATE + "=calendars")
    public void itemEventListener(CalendarsEvent event){
        String eventContent = String.format("%s %s %s %s",
                event.getName(),
                Optional.ofNullable(event.getCalendarItem()).map(CalendarItem::getTitle).orElse(""),
                event.getBeginDate(), event.getEndDate());
        firedEvent.setValue(eventContent);
    }

    @Listen("onDrop = calendars")
    public void handleDrop(CalendarDropEvent event){
        String eventContent = String.format("%s %s",
                Optional.ofNullable(event.getCalendarEvent()).map(CalendarItem::getTitle).orElse("non-item"),
                event.getDate());
        firedEvent.setValue(eventContent);
    }
}
