package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.DefaultCalendarItem;
import org.zkoss.calendar.impl.SimpleCalendarModel;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.Wire;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class RenderItemsComposer extends SelectorComposer {

    public static final String CONTINUOUS = "continuous";
    @Wire("calendars")
    private Calendars calendars;
    private SimpleCalendarModel model;
    private void initModel() {
        model = new SimpleCalendarModel();
        LocalDateTime todayHour = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS);
        DefaultCalendarItem nonOverlappedItem = new DefaultCalendarItem.Builder()
                .withTitle("non overlapped")
                .withContent("my content")
                .withBegin(todayHour.withHour(0))
                .withEnd(todayHour.withHour(1))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .build();

        DefaultCalendarItem calendarItem = new DefaultCalendarItem.Builder()
                .withTitle("one hour item 1")
                .withContent("my content")
                .withBegin(todayHour.withHour(2))
                .withEnd(todayHour.withHour(3))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withSclass(CONTINUOUS)
                .build();
        DefaultCalendarItem calendarItem2 = new DefaultCalendarItem.Builder()
                .withTitle("one hour item 2")
                .withContent("my content2")
                .withBegin(todayHour.withHour(3))
                .withEnd(todayHour.withHour(4))
                .withSclass(CONTINUOUS)
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .build();
        DefaultCalendarItem calendarItem3 = new DefaultCalendarItem.Builder()
                .withTitle("one hour item 3")
                .withContent("my content3")
                .withBegin(todayHour.withHour(4))
                .withEnd(todayHour.withHour(5))
                .withSclass(CONTINUOUS)
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .build();
        model.add(nonOverlappedItem);
        model.add(calendarItem);
        model.add(calendarItem2);
        model.add(calendarItem3);

        DefaultCalendarItem overlappedItem1 = new DefaultCalendarItem.Builder()
                .withTitle("overlapped 6-8")
                .withContent("my content3")
                .withBegin(todayHour.withHour(6))
                .withEnd(todayHour.withHour(8))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .build();
        DefaultCalendarItem overlappedItem2 = new DefaultCalendarItem.Builder()
                .withTitle("overlapped 7-8")
                .withContent("my content3")
                .withBegin(todayHour.withHour(7))
                .withEnd(todayHour.withHour(8))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .build();

        model.add(overlappedItem1);
        model.add(overlappedItem2);

    }

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        initModel();
        calendars.setModel(model);
    }


    @Listen(Events.ON_CLICK + " = #previous")
    public void previous(){
        calendars.previousPage();
    }

    @Listen(Events.ON_CLICK + " = #next")
    public void next(){
        calendars.nextPage();
    }
}
