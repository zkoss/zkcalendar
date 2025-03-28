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
			CalendarItem ce = obj instanceof CalendarItem ? (CalendarItem)obj : null;
			
			if(ce == null) break;
			
			long b = ce.getBeginDate().getTime();
			long e = ce.getEndDate().getTime();
			if (e >= begin && b < end && ce.getContent().toLowerCase().contains(filterText.toLowerCase()))
				list.add(ce);
		}
		return list;
	}

}
