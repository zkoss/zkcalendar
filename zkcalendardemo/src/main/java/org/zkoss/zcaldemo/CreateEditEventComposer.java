/* CreateEventComposer.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Jul 2, 2014 2:39:25 PM , Created by Vincent
}}IS_NOTE

Copyright (C) 2014 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
	This program is distributed under LGPL Version 3.0 in the hope that
	it will be useful, but WITHOUT ANY WARRANTY.
}}IS_RIGHT
*/
package org.zkoss.zcaldemo;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.api.CalendarItem;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.SimpleCalendarItem;
import org.zkoss.calendar.impl.SimpleCalendarModel;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.event.CheckEvent;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.EventListener;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.event.SelectEvent;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.Wire;
import org.zkoss.zul.Button;
import org.zkoss.zul.Checkbox;
import org.zkoss.zul.Combobox;
import org.zkoss.zul.Comboitem;
import org.zkoss.zul.Datebox;
import org.zkoss.zul.ListModelList;
import org.zkoss.zul.Listbox;
import org.zkoss.zul.Messagebox;
import org.zkoss.zul.Textbox;
import org.zkoss.zul.Window;

/**
 * @author Vincent
 *
 */
public class CreateEditEventComposer extends SelectorComposer<Window> {

	private static final long serialVersionUID = 20140702143925L;

	private Calendars calendars;
	@Wire
	private Window createOrEdit;
	@Wire
	private Datebox beginDbx, endDbx;
	@Wire
	private Listbox beginTimeLbx, endTimeLbx;
	@Wire
	private Checkbox allDayCbx, lockCbx;
	@Wire
	private Combobox colorCbx;
	@Wire
	private Textbox contentTbx;
	@Wire
	private Button deleteBtn;
	
	public void doAfterCompose(Window win) throws Exception {
		super.doAfterCompose(win);
		calendars = (Calendars) createOrEdit.getPage().getFellow("calendars");
		initTimeDropdown();
		CalendarsEvent calevt = (CalendarsEvent)Executions.getCurrent().getArg().get("calevent");
		initWindow(calevt);
		createOrEdit.setAttribute("calevent", calevt);
		createOrEdit.addEventListener("onInit", new EventListener<Event>() {
			public void onEvent(Event event) throws Exception {
				initWindow((CalendarsEvent) createOrEdit.getAttribute("calevent"));
			}
		});
	}
	
	@Listen("onClose = #createOrEdit")
	public void onCreateClose(Event event) {
		event.stopPropagation();
		((CalendarsEvent)createOrEdit.getAttribute("calevent")).clearGhost();
		createOrEdit.setVisible(false);
	}
	
	@Listen("onCheck = #allDayCbx")
	public void setAllDayEvent(CheckEvent event) {
		boolean checked = event.isChecked();
		beginTimeLbx.setVisible(!checked);
		endTimeLbx.setVisible(!checked);
	}
	
	@Listen("onSelect = #colorCbx")
	public void selectColor(SelectEvent<Comboitem, String> event) {
		colorCbx.setSclass(event.getSelectedItems().iterator().next().getLabel().toLowerCase());
	}
	
	@Listen("onClick = #okBtn, #cancelBtn")
	public void createEvent(Event event) {
		if (event.getTarget().getId().equals("cancelBtn")) {
			contentTbx.setRawValue("");
			beginTimeLbx.setSelectedIndex(0);
			endTimeLbx.setSelectedIndex(0);
			createOrEdit.setVisible(false);
			((CalendarsEvent)createOrEdit.getAttribute("calevent")).clearGhost();
			return;
		}
		SimpleCalendarItem ce = new SimpleCalendarItem();
		Calendar cal = Calendar.getInstance(calendars.getDefaultTimeZone());
		Date beginDate = beginDbx.getValue();
		Date endDate = endDbx.getValue();
		
		int bmin = 0;
		int emin = 0;
		if (!allDayCbx.isChecked()) {
			String[] times = beginTimeLbx.getSelectedItem().getLabel().split(":");
			
			cal.setTime(beginDate);
			cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(times[0]));
			cal.set(Calendar.MINUTE, Integer.parseInt(times[1]));
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			beginDate = cal.getTime();
			bmin = cal.get(Calendar.MINUTE);
			times = endTimeLbx.getSelectedItem().getLabel().split(":");
			cal.setTime(endDate);
			cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(times[0]));
			cal.set(Calendar.MINUTE, Integer.parseInt(times[1]));
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			endDate = cal.getTime();
			emin = cal.get(Calendar.MINUTE);
			
			CalendarsEvent cevt = (CalendarsEvent) createOrEdit.getAttribute("calevent");
			
