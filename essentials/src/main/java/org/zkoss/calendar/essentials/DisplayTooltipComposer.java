package org.zkoss.calendar.essentials;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;
import org.zkoss.zul.Label;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * An example to show tooltips on Calendar items.
 */
public class DisplayTooltipComposer extends SelectorComposer {

    @Wire("calendars")
    private Calendars calendars;
    @Wire
    public Label tooltipText;
    private SimpleCalendarModel model;

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        initModel();
        calendars.setModel(model);
    }

    private void initModel() {
        CalendarItemGenerator.zoneId = calendars.getDefaultTimeZone().toZoneId();
        model = new SimpleCalendarModel(CalendarItemGenerator.generateList());
        DefaultCalendarItem calendarItem = new DefaultCalendarItem.Builder()
                .withTitle("my title")
                .withContent("my content")
                .withBegin(LocalDateTime.now().truncatedTo(ChronoUnit.HOURS))
                .withEnd(LocalDateTime.now().truncatedTo(ChronoUnit.HOURS).plusHours(2))
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .build();
        model.add(calendarItem);
    }

    @Listen(CalendarsEvent.ON_ITEM_TOOLTIP +"= calendars")
    public void showTooltip(CalendarsEvent event) {
        tooltipText.setValue(event.getCalendarItem().getTitle() + "-" + event.getCalendarItem().getContent());
    }
}
