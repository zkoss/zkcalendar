package org.zkoss.calendar.demo;

import org.zkoss.calendar.api.*;
import org.zkoss.calendar.impl.SimpleCalendarModel;

import java.util.*;

public class FilteringCalendarModel extends SimpleCalendarModel {
    private static final long serialVersionUID = 1L;

    private String filterText = "";

    public FilteringCalendarModel(List<CalendarItem> calendarEvents) {
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
            if (e >= begin
                && b < end
                && item.getTitle().toLowerCase().contains(filterText.toLowerCase()))
                list.add(item);
        }
        return list;
    }

}
