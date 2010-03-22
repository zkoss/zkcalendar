/* Util.java

Purpose:
		
	Description:
		
	History:
		Thu Jan 28 19:32:58 TST 2010, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
package org.zkoss.calendar.impl;

import java.util.*;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.api.*;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.json.JSONArray;
import org.zkoss.json.JSONObject;
import org.zkoss.lang.Objects;
import org.zkoss.util.Locales;
import org.zkoss.zk.au.AuRequest;
import org.zkoss.zk.mesg.MZk;
import org.zkoss.zk.ui.UiException;

/**
 * @author Jimmy
 * 
 *         2010
 */
public class Util {

	public static String createEventTitle(DateFormatter df, Locale locale, TimeZone timezone, CalendarEvent ce) {
		if (df == null) return ce.getTitle();

		Date begin = ce.getBeginDate();
		Date end = ce.getEndDate();
		if (end.getTime() - begin.getTime() < 60 * 60 * 1000) {
			return df.getCaptionByTimeOfDay(begin, locale, timezone) + " - "
					+ ce.getContent();
		} else
			return df.getCaptionByTimeOfDay(begin, locale, timezone) + " - "
					+ df.getCaptionByTimeOfDay(end, locale, timezone);
	}

	public static List<List<String>> packAllCaptionOfMonth(Calendars calendars, Calendar cal, Locale locale, TimeZone timezone, DateFormatter dfhandler) {
		int weeks = calendars.getWeekOfMonth();
		boolean isWeekOfYear = calendars.isWeekOfYear();		 
		 
		List<List<String>> result = new ArrayList<List<String>>();
		List<String> list1 = new ArrayList<String>();
		List<String> list2 = new ArrayList<String>();
		List<String> list3 = new ArrayList<String>();
		List<String> list4 = new ArrayList<String>();
		result.add(list1);
		result.add(list2);
		result.add(list3);
		result.add(list4);
		
		int count = 0;
		
		for (int j = 0; j < weeks; j++) {
			if (isWeekOfYear)
				list4.add(dfhandler.getCaptionByWeekOfYear(cal.getTime(), locale, timezone));
			
			for (int i = 0; i < 7; i++) {
				if (count < 7){
					count++;
					list1.add(dfhandler.getCaptionByDayOfWeek(cal.getTime(), locale, timezone));
				}
				cal.set(Calendar.MILLISECOND, 0);
				Date d = cal.getTime();
				list2.add(dfhandler.getCaptionByPopup(d, locale, timezone));
				list3.add(dfhandler.getCaptionByDateOfMonth(d, locale, timezone));
				cal.add(Calendar.DAY_OF_MONTH, 1);
			}			
		}
		return result;
	}
		
	public static List<String> packCaptionByDate(Calendar cal, int days, Locale locale, TimeZone timezone, DateFormatter dfhandler) {
		List<String> result = new ArrayList<String>();
		for (int j = 0; j < days; ++j) {
			result.add(dfhandler.getCaptionByDate(cal.getTime(), locale, timezone));
			cal.add(Calendar.DAY_OF_WEEK, 1);
		}
		return result;
	}
	
	public static List<String> packCaptionByTimeOfDay(Calendar cal, Map<TimeZone, String> zones, Locale locale, DateFormatter dfhandler) {
		List<String> result = new ArrayList<String>();		
		for (TimeZone tz : zones.keySet()) {
			for(int k = 0; k < 24; k++) {
				cal.set(Calendar.HOUR_OF_DAY, k);				
				result.add(dfhandler.getCaptionByTimeOfDay(cal.getTime(), locale, tz));
			}
		}	
		return result;
	}
		
	public static List<String> packZonesOffset(Map<TimeZone, String> _tzones) {
		List<String> result = new ArrayList<String>();		
		for (TimeZone tz : _tzones.keySet())
			result.add("" + (tz.getRawOffset() + (tz.useDaylightTime() ? tz.getDSTSavings() : 0)) / 60000);	
		return result;
	}
		
