package org.zkoss.calendar.essentials;

import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Listen;

import java.util.Optional;

import static org.zkoss.calendar.event.CalendarsEvent.*;

public class EventListenerComposer extends SelectorComposer {

    @Listen(ON_ITEM_CREATE + "=calendars;"
            + ON_ITEM_EDIT + "=calendars;"
            + ON_ITEM_UPDATE + "=calendars;"
            + ON_ITEM_TOOLTIP + "=calendars")
    public void itemListener(CalendarsEvent event) {

        System.out.println("Event: " + event.getName());
        System.out.println(Optional.ofNullable(event.getBeginDate()).orElse(null)
                + " - " + Optional.ofNullable(event.getEndDate()).orElse(null));

    }

    @Listen(ON_WEEK_CLICK + "=calendars;"
            + ON_DAY_CLICK + "=calendars")
    public void onClick(Event event) {
        System.out.println("Event: " + event.getName());
    }

}