			if (!beginDate.before(endDate)) {
				createOrEdit.setVisible(false);
				alert("The end date cannot be earlier than or equal to begin date!");
				cevt.clearGhost();
				return;
			}
			if (bmin == 5 || bmin == 25 || bmin == 35 || bmin == 55) {
				createOrEdit.setVisible(false);
				alert("The begin minute:" + bmin + ", is not supported");
				cevt.clearGhost();
				return;
			}
			if (emin == 5 || emin == 25 || emin == 35 || emin == 55) {
				createOrEdit.setVisible(false);
				alert("The end minute:" + emin + ", doesn't support");
				cevt.clearGhost();
				return;
			}			
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
			
			if(endDate.equals(beginDate)){
				cal.set(Calendar.HOUR_OF_DAY, 24);
				endDate = cal.getTime();
				emin = cal.get(Calendar.MINUTE);
			}
		}
		
		String[] colors = ((String)colorCbx.getSelectedItem().getValue()).split(",");
		ce.setHeaderColor(colors[0]);
		ce.setContentColor(colors[1]);
		ce.setBeginDate(beginDate);
		ce.setEndDate(endDate);
		ce.setContent(contentTbx.getValue());
		ce.setLocked(lockCbx.isChecked());
		((SimpleCalendarModel)calendars.getModel()).add(ce);
		
		contentTbx.setRawValue("");
		beginTimeLbx.setSelectedIndex(0);
		endTimeLbx.setSelectedIndex(0);
		createOrEdit.setVisible(false);
		Events.postEvent(new Event("onSyncModel", calendars));
	}
	
	@Listen("onClick = #deleteBtn")
	public void deleteEvent(Event event) {
		Messagebox.show("Are you sure to delete the event!", "Question",
			Messagebox.OK | Messagebox.CANCEL, Messagebox.QUESTION,
			new EventListener<Event>() {
				public void onEvent(Event evt) throws Exception {
					if (((Integer) evt.getData()).intValue() != Messagebox.OK)
						return;
					Events.postEvent(new Event("onDeleteEvent", calendars, createOrEdit.getAttribute("calevent")));
				}
			});
		createOrEdit.setVisible(false);
	}
	
	private void initWindow(CalendarsEvent calevt) {
		CalendarItem ce = calevt.getCalendarItem();
		boolean isEdit = ce != null;
		int left = calevt.getX();
		int top = calevt.getY();
		int timeslots = calendars.getTimeslots();
		int timeslotTime = 60 / timeslots;
		if (top + 245 > calevt.getDesktopHeight())
			top = calevt.getDesktopHeight() - 245;
		if (left + 410 > calevt.getDesktopWidth())
			left = calevt.getDesktopWidth() - 410;
		createOrEdit.setLeft(left + "px");
		createOrEdit.setTop(top + "px");
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
		sdf.setTimeZone(calendars.getDefaultTimeZone());
		String[] times = sdf.format(isEdit ? ce.getBeginDate() : calevt.getBeginDate()).split(":");
		int hours = Integer.parseInt(times[0]) * timeslots;
		int mins = Integer.parseInt(times[1]);
		int bdTimeSum = hours + mins;
		hours += mins / timeslotTime;
		
		beginTimeLbx.setSelectedIndex(hours * 12 / timeslots);
		times = sdf.format(isEdit ? ce.getEndDate() : calevt.getEndDate()).split(":");
		hours = Integer.parseInt(times[0]) * timeslots;
		mins = Integer.parseInt(times[1]);
		int edTimeSum = hours + mins;
		hours += mins / timeslotTime;
		endTimeLbx.setSelectedIndex(hours * 12 / timeslots);
		boolean isAllday = (bdTimeSum + edTimeSum) == 0;
		
		beginDbx.setTimeZone(calendars.getDefaultTimeZone());
		beginDbx.setValue(isEdit ? ce.getBeginDate() : calevt.getBeginDate());
		endDbx.setTimeZone(calendars.getDefaultTimeZone());
		endDbx.setValue(isEdit ? ce.getEndDate() : calevt.getEndDate());
		allDayCbx.setChecked(isAllday);
		lockCbx.setChecked(isEdit ? ce.isLocked() : false);
		beginTimeLbx.setVisible(!isAllday);
		endTimeLbx.setVisible(!isAllday);
		contentTbx.setValue(isEdit ? ce.getContent() : "");
		if (isEdit) {
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
			
			colorCbx.setSclass(colorCbx.getItems().get(index).getLabel().toLowerCase());
			colorCbx.setSelectedIndex(index);
		}
		deleteBtn.setVisible(isEdit);
		
		createOrEdit.setVisible(true);
	}
	
	private void initTimeDropdown() {
		List<String> dateTime = new LinkedList<String>();
		
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		
		for (int i = 0; i < 288; i++) {
			dateTime.add(sdf.format(calendar.getTime()));
			calendar.add(Calendar.MINUTE, 5);
		}
		
		beginTimeLbx.setModel(new ListModelList<String>(dateTime));
		endTimeLbx.setModel(new ListModelList<String>(dateTime));
		beginTimeLbx.setSelectedIndex(0);
		endTimeLbx.setSelectedIndex(0);
	}
}
