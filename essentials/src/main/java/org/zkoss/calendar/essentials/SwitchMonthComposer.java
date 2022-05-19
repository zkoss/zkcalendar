package org.zkoss.calendar.essentials;

import org.zkoss.calendar.Calendars;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;

public class SwitchMonthComposer extends SelectorComposer {

    @Wire("calendars")
    private Calendars calendars;

    @Listen(Events.ON_CLICK + " = #previous")
    public void previous(){
        calendars.previousPage();
    }

    @Listen(Events.ON_CLICK + " = #next")
    public void next(){
        calendars.nextPage();
    }
}