	public static Calendars verifyEvent(Calendars calendars, AuRequest request, JSONArray data, int size) {
		final Calendars cmp = (Calendars)request.getComponent();
		if (cmp == null)
			throw new UiException(MZk.ILLEGAL_REQUEST_COMPONENT_REQUIRED, calendars);

		if (data == null || data.size() != size)
			throw new UiException(MZk.ILLEGAL_REQUEST_WRONG_DATA, new Object[] {
					Objects.toString(data), calendars });
		return cmp;
	}
	
	public static CalendarsEvent createCalendarsEvent(String evtName, Calendars cmp, CalendarEvent ce, JSONArray data) {	
		
//		onEventCreate	012345
//		onEventEdit		xx1234
//		onEventUpdate	123456
		Date beginDate = null, endDate = null;
		
		int i = 0;
		if (evtName.equals("onEventEdit")) i++;
		else {
			if (evtName.equals("onEventUpdate")) i++;
			beginDate = new Date(Long.parseLong(String.valueOf(data.get(i++))));
			endDate = new Date(Long.parseLong(String.valueOf(data.get(i++))));
		}
		
		int x = Integer.parseInt(String.valueOf(data.get(i++)));
		int y = Integer.parseInt(String.valueOf(data.get(i++)));
		int dtwd = Integer.parseInt(String.valueOf(data.get(i)));
		int dthgh = Integer.parseInt(String.valueOf(data.get(i)));
		
		return new CalendarsEvent(evtName, cmp, ce, beginDate, endDate, x, y, dtwd, dthgh);
	}

		
	public static String encloseEventList(Calendars calendars, Collection<CalendarEvent> collection) {
		final StringBuffer sb = new StringBuffer().append('[');
		for (CalendarEvent ce : collection) {
			appendEventByJSON(sb, calendars, ce);
		}		
		int len = sb.length();
		collection.clear();
		return sb.replace(len - 1, len, "]").toString();
	}
	
	public static String encloseList(Collection<String> collection) {
		final StringBuffer sb = new StringBuffer().append("[\"");
		
		for (String string : collection) 
			sb.append(string).append("\",\"");	
		int len = sb.length();
		return sb.replace(len - 2, len, "]").toString();
	}
		
	public static String encloseEventMap(Calendars calendars, Collection<List<CalendarEvent>> collection) {
		final StringBuffer sb = new StringBuffer().append('[');
		int len;
		for (List<CalendarEvent> list : collection) {
			sb.append('[');
			for (CalendarEvent ce : list) {				
				appendEventByJSON(sb, calendars, ce);
			}

			len = sb.length();
			sb.replace(len  - 1, len, "],");
		}

		len = sb.length();

		if(collection.size() != 0)
			return sb.replace(len  - 1, len, "]").toString();
		return sb.append(']').toString();
	}

	@SuppressWarnings("unchecked")
	private static void appendEventByJSON(StringBuffer sb, Calendars calendars, CalendarEvent ce) {
		DateFormatter df = calendars.getDateFormatter();
		Locale locale = Locales.getCurrent();
		TimeZone timezone = calendars.getDefaultTimeZone();
		
		JSONObject json = new JSONObject();
		json.put("id", calendars.getCalendarEventId(ce));
		json.put("title", Util.createEventTitle(df, locale, timezone, ce));
		json.put("headerColor", ce.getHeaderColor());
		json.put("contentColor", ce.getContentColor());
		json.put("content", ce.getContent());
		json.put("beginDate", String.valueOf(ce.getBeginDate().getTime()));
		json.put("endDate", String.valueOf(ce.getEndDate().getTime()));
		json.put("isLocked", String.valueOf(ce.isLocked()));
		json.put("zclass", ce.getZclass());
		
		sb.append(json.toString()).append(",");		
	}
		
}
