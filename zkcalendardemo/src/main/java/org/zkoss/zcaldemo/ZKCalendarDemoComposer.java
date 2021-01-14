/* ZKCalendarDemoComposer.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Jul 2, 2014 12:30:52 PM , Created by Vincent
}}IS_NOTE

Copyright (C) 2014 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
	This program is distributed under LGPL Version 3.0 in the hope that
	it will be useful, but WITHOUT ANY WARRANTY.
}}IS_RIGHT
*/
package org.zkoss.zcaldemo;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.api.CalendarItem;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.SimpleCalendarItem;
import org.zkoss.calendar.impl.SimpleCalendarModel;
import org.zkoss.chart.Charts;
import org.zkoss.chart.model.DefaultPieModel;
import org.zkoss.chart.model.PieModel;
import org.zkoss.util.Locales;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.Page;
import org.zkoss.zk.ui.WebApps;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.EventListener;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.metainfo.ComponentInfo;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.Wire;
import org.zkoss.zul.Borderlayout;
import org.zkoss.zul.Button;
import org.zkoss.zul.Label;
import org.zkoss.zul.ListModel;
import org.zkoss.zul.ListModelList;
import org.zkoss.zul.Listbox;
import org.zkoss.zul.Popup;
import org.zkoss.zul.Span;
import org.zkoss.zul.Timer;
import org.zkoss.zul.Window;

/**
 * @author Vincent
 *
 */
public class ZKCalendarDemoComposer extends SelectorComposer<Borderlayout> {

	private static final long serialVersionUID = 20140702123052L;
	private boolean hasPE = WebApps.getFeature("pe");
	private SimpleCalendarModel cm;
	private Window createOrEdit;
	@Wire
	private Calendars calendars;
	@Wire
	private Popup updatePopup;
	@Wire
	private Span firstdaySpan;
	@Wire
	private Listbox firstdayLbx;
	@Wire
	private Label tooltipMsg, updateMsg, weekLbl;
	@Wire
	private Charts evtchart;
	@Wire
	private Timer timer;
	
	public ComponentInfo doBeforeCompose(Page page, Component parent, ComponentInfo compInfo) {
		page.setAttribute("hasPE", new Boolean(hasPE));
		return super.doBeforeCompose(page, parent, compInfo);
	}
	
	public void doAfterCompose(Borderlayout main) throws Exception {
		super.doAfterCompose(main);
		initCalendarModel(); // prepare model data
		updateWeekLabel();
		firstdaySpan.setVisible("month".equals(calendars.getMold()) || calendars.getDays() == 7);
		firstdayLbx.setModel(initFirstDayModel());
		syncModel();
		calendars.addEventListener("onSyncModel", new EventListener<Event>() {
			public void onEvent(Event event) throws Exception {
				syncModel();
			}
		});
		calendars.addEventListener("onDeleteEvent", new EventListener<Event>() {
			public void onEvent(Event event) throws Exception {
				cm.remove(((CalendarsEvent)event.getData()).getCalendarItem());
				syncModel();
			}
		});
		timer.addEventListener("onTimer", new EventListener<Event>() {
			public void onEvent(Event event) throws Exception {
				updatePopup.close();
			}
		});
	}
	
	@Listen("onClick = #leftBtn, #rightBtn, #todayBtn, #timezoneBtn, #refreshBtn")
	public void shiftCalendar(Event event) {
		String id = event.getTarget().getId();
		if (id.equals("leftBtn")) {
			calendars.previousPage();
		} else if (id.equals("rightBtn")) {
			calendars.nextPage();
		} else if (id.equals("todayBtn")) {
			calendars.setCurrentDate(Calendar.getInstance(calendars.getDefaultTimeZone()).getTime());
		} else if (id.equals("timezoneBtn")) {
			Map<TimeZone, String> zone = calendars.getTimeZones();
			if (!zone.isEmpty()) {
				Map.Entry<TimeZone, String> me = zone.entrySet().iterator().next();
				calendars.removeTimeZone(me.getKey());
				calendars.addTimeZone(me.getValue(), me.getKey());
			}
		} else {
			calendars.invalidate();
		}
		
		if (!id.equals("refreshBtn")) {
			updateWeekLabel();
			syncModel();
		}
	}
	
	@Listen("onClick = #dayViewBtn, #weekViewBtn, #fiveDayViewBtn, #monthViewBtn")
	public void changeCalendarView(Event event) {
		int days = Integer.parseInt((String) ((Button)event.getTarget()).getAttribute("days"));
		
		if (days < 30) {
			calendars.setMold("default");
			calendars.setDays(days);
		} else {
			calendars.setMold("month");
		}
		
		updateWeekLabel();
		firstdaySpan.setVisible("month".equals(calendars.getMold()) || calendars.getDays() == 7);
	}
	
	@Listen("onSelect = #firstdayLbx")
	public void onUpdateFirstDayOfWeek(Event event) {
		calendars.setFirstDayOfWeek(firstdayLbx.getSelectedItem().getLabel());
		syncModel();
	}
	
