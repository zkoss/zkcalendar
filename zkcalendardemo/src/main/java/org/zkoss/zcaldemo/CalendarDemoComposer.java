package org.zkoss.zcaldemo;

import java.text.*;
import java.util.*;
import java.util.Calendar;

import org.zkoss.calendar.*;
import org.zkoss.calendar.api.CalendarItem;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.*;
import org.zkoss.util.Locales;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.Page;
import org.zkoss.zk.ui.WebApps;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.EventListener;
import org.zkoss.zk.ui.event.ForwardEvent;
import org.zkoss.zk.ui.metainfo.ComponentInfo;
import org.zkoss.zk.ui.util.Clients;
import org.zkoss.zk.ui.util.GenericForwardComposer;
import org.zkoss.zul.*;
import org.zkoss.zul.Timer;

public class CalendarDemoComposer extends GenericForwardComposer {
	
	private static final String HEADER_STYLE_RED = "background-color: #D32F2F; color: #FFFFFF;";
	private static final String HEADER_STYLE_ORANGE = "background-color: #F57C00; color: #FFFFFF;";
	private static final String HEADER_STYLE_GREEN = "background-color: #398E3C; color: #FFFFFF;";
	private static final String HEADER_STYLE_BLUE = "background-color: #1876D2; color: #FFFFFF;";
	private static final String HEADER_STYLE_TEAL = "background-color: #0397A7; color: #FFFFFF;";
	private static final String CONTENT_STYLE_RED = "background-color: #F44336; color: #FFFFFF";
	private static final String CONTENT_STYLE_TEAL = "background-color: #05BCD4; color: #FFFFFF;";
	private static final String CONTENT_STYLE_BLUE = "background-color: #2196F3; color: #FFFFFF;";
	private static final String CONTENT_STYLE_GREEN = "background-color: #4DAF50; color: #FFFFFF;";
	private static final String CONTENT_STYLE_ORANGE = "background-color: #FF9800; color: #FFFFFF;";
	private static final long serialVersionUID = 201011240904L;
	private boolean hasPE;
	private SimpleCalendarModel cm;
	private Calendars calendars;
	private Chart mychart;
	private Popup updateMsg, test;
	private	Label popupLabel;
	private	Label label;
	private Timer timer;
	private Span FDOW;
	
	private Window createEvent;
	private Datebox createEvent$ppbegin;
	private Datebox createEvent$ppend;
	private Listbox createEvent$ppbt;
	private Listbox createEvent$ppet;
	private Checkbox createEvent$ppallDay;
	private Checkbox createEvent$pplocked;
	private Combobox createEvent$ppcolor;
	private Textbox createEvent$ppcnt;
	
	private Window editEvent;
	private Datebox editEvent$ppbegin;
	private Datebox editEvent$ppend;
	private Listbox editEvent$ppbt;
	private Listbox editEvent$ppet;
	private Checkbox editEvent$ppallDay;
	private Checkbox editEvent$pplocked;
	private Combobox editEvent$ppcolor;
	private Textbox editEvent$ppcnt;
	
	
	//@Override
	public ComponentInfo doBeforeCompose(Page page, Component parent,
			ComponentInfo compInfo) {
		initTimeDropdown(page);
		// prepare model data
		initCalendarModel(page);
		hasPE = WebApps.getFeature("pe");
		page.setAttribute("hasPE", new Boolean(hasPE));
		return super.doBeforeCompose(page, parent, compInfo);
	}
	
