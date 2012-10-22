package org.zkoss.zcaldemo;

import java.text.*;
import java.util.*;
import java.util.Calendar;

import org.zkoss.calendar.*;
import org.zkoss.calendar.api.CalendarEvent;
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
import org.zkoss.zk.ui.util.GenericForwardComposer;
import org.zkoss.zul.*;
import org.zkoss.zul.Timer;

public class CalendarDemoComposer extends GenericForwardComposer {
	
	private static final long serialVersionUID = 201011240904L;
	private boolean hasPE;
	private SimpleCalendarModel cm;
	private Calendars calendars;
	private Chart mychart;
	private Popup updateMsg;
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
			// ce.setTitle() if any, otherwise, the time stamp is assumed.
			sce.setContent(evts[i][4]);
			cm.add(sce);
		}
		page.setAttribute("cm", cm);
	}

	private void syncModel() {
		if (!hasPE) return;
		List list = cm.get(calendars.getBeginDate(), calendars.getEndDate(), null);
		double red = 0, blue = 0, green = 0, purple = 0, khaki = 0;
		int size = list.size();
		for (Iterator it = list.iterator(); it.hasNext();) {
			String color = ((CalendarEvent)it.next()).getContentColor();
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
		 PieModel model = new SimplePieModel();
		 model.setValue("Red Events", new Double(size > 0 ? (red/size)*100 : 0));
		 model.setValue("Blue Events", new Double(size > 0 ? (blue/size)*100 : 0));
		 model.setValue("Green Events", new Double(size > 0 ? (green/size)*100: 0));
		 model.setValue("Khaki Events", new Double(size > 0 ? (khaki/size)*100: 0));
		 model.setValue("Purple Events", new Double(size > 0 ? (purple/size)*100 : 0));
		 mychart.setModel(model);
		 mychart.invalidate();
	}
	
	public void onEventCreate$calendars(ForwardEvent event) {
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
		SimpleCalendarEvent ce = new SimpleCalendarEvent();
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
		
		String[] colors = ((String)createEvent$ppcolor.getSelectedItem().getValue()).split(",");
		ce.setHeaderColor(colors[0]);
		ce.setContentColor(colors[1]);
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
	
	public void onEventEdit$calendars(ForwardEvent event) {
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
		CalendarEvent ce = evt.getCalendarEvent();
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
		String colors = ce.getHeaderColor() + "," + ce.getContentColor();
		int index = 0;
		if ("#3467CE,#668CD9".equals(colors))
			index = 1;
		else if ("#0D7813,#4CB052".equals(colors))
			index = 2;
		else if ("#88880E,#BFBF4D".equals(colors))
			index = 3;
		else if ("#7A367A,#B373B3".equals(colors))
			index = 4;
	
		switch (index) {
		case 0:
			editEvent$ppcolor.setStyle("color:#D96666;font-weight: bold;");
			break;
		case 1:
			editEvent$ppcolor.setStyle("color:#668CD9;font-weight: bold;");
			break;
		case 2:
			editEvent$ppcolor.setStyle("color:#4CB052;font-weight: bold;");
			break;
		case 3:
			editEvent$ppcolor.setStyle("color:#BFBF4D;font-weight: bold;");
			break;
		case 4:
			editEvent$ppcolor.setStyle("color:#B373B3;font-weight: bold;");
			break;
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
		SimpleCalendarEvent ce = (SimpleCalendarEvent) editEvent.getAttribute("ce");
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
		String[] colors = ((String)editEvent$ppcolor.getSelectedItem().getValue()).split(",");
		ce.setHeaderColor(colors[0]);
		ce.setContentColor(colors[1]);
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
						cm.remove((SimpleCalendarEvent) editEvent.getAttribute("ce"));
						syncModel();
					}
				});
		editEvent.setVisible(false);
	}
	
	public void onEventUpdate$calendars(ForwardEvent event) {
		CalendarsEvent evt = (CalendarsEvent) event.getOrigin();
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy/MM/d");
		sdf1.setTimeZone(calendars.getDefaultTimeZone());
		StringBuffer sb = new StringBuffer("Update... from ");
		sb.append(sdf1.format(evt.getCalendarEvent().getBeginDate()));
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
		SimpleCalendarEvent sce = (SimpleCalendarEvent) evt.getCalendarEvent();
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