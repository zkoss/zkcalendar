package org.zkoss.calendar.demo;

import org.zkoss.calendar.api.*;
import org.zkoss.calendar.impl.SimpleCalendarModel;

import java.util.*;

public class DemoCalendarModel extends SimpleCalendarModel {
    private static final long serialVersionUID = 1L;

    private String filterText = "";

    public DemoCalendarModel(List<CalendarItem> calendarEvents) {
        super(calendarEvents);
    }

    public void setFilterText(String filterText) {
        this.filterText = filterText;
    }

    @Override
    public List<CalendarItem> get(Date beginDate, Date endDate, RenderContext rc) {
        List<CalendarItem> list = new LinkedList<CalendarItem>();
        long begin = beginDate.getTime();
        long end = endDate.getTime();

        for (Iterator<?> itr = _list.iterator(); itr.hasNext();) {
            Object obj = itr.next();
            CalendarItem item = obj instanceof CalendarItem ? (CalendarItem) obj : null;

            if (item == null) break;

            long b = item.getBeginDate().getTime();
            long e = item.getEndDate().getTime();
            if (e >= begin && b < end && item.getContent().toLowerCase().contains(filterText.toLowerCase()))
                list.add(item);
        }
        return list;
    }

}