	@Listen("onItemTooltip = #calendars")
	public void showTooltip(CalendarsEvent event) {
		tooltipMsg.setValue(event.getCalendarItem().getContent());
	}
	
	@Listen("onItemCreate = #calendars")
	public void createEvent(CalendarsEvent event) {
		if (createOrEdit == null) {
			Map<String, Object> args = new HashMap<String, Object>();
			args.put("calevent", event);
			createOrEdit = (Window) Executions.createComponents("/zk7/createEditEvent.zul", null, args);
		} else {
			createOrEdit.setAttribute("calevent", event);
			Events.postEvent(new Event("onInit", createOrEdit));
		}
		event.stopClearGhost();
	}

	@Listen("onItemEdit = #calendars")
	public void editEvent(CalendarsEvent event) {
		if (createOrEdit == null) {
			Map<String, Object> args = new HashMap<String, Object>();
			args.put("calevent", event);
			createOrEdit = (Window) Executions.createComponents("/zk7/createEditEvent.zul", null, args);
		} else {
			createOrEdit.setAttribute("calevent", event);
			Events.postEvent(new Event("onInit", createOrEdit));
		}
		event.stopClearGhost();
	}
	
	@Listen("onItemUpdate = #calendars")
	public void onUpdateEvent(CalendarsEvent event) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/d");
		sdf.setTimeZone(calendars.getDefaultTimeZone());
		StringBuffer sb = new StringBuffer("Update... from ");
		sb.append(sdf.format(event.getCalendarItem().getBeginDate()));
		sb.append(" to ");
		sb.append(sdf.format(event.getBeginDate()));
		updateMsg.setValue(sb.toString());
		int left = event.getX();
		int top = event.getY();
		if (top + 100 > event.getDesktopHeight())
			top = event.getDesktopHeight() - 100;
		if (left + 330 > event.getDesktopWidth())
			left = event.getDesktopWidth() - 330;
		updatePopup.open(left, top);
		timer.start();
		SimpleCalendarItem ce = (SimpleCalendarItem) event.getCalendarItem();
		ce.setBeginDate(event.getBeginDate());
		ce.setEndDate(event.getEndDate());
		cm.update(ce);
	}
	
	private void initCalendarModel() {
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
			{date2 + "/17 14:00", date2 + "/18 16:00", "#3467CE", "#668CD9", "Case Study - Mecatena"},	
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
		cm = new SimpleCalendarModel();

		for (int i = 0, len = evts.length; i < len; i++) {
			SimpleCalendarItem sce = new SimpleCalendarItem();
			try {
				sce.setBeginDate(dataSDF.parse(evts[i][0]));
				sce.setEndDate(dataSDF.parse(evts[i][1]));
			} catch (ParseException e) {
				e.printStackTrace();
			}
			sce.setHeaderColor(evts[i][2]);
			sce.setContentColor(evts[i][3]);
			sce.setContent(evts[i][4]);
			cm.add(sce);
		}
		calendars.setModel(cm);
	}
	
	private void syncModel() {
		if (!hasPE)
			return;
		List<CalendarItem> list = cm.get(calendars.getBeginDate(), calendars.getEndDate(), null);
		double red = 0, blue = 0, green = 0, purple = 0, khaki = 0;
		int size = list.size();
		for (Iterator<CalendarItem> it = list.iterator(); it.hasNext();) {
			String color = it.next().getContentColor();
			if ("#D96666".equals(color))
				red += 1;
			else if ("#668CD9".equals(color))
				blue += 1;
			else if ("#4CB052".equals(color))
				green += 1;
			else if ("#B373B3".equals(color))
				purple += 1;
			else
				khaki += 1;
		}
		PieModel model = new DefaultPieModel();
		model.setValue("Red Events", new Double(size > 0 ? (red/size)*100 : 0));
		model.setValue("Blue Events", new Double(size > 0 ? (blue/size)*100 : 0));
		model.setValue("Green Events", new Double(size > 0 ? (green/size)*100: 0));
		model.setValue("Khaki Events", new Double(size > 0 ? (khaki/size)*100: 0));
		model.setValue("Purple Events", new Double(size > 0 ? (purple/size)*100 : 0));
		evtchart.setModel(model);
	}
	
	private void updateWeekLabel() {
		Date b = calendars.getBeginDate();
		Date e = calendars.getEndDate();
		SimpleDateFormat sdfV = new SimpleDateFormat("yyyy/MM/dd", Locales.getCurrent());
		sdfV.setTimeZone(calendars.getDefaultTimeZone());
		weekLbl.setValue(sdfV.format(b) + " ~ " + sdfV.format(e));
	}
	
	private ListModel<String> initFirstDayModel() {
		ListModelList<String> m = new ListModelList<String>();
		m.add("Sunday");
		m.add("Monday");
		m.add("Tuesday");
		m.add("Wednesday");
		m.add("Thursday");
		m.add("Friday");
		m.add("Saturday");
		return m;
	}
}
