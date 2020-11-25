/* Cal76Controller.java

		Purpose:
		
		Description:
		
		History:
				Wed Nov 25 16:02:30 CST 2020, Created by leon

Copyright (C) 2020 Potix Corporation. All Rights Reserved.
*/
package test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.SimpleCalendarEvent;
import org.zkoss.calendar.impl.SimpleCalendarModel;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.Page;
import org.zkoss.zk.ui.metainfo.ComponentInfo;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.Wire;

public class Cal76Controller extends SelectorComposer {

	@Wire("#calendars")
	private Calendars zkcalendar;
	private SimpleCalendarModel model;

	public ComponentInfo doBeforeCompose(Page page, Component parent,
										 ComponentInfo compInfo) {
		initTimeDropdown(page);
		// prepare model data
		initCalendarModel(page);
		return super.doBeforeCompose(page, parent, compInfo);
	}

	@Override
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		zkcalendar.setModel(model);
		add();
	}

	private void add(){
		SimpleCalendarEvent event1 = new SimpleCalendarEvent();
		java.util.Calendar calendar  = java.util.Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, 8);
		calendar.set(Calendar.MINUTE, 40);
		event1.setBeginDate(calendar.getTime());
		calendar.set(Calendar.HOUR_OF_DAY, 10);
		calendar.set(Calendar.MINUTE, 20);
		event1.setEndDate(calendar.getTime());
		model.add(event1);

		SimpleCalendarEvent event2 = new SimpleCalendarEvent();
		calendar.set(Calendar.HOUR_OF_DAY, 10);
		calendar.set(Calendar.MINUTE, 0);
		event2.setBeginDate(calendar.getTime());
		calendar.set(Calendar.HOUR_OF_DAY, 12);
		calendar.set(Calendar.MINUTE, 0);
		event2.setEndDate(calendar.getTime());
		model.add(event2);

		SimpleCalendarEvent event3 = new SimpleCalendarEvent();
		calendar.set(Calendar.HOUR_OF_DAY, 12);
		calendar.set(Calendar.MINUTE, 30);
		event3.setBeginDate(calendar.getTime());
		calendar.add(Calendar.HOUR_OF_DAY, 48);
		event3.setEndDate(calendar.getTime());
		event3.setContent("Origin cross day style");
		model.add(event3);
	}

	private void initTimeDropdown(Page page) {
		List dateTime = new LinkedList();

		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);

		for (int i = 0; i < 288; i++) {
			dateTime.add(sdf.format(calendar.getTime()));
			calendar.add(Calendar.MINUTE, 5);
		}
		page.setAttribute("dateTime", dateTime);
	}

	private void initCalendarModel(Page page) {
		SimpleDateFormat dataSDF = new SimpleDateFormat("yyyy/MM/dd HH:mm");
		Calendar cal = Calendar.getInstance();
		int mod = cal.get(Calendar.MONTH) + 1;
		int year = cal.get(Calendar.YEAR);
		String date2 = mod > 9 ? year + "/" + mod + "" :  year + "/" + "0" + mod;
		String date1 = --mod > 9 ?  year + "/" + mod + "" :  year + "/" + "0" + mod;
		++mod;
		String date3 = ++mod > 9 ?  year + "/" + mod + "" :  year + "/" + "0" + mod;
		String[][] evts = {
				// Red Events
				{date1 + "/28 00:00", date1 + "/29 00:00", "#A32929", "#D96666", "ZK Jet Released"},
				{date1 + "/04 02:00", date1 + "/05 03:00", "#A32929", "#D96666", "Experience ZK SpreadSheet Live Demo!"},
				{date2 + "/12 10:00", date2 + "/12 20:00", "#A32929", "#D96666", "SF 2009 CCA Open: Nominate ZK Now!"},
				{date2 + "/21 05:00", date2 + "/21 07:00", "#A32929", "#D96666", "New Features of ZK Spreadsheet 1.0.0 RC2"},
				{date2 + "/08 00:00", date2 + "/09 00:00", "#A32929", "#D96666", "ZK Spreadsheet 1.0.0 RC2 Released"},
				// Blue Events
				{date1 + "/29 03:00", date2 + "/02 06:00", "#3467CE", "#668CD9", "ZK 3.6.1 Released"},
				{date2 + "/02 10:00", date2 + "/02 12:30", "#3467CE", "#668CD9", "New Feature of ZK 3.6.1"},
				{date2 + "/17 14:00", date2 + "/30 16:00", "#3467CE", "#668CD9", "Case Study - Mecatena"},
				{date2 + "/26 00:00", date2 + "/27 00:00", "#3467CE", "#668CD9", "Small talk: A Preview Of ZK Spreadsheet 1.0"},
				{date3 + "/01 14:30", date3 + "/01 17:30", "#3467CE", "#668CD9", "ZK Unit Testing Project - zunit"},
				// Purple Events
				{date1 + "/29 08:00", date2 + "/03 12:00", "#7A367A", "#B373B3", "ZK Studio 0.9.3 released"},
				{date2 + "/07 08:00", date2 + "/07 12:00", "#7A367A", "#B373B3", "Tutorial : Reading from the DB with Netbeans and ZK"},
				{date2 + "/13 11:00", date2 + "/13 14:30", "#7A367A", "#B373B3", "Small talk - ZK Charts"},
				{date2 + "/16 14:00", date2 + "/18 16:00", "#7A367A", "#B373B3", "Style Guide for ZK 3.6 released !"},
				{date3 + "/02 12:00", date3 + "/02 17:00", "#7A367A", "#B373B3", "Small talk -- Simple Database Access From ZK"},
				// Khaki Events
				{date1 + "/03 00:00", date1 + "/04 00:00", "#88880E", "#BFBF4D", "ZK 3.6.0 Released !"},
				{date2 + "/04 00:00", date2 + "/07 00:00", "#88880E", "#BFBF4D", "Sun Microsystems Recruiting"},
				{date2 + "/13 05:00", date2 + "/13 07:00", "#88880E", "#BFBF4D", "How to Test ZK Application with Selenium"},
				{date2 + "/24 19:30", date2 + "/24 20:00", "#88880E", "#BFBF4D", "ZK Alfresco Talk"},
				{date3 + "/03 00:00", date3 + "/04 00:00", "#88880E", "#BFBF4D", "ZK selected as SourceForge.net Project of the Month"},
				// Green Events
				{date1 + "/28 10:00", date1 + "/28 12:30", "#0D7813", "#4CB052", "ZK Mobile 0.8.10 Released"},
				{date2 + "/03 00:00", date2 + "/03 05:30", "#0D7813", "#4CB052", "ZK Gmaps 2.0_11 released"},
				{date2 + "/05 20:30", date2 + "/06 00:00", "#0D7813", "#4CB052", "Refresh with Five New ZK Themes!"},
				{date2 + "/23 00:00", date2 + "/25 16:30", "#0D7813", "#4CB052", "ZK Roadmap 2009 Announced"},
				{date3 + "/01 08:30", date3 + "/01 19:30", "#0D7813", "#4CB052", "Build Database CRUD Application in 6 Steps"}
		};

		// fill the events' data
		model = new SimpleCalendarModel();

		for (int i = 0; i < evts.length; i++) {
			SimpleCalendarEvent sce = new SimpleCalendarEvent();
			try {
				sce.setBeginDate(dataSDF.parse(evts[i][0]));
				sce.setEndDate(dataSDF.parse(evts[i][1]));
			} catch (ParseException e) {
				e.printStackTrace();
			}
			sce.setHeaderColor(evts[i][2]);
			sce.setContentColor(evts[i][3]);
			//sce.setTitle("<script>alert(\"Title\");</script>"); //if any, otherwise, the time stamp is assumed.
			sce.setContent(evts[i][4]);
			model.add(sce);
		}
		page.setAttribute("model", model);
	}

	@Listen("onEventUpdate = #calendars")
	public void onUpdateEvent(CalendarsEvent event) {
		SimpleCalendarEvent ce = (SimpleCalendarEvent) event.getCalendarEvent();
		ce.setBeginDate(event.getBeginDate());
		ce.setEndDate(event.getEndDate());
		model.update(ce);
	}
}
