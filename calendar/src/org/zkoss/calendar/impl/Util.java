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

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.api.*;
import org.zkoss.json.JSONObject;
import org.zkoss.util.Locales;
import org.zkoss.xml.XMLs;

/**
 * @author Jimmy
 */
public class Util {

	private static final int ONE_HOUR = 60 * 60 * 1000;
	private static final SimpleDateFormat _sdfKey = new SimpleDateFormat("yyyy/MM/dd");
	
	public static String createEventTitle(DateFormatter df, Locale locale, TimeZone timezone, CalendarEvent ce) {
		if (df == null) return ce.getTitle();

		Date begin = ce.getBeginDate();
		Date end = ce.getEndDate();
		if (end.getTime() - begin.getTime() < ONE_HOUR) {
			return df.getCaptionByTimeOfDay(begin, locale, timezone) + " - "
					+ ce.getContent();
		} else
			return df.getCaptionByTimeOfDay(begin, locale, timezone) + " - "
					+ df.getCaptionByTimeOfDay(end, locale, timezone);
	}

	public static List packAllCaptionOfMonth(Calendars calendars, Calendar cal, Locale locale, TimeZone timezone, DateFormatter dfhandler) {
		int weeks = calendars.getWeekOfMonth();
		boolean isWeekOfYear = calendars.isWeekOfYear();		 
		 
		List result = new ArrayList();
		List list1 = new ArrayList();
		List list2 = new ArrayList();
		List list3 = new ArrayList();
		List list4 = new ArrayList();
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
		
	public static List packCaptionByDate(Calendar cal, int days, Locale locale, TimeZone timezone, DateFormatter dfhandler) {
		List result = new ArrayList();
		for (int j = 0; j < days; ++j) {
			result.add(dfhandler.getCaptionByDate(cal.getTime(), locale, timezone));
			cal.add(Calendar.DAY_OF_WEEK, 1);
		}
		return result;
	}
	
	public static List packCaptionByTimeOfDay(Calendar cal, Map zones, Locale locale, DateFormatter dfhandler) {
		List result = new ArrayList();
		for (Iterator it = zones.entrySet().iterator(); it.hasNext();) {
			TimeZone tz = (TimeZone) it.next();
			for(int k = 0; k < 24; k++) {
				cal.set(Calendar.HOUR_OF_DAY, k);				
				result.add(dfhandler.getCaptionByTimeOfDay(cal.getTime(), locale, tz));
			}
		}	
		return result;
	}
		
	public static List packZonesOffset(Map _tzones) {
		List result = new ArrayList();
		for (Iterator it = _tzones.keySet().iterator(); it.hasNext();)
			result.add("" + (((TimeZone) it.next()).getRawOffset()) / 60000);	
		return result;
	}
		
	public static String encloseEventList(Calendars calendars, Collection collection) {
		final StringBuffer sb = new StringBuffer().append('[');
		Date beginDate = calendars.getBeginDate();
		_sdfKey.setTimeZone(calendars.getDefaultTimeZone());
		for (Iterator it = collection.iterator(); it.hasNext();) {
			CalendarEvent ce = (CalendarEvent) it.next();
			String key = ce.getBeginDate().before(beginDate) ?
					getEventKey(beginDate): 
					getEventKey(ce.getBeginDate());
			appendEventByJSON(sb, calendars, key, ce);
		}		
		int len = sb.length();
		collection.clear();
		return sb.replace(len - 1, len, "]").toString();
	}
	
	public static String encloseList(Collection collection) {
		final StringBuffer sb = new StringBuffer().append("[\"");
		for (Iterator it = collection.iterator(); it.hasNext();)
			sb.append(it.next()).append("\",\"");
			
		int len = sb.length();
		return sb.replace(len - 2, len, "]").toString();
	}
		
	public static String encloseEventMap(Calendars calendars, Map  map) {
		final StringBuffer sb = new StringBuffer().append('[');
		int len;
		for (Iterator it = map.entrySet().iterator(); it.hasNext();) {
			Entry entry = (Entry) it.next();
			sb.append('[');
			String key = (String) entry.getKey();
			for (Iterator it2 = ((List)entry.getValue()).iterator(); it2.hasNext();) {
				appendEventByJSON(sb, calendars, key, (CalendarEvent) it2.next());
			}

			len = sb.length();
			sb.replace(len  - 1, len, "],");
		}

		len = sb.length();

		if(map.size() != 0)
			return sb.replace(len  - 1, len, "]").toString();
		return sb.append(']').toString();
	}

	private static void appendEventByJSON(StringBuffer sb, Calendars calendars, String key, CalendarEvent ce) {
		DateFormatter df = calendars.getDateFormatter();
		Locale locale = Locales.getCurrent();
		TimeZone timezone = calendars.getDefaultTimeZone();
		
		JSONObject json = new JSONObject();
		json.put("id", calendars.getCalendarEventId(ce));
		json.put("key", key);
		json.put("title", Util.createEventTitle(df, locale, timezone, ce));
		json.put("headerColor", ce.getHeaderColor());
		json.put("contentColor", ce.getContentColor());
		json.put("content", calendars.isEscapeXML() ? escapeXML(ce.getContent()): ce.getContent());
		json.put("beginDate", String.valueOf(getDSTTime(timezone, ce.getBeginDate())));
		json.put("endDate", String.valueOf(getDSTTime(timezone ,ce.getEndDate())));
		json.put("isLocked", String.valueOf(ce.isLocked()));
		json.put("zclass", ce.getZclass());
		
		sb.append(json.toString()).append(",");
	}
	
	/** 
	 * This method is missing in {@link XMLs}, unfortunatelly. 
	 * @param sb String Buffer where to write to.
	 * @param s String to escape.
	 * 
	 * @return {@code sb} parameter.
	 * 
	 * @see XMLs#escapeXML(char)
	 */
	public static String escapeXML( String s) {		
		StringBuffer sb = new StringBuffer();		
		if (s == null) return "";
		
		for (int j = 0, len = s.length(); j < len; ++j) {
			final char cc = s.charAt(j);
			final String esc = XMLs.escapeXML(cc);
			if (esc != null) sb.append(esc);
			else sb.append(cc);
		}
		
		return sb.toString();
	}
	
	public static long getDSTTime(TimeZone tz, Date date) {
		return date.getTime() + (tz.inDaylightTime(date) ? tz.getDSTSavings(): 0);
	}
	
	public static Date fixDSTTime(TimeZone tz, Date date) {
		return new Date(date.getTime() - (tz.inDaylightTime(date) ? tz.getDSTSavings(): 0));
	}
	
	private static String getEventKey(Date date) {
		return _sdfKey.format(date);
	}
		
}