	//@Override
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		syncModel();
		updateDateLabel();
		FDOW.setVisible("month".equals(calendars.getMold()) || calendars.getDays() == 7);
	}

	private void updateDateLabel() {
		Date b = calendars.getBeginDate();
		Date e = calendars.getEndDate();
		SimpleDateFormat sdfV = new SimpleDateFormat(
				"yyyy/MMM/dd", Locales.getCurrent());
		sdfV.setTimeZone(calendars.getDefaultTimeZone());
		label.setValue(sdfV.format(b) + " - " + sdfV.format(e));
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
			{date1 + "/28 00:00", date1 + "/29 00:00", "", HEADER_STYLE_RED,CONTENT_STYLE_RED, "ZK Jet Released"},
			{date1 + "/04 02:00", date1 + "/05 03:00", "", HEADER_STYLE_RED,CONTENT_STYLE_RED, "Experience ZK SpreadSheet Live Demo!"},	
			{date2 + "/12 10:00", date2 + "/12 20:00", "", HEADER_STYLE_RED,CONTENT_STYLE_RED, "SF 2009 CCA Open: Nominate ZK Now!"},	
			{date2 + "/21 05:00", date2 + "/21 07:00", "", HEADER_STYLE_RED,CONTENT_STYLE_RED, "New Features of ZK Spreadsheet 1.0.0 RC2"},	
			{date2 + "/08 00:00", date2 + "/09 00:00", "", HEADER_STYLE_RED,CONTENT_STYLE_RED, "ZK Spreadsheet 1.0.0 RC2 Released"},	
			// Orange Events
			{date1 + "/29 03:00", date2 + "/02 06:00", "", HEADER_STYLE_ORANGE,CONTENT_STYLE_ORANGE, "ZK 3.6.1 Released"},	
			{date2 + "/02 10:00", date2 + "/02 12:30", "", HEADER_STYLE_ORANGE,CONTENT_STYLE_ORANGE, "New Feature of ZK 3.6.1"},	
			{date2 + "/17 14:00", date2 + "/18 16:00", "", HEADER_STYLE_ORANGE,CONTENT_STYLE_ORANGE, "Case Study - Mecatena"},	
			{date2 + "/26 00:00", date2 + "/27 00:00", "", HEADER_STYLE_ORANGE,CONTENT_STYLE_ORANGE, "Small talk: A Preview Of ZK Spreadsheet 1.0"},	
			{date3 + "/01 14:30", date3 + "/01 17:30", "", HEADER_STYLE_ORANGE,CONTENT_STYLE_ORANGE, "ZK Unit Testing Project - zunit"},
			// Green Events
			{date1 + "/29 08:00", date2 + "/03 12:00", "", HEADER_STYLE_GREEN,CONTENT_STYLE_GREEN, "ZK Studio 0.9.3 released"},
			{date2 + "/07 08:00", date2 + "/07 12:00", "", HEADER_STYLE_GREEN,CONTENT_STYLE_GREEN, "Tutorial : Reading from the DB with Netbeans and ZK"},	
			{date2 + "/13 11:00", date2 + "/13 14:30", "", HEADER_STYLE_GREEN,CONTENT_STYLE_GREEN, "Small talk - ZK Charts"},	
			{date2 + "/16 14:00", date2 + "/18 16:00", "", HEADER_STYLE_GREEN,CONTENT_STYLE_GREEN, "Style Guide for ZK 3.6 released !"},	
			{date3 + "/02 12:00", date3 + "/02 17:00", "", HEADER_STYLE_GREEN,CONTENT_STYLE_GREEN, "Small talk -- Simple Database Access From ZK"},
			// Blue Events
			{date1 + "/03 00:00", date1 + "/04 00:00", "", HEADER_STYLE_BLUE,CONTENT_STYLE_BLUE, "ZK 3.6.0 Released !"},
			{date2 + "/04 00:00", date2 + "/07 00:00", "", HEADER_STYLE_BLUE,CONTENT_STYLE_BLUE, "Sun Microsystems Recruiting"},
			{date2 + "/13 05:00", date2 + "/13 07:00", "", HEADER_STYLE_BLUE,CONTENT_STYLE_BLUE, "How to Test ZK Application with Selenium"},
			{date2 + "/24 19:30", date2 + "/24 20:00", "", HEADER_STYLE_BLUE,CONTENT_STYLE_BLUE, "ZK Alfresco Talk"},
			{date3 + "/03 00:00", date3 + "/04 00:00", "", HEADER_STYLE_BLUE,CONTENT_STYLE_BLUE, "ZK selected as SourceForge.net Project of the Month"},
			// Teal Events
			{date1 + "/28 10:00", date1 + "/28 12:30", "", HEADER_STYLE_TEAL,HEADER_STYLE_TEAL, "ZK Mobile 0.8.10 Released"},
			{date2 + "/03 00:00", date2 + "/03 05:30", "", HEADER_STYLE_TEAL,HEADER_STYLE_TEAL, "ZK Gmaps 2.0_11 released"},
			{date2 + "/05 20:30", date2 + "/06 00:00", "", HEADER_STYLE_TEAL,HEADER_STYLE_TEAL, "Refresh with Five New ZK Themes!"},
			{date2 + "/23 00:00", date2 + "/25 16:30", "", HEADER_STYLE_TEAL,HEADER_STYLE_TEAL, "ZK Roadmap 2009 Announced"},
			{date3 + "/01 08:30", date3 + "/01 19:30", "", HEADER_STYLE_TEAL,HEADER_STYLE_TEAL, "Build Database CRUD Application in 6 Steps"}
		};

		// fill the events' data
		cm = new SimpleCalendarModel();

		for (int i = 0; i < evts.length; i++) {
			SimpleCalendarItem sce = new SimpleCalendarItem();
			try {
				sce.setBeginDate(dataSDF.parse(evts[i][0]));
				sce.setEndDate(dataSDF.parse(evts[i][1]));
			} catch (ParseException e) {
				e.printStackTrace();
			}
			/* deprecated, use style instead*/
			/*
			sce.setHeaderColor(evts[i][2]);
			sce.setContentColor(evts[i][3]);
			*/
			sce.setStyle(evts[i][2]);
			sce.setHeaderStyle(evts[i][3]);
			sce.setContentStyle(evts[i][4]);
			sce.setContent(evts[i][5]);
			cm.add(sce);
		}
		page.setAttribute("cm", cm);
	}

	private void syncModel() {
		if (!hasPE) return;
		List list = cm.get(calendars.getBeginDate(), calendars.getEndDate(), null);
		double red = 0, orange = 0, green = 0, blue= 0, teal = 0;
		int size = list.size();
		for (Iterator it = list.iterator(); it.hasNext();) {
			String contentStyle = ((CalendarItem)it.next()).getContentStyle();
			if (CONTENT_STYLE_RED.equals(contentStyle))
				red += 1;
			else if (CONTENT_STYLE_ORANGE.equals(contentStyle))
				orange += 1;
			else if (CONTENT_STYLE_GREEN.equals(contentStyle))
				green += 1;
			else if (CONTENT_STYLE_BLUE.equals(contentStyle))
				blue += 1;
			else
				teal += 1;
		}
		 PieModel model = new SimplePieModel();
		 model.setValue("Red Events", new Double(size > 0 ? (red/size)*100 : 0));
		 model.setValue("Orange Events", new Double(size > 0 ? (orange/size)*100 : 0));
		 model.setValue("Green Events", new Double(size > 0 ? (green/size)*100: 0));
		 model.setValue("Blue Events", new Double(size > 0 ? (blue/size)*100: 0));
		 model.setValue("Teal Events", new Double(size > 0 ? (teal/size)*100 : 0));
		 mychart.setModel(model);
		 mychart.invalidate();
	}
	
	public void onItemTooltip$calendars(CalendarsEvent event) {
		//test.open(evt.getX(), evt.getY());
		((Label)test.getFirstChild()).setValue(event.getCalendarItem().getContent());
	}

	public void onItemCreate$calendars(ForwardEvent event) {
		CalendarsEvent evt = (CalendarsEvent) event.getOrigin();
		int left = evt.getX();
		int top = evt.getY();
		int timeslots = calendars.getTimeslots();
		int timeslotTime = 60 / timeslots;
		if (top + 245 > evt.getDesktopHeight())
			top = evt.getDesktopHeight() - 245;
		if (left + 410 > evt.getDesktopWidth())
			left = evt.getDesktopWidth() - 410;
		createEvent.setLeft(left + "px");
		createEvent.setTop(top + "px");
		SimpleDateFormat create_sdf = new SimpleDateFormat("HH:mm");
		create_sdf.setTimeZone(calendars.getDefaultTimeZone());
		String[] times = create_sdf.format(evt.getBeginDate()).split(":");
		int hours = Integer.parseInt(times[0]) * timeslots;
		int mins = Integer.parseInt(times[1]);
		int bdTimeSum = hours + mins;
		hours += mins / timeslotTime;
		
		createEvent$ppbt.setSelectedIndex(hours * 12 / timeslots);
		times = create_sdf.format(evt.getEndDate()).split(":");
		hours = Integer.parseInt(times[0]) * timeslots;
		mins = Integer.parseInt(times[1]);
		int edTimeSum = hours + mins;
		hours += mins / timeslotTime;
		((Listbox)createEvent.getFellow("ppet")).setSelectedIndex(hours * 12 / timeslots);
		boolean isAllday = (bdTimeSum + edTimeSum) == 0;
		
		createEvent$ppbegin.setTimeZone(calendars.getDefaultTimeZone());
		createEvent$ppbegin.setValue(evt.getBeginDate());
		createEvent$ppend.setTimeZone(calendars.getDefaultTimeZone());
		createEvent$ppend.setValue(evt.getEndDate());
		createEvent$ppallDay.setChecked(isAllday);
		createEvent$pplocked.setChecked(false);
		createEvent$ppbt.setVisible(!isAllday);
		createEvent$ppet.setVisible(!isAllday);

		createEvent.setVisible(true);
		createEvent.setAttribute("calevent", evt);
		evt.stopClearGhost();
	}
	
	public void onClose$createEvent(ForwardEvent event) {
		event.getOrigin().stopPropagation();
		((CalendarsEvent)createEvent.getAttribute("calevent")).clearGhost();
		createEvent.setVisible(false);
	}
	
	public void onClick$okBtn$createEvent(ForwardEvent event) {
		SimpleCalendarItem ce = new SimpleCalendarItem();
		Calendar cal = Calendar.getInstance(calendars.getDefaultTimeZone());
		Date beginDate = createEvent$ppbegin.getValue();
		Date endDate = createEvent$ppend.getValue();
		
		int bmin = 0;
		int emin = 0;
		if (!createEvent$ppallDay.isChecked()) {
			String[] times = createEvent$ppbt.getSelectedItem().getLabel().split(":");
			
			cal.setTime(beginDate);
			cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(times[0]));
			cal.set(Calendar.MINUTE, Integer.parseInt(times[1]));
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			beginDate = cal.getTime();
			bmin = cal.get(Calendar.MINUTE);
			times = createEvent$ppet.getSelectedItem().getLabel().split(":");
			cal.setTime(endDate);
			cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(times[0]));
			cal.set(Calendar.MINUTE, Integer.parseInt(times[1]));
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			endDate = cal.getTime();
			emin = cal.get(Calendar.MINUTE);
			
			if (!beginDate.before(endDate)) {
				createEvent.setVisible(false);
				alert("The end date cannot be earlier than or equal to begin date!");
				((CalendarsEvent)createEvent.getAttribute("calevent")).clearGhost();
				return;
			}
			if (bmin == 5 || bmin == 25 || bmin == 35 || bmin == 55) {
				createEvent.setVisible(false);
				alert("The begin minute:" + bmin + ", is not supported");
				((CalendarsEvent)createEvent.getAttribute("calevent")).clearGhost();
				return;
			}
			if (emin == 5 || emin == 25 || emin == 35 || emin == 55) {
				createEvent.setVisible(false);
				alert("The end minute:" + emin + ", doesn't support");
				((CalendarsEvent)createEvent.getAttribute("calevent")).clearGhost();
				return;
			}			
		}else{
			cal.setTime(beginDate);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			beginDate = cal.getTime();
			bmin = cal.get(Calendar.MINUTE);

			cal.setTime(endDate);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			endDate = cal.getTime();
			emin = cal.get(Calendar.MINUTE);
			
			if(endDate.equals(beginDate)){
				cal.set(Calendar.HOUR_OF_DAY, 24);
				endDate = cal.getTime();
				emin = cal.get(Calendar.MINUTE);
			}
		}
		
		String selectedColor = ((String)createEvent$ppcolor.getSelectedItem().getValue());
		switch (selectedColor) {
		case "red":
			ce.setContentStyle(CONTENT_STYLE_RED);
			ce.setHeaderStyle(HEADER_STYLE_RED);
			break;
		case "orange":
			ce.setContentStyle(CONTENT_STYLE_ORANGE);
			ce.setHeaderStyle(HEADER_STYLE_ORANGE);
			break;
		case "green":
			ce.setContentStyle(CONTENT_STYLE_GREEN);
			ce.setHeaderStyle(HEADER_STYLE_GREEN);
			break;
		case "blue":
			ce.setContentStyle(CONTENT_STYLE_BLUE);
			ce.setHeaderStyle(HEADER_STYLE_BLUE);
			break;
		case "teal":
			ce.setContentStyle(CONTENT_STYLE_TEAL);
			ce.setHeaderStyle(HEADER_STYLE_TEAL);
			break;
		default:
			break;
		}
		ce.setBeginDate(beginDate);
		ce.setEndDate(endDate);
		ce.setContent(createEvent$ppcnt.getValue());
		ce.setLocked(createEvent$pplocked.isChecked());
		cm.add(ce);
		
		createEvent$ppcnt.setRawValue("");
		createEvent$ppbt.setSelectedIndex(0);
		createEvent$ppet.setSelectedIndex(0);
		createEvent.setVisible(false);
		syncModel();
	}
	
	public void onClick$cancelBtn$createEvent(ForwardEvent event) {
		createEvent$ppcnt.setRawValue("");
		createEvent$ppbt.setSelectedIndex(0);
		createEvent$ppet.setSelectedIndex(0);
		createEvent.setVisible(false);
		((CalendarsEvent)createEvent.getAttribute("calevent")).clearGhost();
	}

	public void onItemEdit$calendars(ForwardEvent event) {
		CalendarsEvent evt = (CalendarsEvent) event.getOrigin();
		
		int left = evt.getX();
		int top = evt.getY();
		if (top + 245 > evt.getDesktopHeight())
			top = evt.getDesktopHeight() - 245;
		if (left + 410 > evt.getDesktopWidth())
			left = evt.getDesktopWidth() - 410;
		
		TimeZone tz = calendars.getDefaultTimeZone();
		
		editEvent.setLeft(left + "px");
		editEvent.setTop(top + "px");
		CalendarItem ce = evt.getCalendarItem();
		SimpleDateFormat edit_sdf = new SimpleDateFormat("HH:mm");
		edit_sdf.setTimeZone(tz);
		Calendar calendar = Calendar.getInstance(org.zkoss.util.Locales
				.getCurrent());
		String[] times = edit_sdf.format(ce.getBeginDate()).split(":");
		int hours = Integer.parseInt(times[0]);
		int mins = Integer.parseInt(times[1]);
		int bdTimeSum = hours + mins;
		editEvent$ppbt.setSelectedIndex(hours*12 + mins/5);
		times = edit_sdf.format(ce.getEndDate()).split(":");
		hours = Integer.parseInt(times[0]);
		mins = Integer.parseInt(times[1]);
		int edTimeSum = hours + mins;
		editEvent$ppet.setSelectedIndex(hours*12 + mins/5);
		boolean isAllday = (bdTimeSum + edTimeSum) == 0;
		editEvent$ppbegin.setTimeZone(tz);
		editEvent$ppbegin.setValue(ce.getBeginDate());
		editEvent$ppend.setTimeZone(tz);
		editEvent$ppend.setValue(ce.getEndDate());
		editEvent$ppallDay.setChecked(isAllday);
		editEvent$pplocked.setChecked(ce.isLocked());
		editEvent$ppbt.setVisible(!isAllday);
		editEvent$ppet.setVisible(!isAllday);
		editEvent$ppcnt.setValue(ce.getContent());

		int index = 0;
		String contentStyle = ce.getContentStyle();
		if (CONTENT_STYLE_RED.equals(contentStyle)) {
			index = 0;
			editEvent$ppcolor.setSclass("red");
		}
		else if (CONTENT_STYLE_ORANGE.equals(contentStyle)) {
			index = 1;
			editEvent$ppcolor.setSclass("orange");
		}
		else if (CONTENT_STYLE_GREEN.equals(contentStyle)) {
			index = 2;
			editEvent$ppcolor.setSclass("green");
		}
		else if (CONTENT_STYLE_BLUE.equals(contentStyle)) {
			index = 3;
			editEvent$ppcolor.setSclass("blue");
		}
		else {
			index = 4;
			editEvent$ppcolor.setSclass("teal");
		}
		editEvent$ppcolor.setSelectedIndex(index);
		editEvent.setVisible(true);
	
		// store for the edit marco component.
		editEvent.setAttribute("ce", ce);
	}
	
	public void onClose$editEvent(ForwardEvent event) {
		event.getOrigin().stopPropagation();
		editEvent.setVisible(false);
	}
	
	public void onClick$okBtn$editEvent(ForwardEvent event) {
		SimpleCalendarItem ce = (SimpleCalendarItem) editEvent.getAttribute("ce");
		Calendar cal = Calendar.getInstance(calendars.getDefaultTimeZone());
		Date beginDate = editEvent$ppbegin.getValue();
		Date endDate = editEvent$ppend.getValue();
		
		int bmin = 0;
		int emin = 0;
		if (!editEvent$ppallDay.isChecked()) {
			String[] times = editEvent$ppbt.getSelectedItem().getLabel().split(":");
			cal.setTime(beginDate);
			cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(times[0]));
			cal.set(Calendar.MINUTE, Integer.parseInt(times[1]));
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			beginDate = cal.getTime();
			times = editEvent$ppet.getSelectedItem().getLabel().split(":");
			cal.setTime(endDate);
			cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(times[0]));
			cal.set(Calendar.MINUTE, Integer.parseInt(times[1]));
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			endDate = cal.getTime();
		} else {
			cal.setTime(beginDate);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			beginDate = cal.getTime();
			bmin = cal.get(Calendar.MINUTE);
			cal.setTime(endDate);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			endDate = cal.getTime();
			emin = cal.get(Calendar.MINUTE);
		}			
		if (!beginDate.before(endDate)) {
			
			
			editEvent.setVisible(false);
			alert("The end date cannot be earlier than or equal to begin date!");
			((org.zkoss.calendar.event.CalendarsEvent)editEvent.getAttribute("calevent")).clearGhost();
			return;
		}
		if (bmin == 5 || bmin == 25 || bmin == 35 || bmin ==55) {
			editEvent.setVisible(false);
			alert("The begin minute:" + bmin + ", is not supported");
			((org.zkoss.calendar.event.CalendarsEvent)editEvent.getAttribute("calevent")).clearGhost();
			return;
		}
		if (emin == 5 || emin == 25 || emin == 35 || emin ==55) {
			editEvent.setVisible(false);
			alert("The end minute:" + emin + ", doesn't support");
			((org.zkoss.calendar.event.CalendarsEvent)editEvent.getAttribute("calevent")).clearGhost();
			return;
		}
		String selectedColor = ((String)editEvent$ppcolor.getSelectedItem().getValue());
		switch (selectedColor) {
		case "red":
			ce.setContentStyle(CONTENT_STYLE_RED);
			ce.setHeaderStyle(HEADER_STYLE_RED);
			break;
		case "orange":
			ce.setContentStyle(CONTENT_STYLE_ORANGE);
			ce.setHeaderStyle(HEADER_STYLE_ORANGE);
			break;
		case "green":
			ce.setContentStyle(CONTENT_STYLE_GREEN);
			ce.setHeaderStyle(HEADER_STYLE_GREEN);
			break;
		case "blue":
			ce.setContentStyle(CONTENT_STYLE_BLUE);
			ce.setHeaderStyle(HEADER_STYLE_BLUE);
			break;
		case "teal":
			ce.setContentStyle(CONTENT_STYLE_TEAL);
			ce.setHeaderStyle(HEADER_STYLE_TEAL);
			break;
		default:
			break;
		}
		ce.setBeginDate(beginDate);
		ce.setEndDate(endDate);
		ce.setContent(editEvent$ppcnt.getValue());
		ce.setLocked(editEvent$pplocked.isChecked());
		cm.update(ce);
		editEvent.setVisible(false);
		syncModel();
	}

	public void onClick$deleteBtn$editEvent(ForwardEvent event) throws InterruptedException {
		Messagebox.show("Are you sure to delete the event!", "Question",
				Messagebox.OK | Messagebox.CANCEL, Messagebox.QUESTION,
				new EventListener() {
					public void onEvent(Event evt) throws Exception {
						if (((Integer) evt.getData()).intValue() != Messagebox.OK)
							return;
						cm.remove((SimpleCalendarItem) editEvent.getAttribute("ce"));
						syncModel();
					}
				});
		editEvent.setVisible(false);
	}

	public void onItemUpdate$calendars(ForwardEvent event) {
		CalendarsEvent evt = (CalendarsEvent) event.getOrigin();
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy/MM/d");
		sdf1.setTimeZone(calendars.getDefaultTimeZone());
		StringBuffer sb = new StringBuffer("Update... from ");
		sb.append(sdf1.format(evt.getCalendarItem().getBeginDate()));
		sb.append(" to ");
		sb.append(sdf1.format(evt.getBeginDate()));
		popupLabel.setValue(sb.toString());
		int left = evt.getX();
		int top = evt.getY();
		if (top + 100 > evt.getDesktopHeight())
			top = evt.getDesktopHeight() - 100;
		if (left + 330 > evt.getDesktopWidth())
			left = evt.getDesktopWidth() - 330;
		updateMsg.open(left, top);
		timer.start();
		org.zkoss.calendar.Calendars cal = (org.zkoss.calendar.Calendars) evt
				.getTarget();
		SimpleCalendarModel m = (SimpleCalendarModel) cal.getModel();
		SimpleCalendarItem sce = (SimpleCalendarItem) evt.getCalendarItem();
		sce.setBeginDate(evt.getBeginDate());
		sce.setEndDate(evt.getEndDate());
		m.update(sce);
	}
	
	public void onMoveDate(ForwardEvent event) {
		if ("arrow-left".equals(event.getData()))
			calendars.previousPage();
		else calendars.nextPage();
		updateDateLabel();
		syncModel();
	}
	
	
	public void onWeekClick$calendars(ForwardEvent event) {
		Event evt = event.getOrigin();
		Date d = (Date) evt.getData();
		TimeZone tz = calendars.getDefaultTimeZone();
		Calendar cal = Calendar.getInstance(tz);
		cal.setTime(d);
		
		System.out.println(cal.get(Calendar.MONTH));
		System.out.println(cal.get(Calendar.DAY_OF_MONTH));
		System.out.println(cal.get(Calendar.HOUR_OF_DAY));
		System.out.println(cal.get(Calendar.MINUTE));
	}
	
	
	public void onToday(ForwardEvent event) {
		calendars.setCurrentDate(Calendar.getInstance(calendars.getDefaultTimeZone()).getTime());
		updateDateLabel();
		syncModel();
	}
	
	public void onSwitchTimeZone(ForwardEvent event) {
		Map zone = calendars.getTimeZones();
		if (!zone.isEmpty()) {
			Map.Entry me = (Map.Entry) zone.entrySet().iterator().next();
			calendars.removeTimeZone((TimeZone) me.getKey());
			calendars.addTimeZone((String) me.getValue(), (TimeZone) me.getKey());
		}
		syncModel();
	}
	
	public void onUpdateFirstDayOfWeek(ForwardEvent event) {
		Listbox listbox = (Listbox) event.getOrigin().getTarget();
		calendars.setFirstDayOfWeek(listbox.getSelectedItem().getLabel());
		syncModel();
	}
	
	public void onUpdateView(ForwardEvent event) {
		String text = String.valueOf(event.getData());
		int days = "Day".equals(text) ? 1: "5 Days".equals(text) ? 5: "Week".equals(text) ? 7: 0;
		
		if (days > 0) {
			calendars.setMold("default");
			calendars.setDays(days);
		} else calendars.setMold("month");
		updateDateLabel();
		FDOW.setVisible("month".equals(calendars.getMold()) || calendars.getDays() == 7);
	}
	
}