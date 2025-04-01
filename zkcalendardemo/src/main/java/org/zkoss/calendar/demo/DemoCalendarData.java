package org.zkoss.calendar.demo;

import org.zkoss.calendar.api.CalendarItem;
import org.zkoss.calendar.impl.SimpleCalendarItem;

import java.text.*;
import java.util.*;


public class DemoCalendarData {

	private List<CalendarItem> calendarEvents = new LinkedList<>();
	private final SimpleDateFormat DATA_FORMAT = new SimpleDateFormat("yyyy/MM/dd HH:mm");
	private Calendar cal = Calendar.getInstance();

	public DemoCalendarData() {
		init();
	}

	private void init() {
		int mod = cal.get(Calendar.MONTH) + 1;
		int year = cal.get(Calendar.YEAR);
		String date2 = mod > 9 ? year + "/" + mod + "" : year + "/" + "0" + mod;
		String date1 = --mod > 9 ? year + "/" + mod + "" : year + "/" + "0" + mod;
		++mod;
		String date3 = ++mod > 9 ? year + "/" + mod + "" : year + "/" + "0" + mod;
		//DefaultCalendarItem doesn't have no-arg constructor, so we use SimpleCalendarItem for form binding
		// Red Events
		calendarEvents.add(new SimpleCalendarItem("ZK Jet Released", "", "", "background-color:#D96666", "background-color:#A32929", false, getDate(date1 + "/28 00:00"), getDate(date1 + "/29 00:00")));
		calendarEvents.add(new SimpleCalendarItem("Experience ZK SpreadSheet Live Demo!", "", "", "background-color:#D96666", "background-color:#A32929", false, getDate(date1 + "/04 02:00"), getDate(date1 + "/05 03:00")));
		calendarEvents.add(new SimpleCalendarItem("New Features of ZK Spreadsheet", "", "", "background-color:#D96666", "background-color:#A32929", false, getDate(date2 + "/21 05:00"), getDate(date2 + "/21 07:00")));
		calendarEvents.add(new SimpleCalendarItem("ZK Spreadsheet Released", "", "", "background-color:#D96666", "background-color:#A32929", false, getDate(date2 + "/08 00:00"), getDate(date2 + "/09 00:00")));
		// Blue Events
		calendarEvents.add(new SimpleCalendarItem("ZK Released", "", "", "background-color:#668CD9", "background-color:#3467CE", false, getDate(date1 + "/29 03:00"), getDate(date2 + "/02 06:00")));
		calendarEvents.add(new SimpleCalendarItem("New Feature of ZK ", "", "", "background-color:#668CD9", "background-color:#3467CE", false, getDate(date2 + "/02 10:00"), getDate(date2 + "/02 12:30")));
		calendarEvents.add(new SimpleCalendarItem("Case Study - Mecatena", "", "", "background-color:#668CD9", "background-color:#3467CE", false, getDate(date2 + "/17 14:00"), getDate(date2 + "/18 16:00")));
		calendarEvents.add(new SimpleCalendarItem("ZK Unit Testing Project - zunit", "", "", "background-color:#668CD9", "background-color:#3467CE", false, getDate(date3 + "/01 14:30"), getDate(date3 + "/01 17:30")));
		// Purple Events
		calendarEvents.add(new SimpleCalendarItem("ZK Studio released", "", "", "background-color:#B373B3", "background-color:#7A367A", false, getDate(date1 + "/29 08:00"), getDate(date2 + "/03 12:00")));
		calendarEvents.add(new SimpleCalendarItem("Tutorial : Reading from the DB with Netbeans and ZK", "", "", "background-color:#B373B3", "background-color:#7A367A", false, getDate(date2 + "/07 08:00"), getDate(date2 + "/07 12:00")));
		calendarEvents.add(new SimpleCalendarItem("Small talk - ZK Charts", "", "", "background-color:#B373B3", "background-color:#7A367A", false, getDate(date2 + "/13 11:00"), getDate(date2 + "/13 14:30")));
		calendarEvents.add(new SimpleCalendarItem("Style Guide for ZK released !", "", "", "background-color:#B373B3", "background-color:#7A367A", false, getDate(date2 + "/16 14:00"), getDate(date2 + "/18 16:00")));
		calendarEvents.add(new SimpleCalendarItem("Small talk -- Simple Database Access From ZK", "", "", "background-color:#B373B3", "background-color:#7A367A", false, getDate(date3 + "/02 12:00"), getDate(date3 + "/02 17:00")));
		// Khaki Events
		calendarEvents.add(new SimpleCalendarItem("ZK UK User Group", "", "", "background-color:#BFBF4D", "background-color:#88880E", false, getDate(date1 + "/03 00:00"), getDate(date1 + "/04 00:00")));
		calendarEvents.add(new SimpleCalendarItem("How to Test ZK Application with Selenium", "", "", "background-color:#BFBF4D", "background-color:#88880E", false, getDate(date2 + "/13 05:00"), getDate(date2 + "/13 07:00")));
		calendarEvents.add(new SimpleCalendarItem("ZK Alfresco Talk", "", "", "background-color:#BFBF4D", "background-color:#88880E", false, getDate(date2 + "/24 19:30"), getDate(date2 + "/24 20:00")));
		calendarEvents.add(new SimpleCalendarItem("ZK selected as SourceForge.net Project of the Month", "", "", "background-color:#BFBF4D", "background-color:#88880E", false, getDate(date3 + "/03 00:00"), getDate(date3 + "/04 00:00")));
		// Green Events
		calendarEvents.add(new SimpleCalendarItem("ZK Mobile Released", "", "", "background-color:#4CB052", "background-color:#0D7813", false, getDate(date1 + "/28 10:00"), getDate(date1 + "/28 12:30")));
		calendarEvents.add(new SimpleCalendarItem("ZK Gmaps released", "", "", "background-color:#4CB052", "background-color:#0D7813", false, getDate(date2 + "/03 00:00"), getDate(date2 + "/03 05:30")));
		calendarEvents.add(new SimpleCalendarItem("Refresh with Five New ZK Themes!", "", "", "background-color:#4CB052", "background-color:#0D7813", false, getDate(date2 + "/05 20:30"), getDate(date2 + "/06 00:00")));
		calendarEvents.add(new SimpleCalendarItem("ZK Roadmap Announced", "", "", "background-color:#4CB052", "background-color:#0D7813", false, getDate(date2 + "/23 00:00"), getDate(date2 + "/25 16:30")));
		calendarEvents.add(new SimpleCalendarItem("Build Database CRUD Application in 6 Steps", "", "", "background-color:#4CB052", "background-color:#0D7813", false, getDate(date3 + "/01 08:30"), getDate(date3 + "/01 19:30")));
	}

	private Date getDate(String dateText) {
		try {
			return DATA_FORMAT.parse(dateText);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	public List<CalendarItem> getCalendarEvents() {
		return calendarEvents;
	}
}
