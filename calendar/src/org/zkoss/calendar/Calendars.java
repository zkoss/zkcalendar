/* Calendars.java

Purpose:
		
	Description:
		
	History:
		Mar 31, 2009 5:17:31 PM , Created by jumperchen
		Thu Nov 10 9:32:58 TST 2009, Created by Jimmy

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
 */
package org.zkoss.calendar;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TimeZone;
import java.util.UUID;

import org.zkoss.calendar.api.CalendarItem;
import org.zkoss.calendar.api.CalendarModel;
import org.zkoss.calendar.api.DateFormatter;
import org.zkoss.calendar.api.ItemRender;
import org.zkoss.calendar.api.RenderContext;
import org.zkoss.calendar.event.CalendarDataEvent;
import org.zkoss.calendar.event.CalendarDataListener;
import org.zkoss.calendar.event.CalendarDropEvent;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.Util;
import org.zkoss.lang.Classes;
import org.zkoss.lang.Objects;
import org.zkoss.util.Locales;
import org.zkoss.util.TimeZones;
import org.zkoss.zk.au.out.AuSetAttribute;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.UiException;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.sys.ContentRenderer;
import org.zkoss.zk.ui.sys.DesktopCtrl;
import org.zkoss.zul.Toolbar;
import org.zkoss.zul.impl.XulElement;

/**
 * A complete calendar component to represent a calendar to support both molds, 
 * default and month, and multi-timezone. By default mold, it can change the days
 * to show one day or a week (days equal to seven) on the calendar at the same time.
 * In the month mold, seven days is always assumed.
 * 
 * <p> The Calendars component allows only one single toolbar as its child component, and now it can
 * only manipulate the calendar item by a model named {@link CalendarModel}. And there
 * are three events, <code>onItemCreate</code>, <code>onItemEdit</code>, and
 * <code>onItemUpdate</code> that can be listened to operate the calendar event
 * triggering by user action, in addition to there are two events <code>onDayClick</code> and
 * <code>onWeekClick</code> to be triggered when user clicks on the caption of
 * the day number and the week number within the current year. Besides,
 * the calendar can also support the read-only
 * display by invoking {@link #setReadonly(boolean)}.
 * 
 * @author jumperchen,jimmy
 * 
 */
public class Calendars extends XulElement {
	private static final long serialVersionUID = 20090331171730L;
	private static final String ATTR_ON_INIT_POSTED = "org.zkoss.calendar.Calendars.onInitLaterPosted";	
	private int _firstDayOfWeek;
	private Date _curDate;
	private int _days = 7;
	private DateFormatter _dfmter;
	private Map<String, List<CalendarItem>> _items;
	private Map<TimeZone, String> _tzones;
	private Map<Object, Object> _ids;
	private CalendarModel _model;
	private transient CalendarDataListener _dataListener;
	private SimpleDateFormat _sdfKey = new SimpleDateFormat("yyyy/MM/dd");
	private boolean _readonly;
	private boolean _weekOfYear;
	private boolean _hasEmptyZone= false;
	private boolean _escapeXML = true;
	private List<CalendarItem> _addItemList, _mdyItemList, _rmItemList;
	private int _beginTime = 0, _endTime = 24, _timeslots = 2;
	
 	private static final String ATTR_ON_ADD_ITEM_RESPONSE = "org.zkoss.calendar.Calendars.onAddItemResponse";
	private static final String ATTR_ON_REMOVE_ITEM_RESPONSE = "org.zkoss.calendar.Calendars.onRemoveItemResponse";
	private static final String ATTR_ON_MODIFY_ITEM_RESPONSE = "org.zkoss.calendar.Calendars.onModifyItemResponse";
	
	private static final Comparator<CalendarItem> _defCompare = new Comparator<CalendarItem>() {
		public int compare(CalendarItem o1, CalendarItem o2) {
			return o1.getBeginDate().compareTo(o2.getBeginDate());
		}
	};
	
	static {		
		addClientEvent(Calendars.class, CalendarsEvent.ON_ITEM_CREATE, 0);
		addClientEvent(Calendars.class, CalendarsEvent.ON_ITEM_EDIT, 0);
		addClientEvent(Calendars.class, CalendarsEvent.ON_ITEM_UPDATE, 0);
		addClientEvent(Calendars.class, CalendarsEvent.ON_DAY_CLICK, CE_REPEAT_IGNORE);
		addClientEvent(Calendars.class, CalendarsEvent.ON_WEEK_CLICK, CE_REPEAT_IGNORE);
		//since 2.1.5
		addClientEvent(Calendars.class, CalendarsEvent.ON_ITEM_TOOLTIP, CE_REPEAT_IGNORE);
	}	
	
	public Calendars() {
		init();
		_curDate = getCalendar().getTime();
	}
	
	private void init() {
		_items = new HashMap<String, List<CalendarItem>>(32);
		_tzones = new LinkedHashMap<TimeZone, String>();
		_ids = new HashMap<Object, Object>(32);
		_firstDayOfWeek = getCalendar().getFirstDayOfWeek();
	}
	
	/**
	 * Sets whether enable to show the week number within the current year or not.
	 */
	public void setWeekOfYear(boolean weekOfYear) {
		if (_weekOfYear != weekOfYear) {
			_weekOfYear = weekOfYear;
			if (!"month".equals(getMold())) return;
			
			TimeZone timezone = getDefaultTimeZone();
			Calendar cal = Calendar.getInstance(timezone);
			cal.setTime(getBeginDate());
			
			smartUpdate("woy", String.valueOf(cal.get(Calendar.WEEK_OF_YEAR)));
		}
	}	
	
	/**
	 * Returns whether enable to show the week number within the current year or not.
	 * <p>Default: false
	 */
	public boolean isWeekOfYear() {
		return _weekOfYear;
	}
	
	/** Sets whether it is readonly.
	 */
	public void setReadonly(boolean readonly) {
		if (_readonly != readonly) {
			_readonly = readonly;
			smartUpdate("readonly", _readonly);
		}
	}
	
	/** Returns whether it is readonly.
	 * <p>Default: false.
	 */
	public boolean isReadonly() {
		return _readonly;
	}
	
	/**
	 * Sets the date formatter. In fact, there are five places in the calendar
	 * must have different date display.
	 * 
	 * @see DateFormatter
	 */
	public void setDateFormatter(DateFormatter dfmater) {
		if (_dfmter != dfmater) {
			_dfmter = dfmater;
			reSendDateRange();
			smartUpdate("cd", Util.getDSTTime(this.getDefaultTimeZone(), getCurrentDate()));
			reSendItemGroup();
		}
	}
	
	/**
	 * 
	 * Sets the date formatter by a class name.
	 * 
	 * @see DateFormatter
	 * @see #setDateFormatter(DateFormatter)
	 */
	public void setDateFormatter(String clsnm)
	throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException,
	InstantiationException, java.lang.reflect.InvocationTargetException {
		if (clsnm != null)
			setDateFormatter((DateFormatter)Classes.newInstanceByThread(clsnm));
	}
	
	/**
	 * Returns the date formatter.
	 * <p>
	 * Note: never null.
	 */
	public DateFormatter getDateFormatter() {
		return _dfmter;
	}	

	/**
	 * Sets the days, that is, how many column should be displayed on the default mold.
	 * <p> Default: 7. (i.e. one week), in month view, the attribute will be ignored.
	 */
	public void setDays(int days) {
		if (days <= 0) days = 1;
		if (days != _days) {
			_days = days;
			if (!inMonthMold()) {
				reSendDateRange();			
				smartUpdate("days", _days);	
				reSendItemGroup();
			}
		}
	}

	/**
	 * Returns the days.
	 * <p>Default: 7
	 */
	public int getDays() {
		return _days;
	}

	/**
	 * Sets what the first day of the week is; e.g., <code>SUNDAY</code> in the
	 * U.S., <code>MONDAY</code> in France.
	 * <p> Default: {@link Calendar#SUNDAY}
	 * <p> Note: it is only allowed when days with 7 in the default mold or using the month mold.
	 * @param value
	 *            the given first day of the week.
	 * @see #getFirstDayOfWeek()
	 * @see java.util.Calendar#setFirstDayOfWeek
	 */
	public void setFirstDayOfWeek(int value) {
		if (_firstDayOfWeek != value) {
			_firstDayOfWeek = value;
			if (_days == 7 || inMonthMold()){
				reSendDateRange();
				smartUpdate("firstDayOfWeek", _firstDayOfWeek);
				reSendItemGroup();
			}
		}
	}
	
	/**
	 * Sets what the first day of the week is.
	 * <p> Note: it is only allowed when days with 7 in the default mold or using the month mold.
	 * 
	 * @param day <code>SUNDAY</code>, <code>MONDAY</code>,
	 * <code>TUESDAY</code>, <code>WEDNESDAY</code>, <code>THURSDAY</code>, <code>FRIDAY</code>,
	 * and <code>SATURDAY</code>. Case insensitive
 	 */
	public void setFirstDayOfWeek(String day) {
		if ("SUNDAY".equalsIgnoreCase(day))
			setFirstDayOfWeek(1);
		else if ("MONDAY".equalsIgnoreCase(day))
			setFirstDayOfWeek(2);
		else if ("TUESDAY".equalsIgnoreCase(day))
			setFirstDayOfWeek(3);
		else if ("WEDNESDAY".equalsIgnoreCase(day))
			setFirstDayOfWeek(4);
		else if ("THURSDAY".equalsIgnoreCase(day))
			setFirstDayOfWeek(5);
		else if ("FRIDAY".equalsIgnoreCase(day))
			setFirstDayOfWeek(6);
		else if ("SATURDAY".equalsIgnoreCase(day))
			setFirstDayOfWeek(7);	
	}
	
	/**
	 * Gets what the first day of the week is; e.g., <code>SUNDAY</code> in the
	 * U.S., <code>MONDAY</code> in France.
	 * <p> Default: {@link Calendar#SUNDAY}
	 * 
	 * @return the first day of the week.
	 * @see #setFirstDayOfWeek(int)
	 * @see java.util.Calendar#getFirstDayOfWeek
	 */
	public int getFirstDayOfWeek() {
		return _firstDayOfWeek;
	}
		
	public void onAddDayItemResponse() {
		removeAttribute(ATTR_ON_ADD_ITEM_RESPONSE);
		response("addEvent" + getUuid(), new AuSetAttribute(this,"addDayItem",Util.encloseItemList(this, _addItemList)));
	}
	
	public void onRemoveDayItemResponse() {
		removeAttribute(ATTR_ON_REMOVE_ITEM_RESPONSE);
		response("removeEvent" + getUuid(), new AuSetAttribute(this,"removeDayItem",Util.encloseItemList(this, _rmItemList)));
	}
	
	public void onModifyDayItemResponse() {
		removeAttribute(ATTR_ON_MODIFY_ITEM_RESPONSE);
		response("modifyEvent" + getUuid(), new AuSetAttribute(this,"modifyDayItem",Util.encloseItemList(this, _mdyItemList)));
	}
	
	public void addDayItem(CalendarItem ce) {
		if (ce == null) return;
		if (_addItemList == null)
			_addItemList = new LinkedList<CalendarItem>();
		_addItemList.add(ce);
		if (getAttribute(ATTR_ON_ADD_ITEM_RESPONSE) == null) {
			setAttribute(ATTR_ON_ADD_ITEM_RESPONSE, Boolean.TRUE);
			Events.postEvent(-20000, "onAddDayItemResponse", this, null);
		}
	}
	
	public void modifyDayItem(CalendarItem ce) {
		if (ce == null) return;
		if (_mdyItemList == null)
			_mdyItemList = new LinkedList<CalendarItem>();
		_mdyItemList.add(ce);
		if (getAttribute(ATTR_ON_MODIFY_ITEM_RESPONSE) == null) {
			setAttribute(ATTR_ON_MODIFY_ITEM_RESPONSE, Boolean.TRUE);
			Events.postEvent(-20000, "onModifyDayItemResponse", this, null);
		}
	}
	
	public void removeDayItem(CalendarItem ce) {
		if (ce == null) return;
		if (_rmItemList == null)
			_rmItemList = new LinkedList<CalendarItem>();
		_rmItemList.add(ce);
		if (getAttribute(ATTR_ON_REMOVE_ITEM_RESPONSE) == null) {
			setAttribute(ATTR_ON_REMOVE_ITEM_RESPONSE, Boolean.TRUE);
			Events.postEvent(-20000, "onRemoveDayItemResponse", this, null);
		}
	}
	
	private void cleanEmptyZone() {
		Map<TimeZone, String> tzones = new HashMap<TimeZone, String>(_tzones);
		
		for (Iterator<Entry<TimeZone, String>> it = tzones.entrySet().iterator(); it.hasNext();) {
			Entry<TimeZone, String> es = it.next();
			if(es.getValue().equals(""))
				_tzones.remove(es.getKey());
		}
		_hasEmptyZone = false;
	}

	private Calendar getCalendar() {
		return Calendar.getInstance(getDefaultTimeZone(), Locales.getCurrent());
	}	
	
	/**
	 * Adds the time zone to the calendar.
	 * <p>
	 * Note: the first added will be the default time zone of the calendar.
	 * 
	 * @param label
	 *            the description of the time zone.
	 * @param timezone
	 *            a time zone. (Cannot duplicate)
	 */	
	public void addTimeZone(String label, TimeZone timezone) {
		if (label == null) label = "";
		_tzones.put(timezone, label);
		if(_hasEmptyZone)
			cleanEmptyZone();
		if (!inMonthMold() && _dfmter != null){
			Calendar cal = getCalendar();			
			cal.set(Calendar.MINUTE, 0);
			smartUpdate("captionByTimeOfDay", Util.encloseList(Util.packCaptionByTimeOfDay(cal, _tzones, Locales.getCurrent(), _dfmter)));
		}
		
		TimeZone tz = getDefaultTimeZone();
		smartUpdate("tz", (tz.getRawOffset())/60000);
		smartUpdate("bd", Util.getDSTTime(tz,getBeginDate()));
		smartUpdate("ed", Util.getDSTTime(tz,getEndDate()));
		reSendItemGroup();
	}

	/**
	 * Adds the time zone to the calendar.
	 * <p>
	 * Note: the first added will be the default time zone of the calendar.
	 * 
	 * @param label
	 *            the description of the time zone.
	 * @param timezone
	 *            a id of time zone. (Cannot duplicate)
	 * @see TimeZone#getTimeZone(String)
	 * @see #addTimeZone(String, TimeZone)
	 */
	public void addTimeZone(String label, String timezone) {
		addTimeZone(label, TimeZone.getTimeZone(timezone));
	}

	/**
	 * Sets the time zone to the calendar, it is easily used for ZUL file. e.g.
	 * 
	 * <pre>
	 * &lt;calendars timeZone=&quot;Taiwan=GMT+8, Sweden=GMT+1,&quot;&gt;
	 * </pre>
	 * 
	 * @param timezone
	 */
	public void setTimeZone(String timezone) {
		if (timezone == null)
			throw new IllegalArgumentException("The timezone is null!");
		
		
		String[] ary = timezone.trim().split(",");
		for (int i = 0, j = ary.length; i < j; i++) {
			String timezoneString = ary[i];
			String[] pair = timezoneString.split("=");
			addTimeZone(pair[0].trim(), pair[1].trim());
		}
	}

	/**
	 * Removes the time zone from the calendar
	 */
	public boolean removeTimeZone(TimeZone timezone) {
		if (_tzones.remove(timezone) != null) {
			TimeZone tz = getDefaultTimeZone();
			smartUpdate("bd", Util.getDSTTime(tz,getBeginDate()));
			smartUpdate("ed", Util.getDSTTime(tz,getEndDate()));
			reSendItemGroup();
			return true;
		}		
		return false;
	}

	/**
	 * Returns the current time zone of the calendar.
	 */
	public TimeZone getDefaultTimeZone() {
		if (_tzones.isEmpty()) {
			_hasEmptyZone = true;
			TimeZone t = TimeZones.getCurrent();
			_tzones.put(t, "");
			return t;
		}
		return (TimeZone) _tzones.keySet().iterator().next();
	}

	/**
	 * Returns the unmodifiable map including all the timezone inside the
	 * calendar.
	 */
	public Map<TimeZone, String> getTimeZones() {
		return Collections.unmodifiableMap(_tzones);
	}
		
	public String getCalendarItemId(CalendarItem ce) {
		Object o = _ids.get(ce);
		if (o == null && super.getDesktop() != null) {
			o = ((DesktopCtrl)getDesktop()).getNextUuid(this);
			_ids.put(o, ce);
			_ids.put(ce, o);
		} else if (o == null) {
			o = UUID.randomUUID().toString();
        	}
		return (String) o;
	}	
	
	public CalendarItem getCalendarItemById(String id) {
		return (CalendarItem)_ids.get(id);
	}
	
	protected String getItemKey(CalendarItem evt) {
		Date begin = evt.getBeginDate();
		Date end = evt.getEndDate();
		if (begin == null)
			throw new UiException("Begin date cannot be null: " + evt);
		if (end == null)
			throw new UiException("End date cannot be null: " + evt);
		return getItemKey(begin);
	}	
	
	private String getItemKey(Date date) {
		return _sdfKey.format(date);
	}

	/**
	 * Returns the unmodifiable list including all the calendar items matching
	 * from the specified date in the same date. e.g. "20090324" exclusive the
	 * time of the date "23:30".
	 * <p>
	 * Note: never null.
	 */
	public List<CalendarItem> getItem(Date beginDate) {
		String key = getItemKey(beginDate);
		List<CalendarItem> list =  _items.get(key);
		if (list != null)
			Collections.sort(list, getDefaultBeginDateComparator());
		else list = Collections.emptyList();
		return Collections.unmodifiableList(list);
	}
	
	private static final Comparator<CalendarItem> getDefaultBeginDateComparator() {
		return _defCompare;
	}
	
	/**
	 * Navigates the current date to the previous page, that is, when the {@link #getDays()}
	 * is seven with default mold, the previous page means the previous week.
	 * In the month mold, it means the previous month.
	 */
	public void previousPage() {
		movePage(-1);
	}

	/**
	 * Navigates the current date to the next page, that is, when the {@link #getDays()}
	 * is seven with default mold, the next page means the next week.
	 * In the month mold, it means the next month.
	 */	
	public void nextPage() {		
		movePage(1);		
	}

	private void movePage(int day) {
		if (_curDate == null) return;
		
		Calendar cal = getCalendar();
		cal.setTime(_curDate);
		if (inMonthMold())
			cal.add(Calendar.MONTH, day);
		else
			cal.add(Calendar.DAY_OF_MONTH, day * _days);
		setCurrentDate(cal.getTime());
	}
	
	/**
	 * Returns the beginning date, which is based on {@link #getCurrentDate()} in
	 * the current view depended on which {@link #getMold()} is using.
	 */
	public Date getBeginDate() {
		if (_curDate == null) return null; 

		Calendar cal = getCalendar();
		cal.setTime(_curDate);
		boolean inMonth = inMonthMold();
		if (inMonth)
			cal.set(Calendar.DAY_OF_MONTH, 1);
			
		if (_days >= 7 || inMonth) { //ZKCAL-34: should consider _firstDayOfWeek if week view is large than 7
			int index = cal.get(Calendar.DAY_OF_WEEK);
			int offset = index - _firstDayOfWeek;
			if (offset < 0) offset += 7;
			cal.add(Calendar.DAY_OF_MONTH, -offset);
		}
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		
		return cal.getTime();
	}

	/**
	 * Returns the end date, which is based on {@link #getCurrentDate()} in the
	 * current view depended on which {@link #getMold()} is using. 
	 */
	public Date getEndDate() {
		Date beginDate = getBeginDate();
		
		if (beginDate == null) return null;
		
		Calendar cal = getCalendar();

		if (inMonthMold()) {
			int weeks = getWeekOfMonth();
			cal.setTime(_curDate);			
			cal.set(Calendar.DAY_OF_MONTH, 1);
			int offset = cal.get(Calendar.DAY_OF_WEEK) - _firstDayOfWeek;
			if (offset < 0)
				offset += 7;
			
			cal.add(Calendar.DAY_OF_MONTH, weeks * 7 - offset);				
			
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);	
		} else {
			cal.setTime(beginDate);
			cal.add(Calendar.DAY_OF_MONTH, _days);
		}
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTime();
	}

	/**
	 * Sets the current date.
	 * <p> Default: today (depend on which timezone the system is using).
	 */
	public void setCurrentDate(Date curDate) {
		if (curDate == null) throw new NullPointerException("Current Date cannot be null!");
		if (!Objects.equals(curDate, _curDate)) {
			_curDate = curDate;
			reSendDateRange();
			smartUpdate("cd", Util.getDSTTime(this.getDefaultTimeZone(),getCurrentDate()));
			reSendItemGroup();
		}
	}

	/**
	 * Returns the current date.
	 * <p> Default: today (depend on which timezone the calendar is using).
	 */
	public Date getCurrentDate() {
		return _curDate;
	}
	/**
	 * @since 2.1.0
	 * Sets the begin time.
	 * <p> Default: 0.
	 */
	public void setBeginTime(int beginTime) {
		if (0 > beginTime || beginTime > 24)
			throw new IllegalArgumentException("Illegal begin time: " + beginTime + ", time range only allows from 0 to 24");
		if (beginTime > _endTime)
			throw new IllegalArgumentException("Illegal begin time: " + beginTime + ", begin time shall not later then end time: " + _endTime);
		
		if (_beginTime != beginTime) {
			_beginTime = beginTime;
			smartUpdate("bt", beginTime);
			reSendItemGroup();
		}
	}
	/**
	 * @since 2.1.0
	 * Returns the begin time.
	 * <p> Default: 0.
	 */
	public int getBeginTime() {
		return _beginTime;
	}
	/**
	 * @since 2.1.0
	 * Sets the end time.
	 * <p> Default: 24.
	 */
	public void setEndTime(int endTime) {
		if (0 > endTime || endTime > 24)
			throw new IllegalArgumentException("Illegal end time: " + endTime + ", time range only allows from 0 to 24");
		if (_beginTime > endTime)
			throw new IllegalArgumentException("Illegal end time: " + endTime + ", end time shall not early then begin time: " + _beginTime);
		if (_endTime != endTime) {
			_endTime = endTime;
			smartUpdate("et", endTime);
			reSendItemGroup();
		}
	}
	/**
	 * @since 2.1.0
	 * Returns the end time.
	 * <p> Default: 24.
	 */
	public int getEndTime() {
		return _endTime;
	}
	/**
	 * @since 2.1.0
	 * Sets the time slot per hour.
	 * <p> Default: 2.
	 */
	public void setTimeslots(int timeslots) {
		if (timeslots != 2 && timeslots != 4 && timeslots != 6)
		throw new UiException("allowed: 2 or 4 or 6");
		
		if (_timeslots != timeslots) {
			this._timeslots = timeslots;
			smartUpdate("timeslots", timeslots);
			reSendItemGroup();
		}
	}
	/**
	 * @since 2.1.0
	 * Returns the time slot per hour.
	 * <p> Default: 2.
	 */
	public int getTimeslots() {
		return _timeslots;
	}
	
	private void reSendDateRange(){
		Date beginDate = getBeginDate();
		Date endDate = getEndDate();
		TimeZone timezone = getDefaultTimeZone();
		smartUpdate("bd", Util.getDSTTime(timezone, beginDate));
		smartUpdate("ed", Util.getDSTTime(timezone, endDate));	
		Calendar cal = getCalendar();
		if (inMonthMold()){
			smartUpdate("weekOfMonth", getWeekOfMonth());
			if (isWeekOfYear() && _dfmter == null) {
				cal.setTime(beginDate);
				smartUpdate("woy", String.valueOf(cal.get(Calendar.WEEK_OF_YEAR)));
			}
		}
		
		DateFormatter dfhandler = getDateFormatter();		
		if(dfhandler == null) return;
		final Locale locale = Locales.getCurrent();	
		cal.setTime(beginDate);
		
		if (inMonthMold()) {
			List<List<String>> result = Util.packAllCaptionOfMonth(this, cal, locale, timezone, dfhandler);
			smartUpdate("captionByDayOfWeek", Util.encloseList(result.get(0)));				
			smartUpdate("captionByPopup", Util.encloseList(result.get(1)));
			smartUpdate("captionByDateOfMonth", Util.encloseList(result.get(2)));

			if (isWeekOfYear())
				smartUpdate("captionByWeekOfYear", Util.encloseList(result.get(3)));
		} else
			smartUpdate("captionByDate", Util.encloseList(Util.packCaptionByDate(cal, getDays(), locale, timezone, dfhandler)));
		
	}

	/**
	 * Returns the number of the week of the month in the current date.
	 */
	public int getWeekOfMonth() {
		Calendar cal = getCalendar();
		// calculate how many weeks we should display
		cal.setTime(_curDate);
		int maximun = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
		
		if (cal.getFirstDayOfWeek() != _firstDayOfWeek) {
			cal.set(Calendar.DAY_OF_MONTH, 1);
			int beginIndex = cal.get(Calendar.DAY_OF_WEEK);
			int offset = beginIndex - _firstDayOfWeek;
			if (offset < 0)
				offset += 7;
			
			int week = 1;
			int delta = maximun - (7 - offset);
			week += delta/ 7;

			// add one for the rest days
			if (delta % 7 != 0) 
				++week;
			return week;
		} else {
			
			// The fixed provided by david.hamilton@jiffle.net 
			cal.set(Calendar.DAY_OF_MONTH, maximun);
			int last = cal.get(Calendar.WEEK_OF_MONTH);
			cal.set(Calendar.DAY_OF_MONTH, 1);
			return last - cal.get( Calendar.WEEK_OF_MONTH) + 1;
		}
	}
	
	protected void reSendItemGroup() {
		if (getAttribute(ATTR_ON_INIT_POSTED) == null) {
			setAttribute(ATTR_ON_INIT_POSTED, Boolean.TRUE);
			Events.postEvent(-10100, "onInitRender", this, null);
		}
	}
	
	public void onInitRender() {
		removeAttribute(ATTR_ON_INIT_POSTED);
		_items.clear();
		_ids.clear();
		
		final TimeZone tzone = getDefaultTimeZone();		
		
		smartUpdate("zonesOffset", Util.encloseList(Util.packZonesOffset(_tzones)));			
		smartUpdate("zones", Util.encloseList(_tzones.values()));
		// reset default timezone
		_sdfKey.setTimeZone(tzone);
		if (_model != null) {
			Date beginDate = getBeginDate();
			List<CalendarItem> list = _model.get(beginDate, getEndDate(),
					new RenderContext() {
						public TimeZone getTimeZone() {
							return tzone;
						}
					});

			if (list != null) {
				for (Iterator<CalendarItem> it = list.iterator(); it.hasNext();) {
					CalendarItem ci = it.next();
					if (ci.getBeginDate().after(ci.getEndDate()))
						throw new IllegalArgumentException("Illegal date: from " + ci.getBeginDate() + " to " + ci.getEndDate());
					
					String key = ci.getBeginDate().before(beginDate) ?
										getItemKey(beginDate):
										getItemKey(ci.getBeginDate());
					
					List<CalendarItem> dayItems = _items.get(key);
					if (dayItems == null) {
						dayItems = new LinkedList<CalendarItem>();
						_items.put(key, dayItems);
					} 
					dayItems.add(ci);
				}
			}
		}
		smartUpdate("items", Util.encloseItemMap(this, _items));
	}
	
	public Toolbar getToolbar() {
		return (Toolbar)getFirstChild();
	}

	/**
	 * Returns the calendar model.
	 */
	public CalendarModel getModel() {
		return _model;
	}	

	/**
	 * Sets the calendar model.
	 */
	public void setModel(CalendarModel model) {
		if (model != null) {
			if (_model != model) {
				if (_model != null) {
					_model.removeCalendarDataListener(_dataListener);
				}
				_model = model;
				initDataListener();
			}
		} else if (_model != null) {
			_model.removeCalendarDataListener(_dataListener);
			_model = null;
		}
		reSendItemGroup();
	}
	
	/** Initializes _dataListener and register the listener to the model
	 */
	private void initDataListener() {
		if (_dataListener == null)
			_dataListener = new CalendarDataListener() {
				public void onChange(CalendarDataEvent event) {
					CalendarItem ci = event.getCalendarItem();
					if (ci == null) {	// if large scope change, such as clearAll
						reSendItemGroup();
						return;
					}
					switch (event.getType()) {
					case CalendarDataEvent.INTERVAL_ADDED:
						addDayItem(event.getCalendarItem());
						break;
					case CalendarDataEvent.INTERVAL_REMOVED:				
						removeDayItem(event.getCalendarItem());
						break;
					case CalendarDataEvent.CONTENTS_CHANGED:	
						modifyDayItem(event.getCalendarItem());
					}
				}
			};

		_model.addCalendarDataListener(_dataListener);
	}
	
	public void setMold(String mold) {
		if (mold == null || mold.length() == 0)
			mold = "default";
		if (!Objects.equals(getMold(), mold)) {
			super.setMold(mold);
			reSendItemGroup();
		}
	}
	
	/**package*/ boolean inMonthMold() {
		return "month".equals(getMold());
	}

	/**
	 * Sets whether the item content escape XML
	 * @param escapeXML
	 */
	public void setEscapeXML(boolean escapeXML) {
		if (_escapeXML != escapeXML) {
			this._escapeXML = escapeXML;
			smartUpdate("escapeXML", escapeXML);
			reSendItemGroup();
		}
	}
	/**
	 * Return whether the item content escape XML
	 * @return boolean
	 */
	public boolean isEscapeXML() {
		return _escapeXML;
	}
	
	// super
	public String getZclass() {
		return _zclass == null ?  "z-calendars" : _zclass;
	}

	// -- Component --//	
	public boolean insertBefore(Component newChild, Component refChild) {
		if (newChild instanceof Toolbar) {
			Component first = getFirstChild();
			if (first instanceof Toolbar && first != newChild)
				throw new UiException("Only one toolbar child is allowed: "
						+ this);
			refChild = first;
		} else {
			throw new UiException("Unsupported child for Calendars: "
					+ newChild);
		}
		return super.insertBefore(newChild, refChild);
	}	

	//Cloneable//
	public Object clone() {
		final Calendars clone = (Calendars)super.clone();
		clone.init();
		if (clone._model != null) {
			//we use the same data model but we have to create a new listener
			clone._dataListener = null;
			clone.initDataListener();
		}
		return clone;
	}

	//-- Serializable --//
	private synchronized void readObject(java.io.ObjectInputStream s)
	throws java.io.IOException, ClassNotFoundException {
		s.defaultReadObject();
		init();
		if (_model != null) initDataListener();
	}	
	
	public void service(org.zkoss.zk.au.AuRequest request, boolean everError) {
		final String cmd = request.getCommand();
		
		if (cmd.equals(CalendarsEvent.ON_ITEM_CREATE))
			Events.postEvent(CalendarsEvent.getCreateEvent(request));
		else if (cmd.equals(CalendarsEvent.ON_ITEM_EDIT))
			Events.postEvent(CalendarsEvent.getEditEvent(request));
		else if (cmd.equals(CalendarsEvent.ON_ITEM_UPDATE))
			Events.postEvent(CalendarsEvent.getUpdateEvent(request));
		else if (cmd.equals(CalendarsEvent.ON_DAY_CLICK) || 
				cmd.equals(CalendarsEvent.ON_WEEK_CLICK))
			Events.postEvent(CalendarsEvent.getClickEvent(request, cmd));
		else if (cmd.equals(Events.ON_DROP)) {
			Events.postEvent(CalendarDropEvent.getCalendarDropEvent(request));
		} else if (cmd.equals(CalendarsEvent.ON_ITEM_TOOLTIP)) {
			Events.postEvent(CalendarsEvent.getTooltipEvent(request));
		} else {
			super.service(request, everError);
		}
	}

	/*
	 * (non-Javadoc)
	 * @see org.zkoss.zul.impl.XulElement#renderProperties(org.zkoss.zk.ui.sys.ContentRenderer)
	 */
	protected void renderProperties(org.zkoss.zk.ui.sys.ContentRenderer renderer)
			throws IOException {
		super.renderProperties(renderer);		
		TimeZone tz = getDefaultTimeZone();
		renderer.render("tz", (tz.getRawOffset())/60000);
					
		renderer.render("zonesOffset", Util.encloseList(Util.packZonesOffset(_tzones)));
		renderer.render("zones", Util.encloseList(_tzones.values()));
		
		if (inMonthMold()) {
			renderer.render("mon", true);
			renderer.render("weekOfMonth", getWeekOfMonth());
			
			if (_weekOfYear) {
				Calendar cal = getCalendar();
				cal.setTime(getBeginDate());
				renderer.render("woy", String.valueOf(cal.get(Calendar.WEEK_OF_YEAR)));
			}
			if (_dfmter != null) rendererMonthData(_dfmter, renderer);
		} else {
			if (_dfmter != null) rendererDayData(_dfmter ,renderer);
			if (_beginTime != 0)
				renderer.render("bt", _beginTime);
			if (_beginTime != 24)
				renderer.render("et", _endTime);
			if (_timeslots != 2)
				renderer.render("timeslots", _timeslots);
		}
		
		renderer.render("bd", Util.getDSTTime(tz,getBeginDate()));
		renderer.render("ed", Util.getDSTTime(tz,getEndDate()));
		renderer.render("cd", Util.getDSTTime(tz,getCurrentDate()));
		
		if (_readonly)
			renderer.render("readonly", true);
		
		renderer.render("days", _days);
		renderer.render("escapeXML", _escapeXML);
		renderer.render("items", Util.encloseItemMap(this, _items));
		String pattern = ((SimpleDateFormat) DateFormat.getDateInstance(
				DateFormat.SHORT, Locales.getCurrent())).toPattern().replaceAll(
				"[^\\p{Alpha}]*y+[^\\p{Alpha}]*", "");
		renderer.render("weekFmt", pattern);
	}		

	private void rendererDayData(DateFormatter dfhandler, ContentRenderer renderer) throws IOException {
		final Locale locale = Locales.getCurrent();
		Calendar cal = getCalendar();
		cal.setTime(getBeginDate());

		renderer.render("captionByDate", Util.encloseList(Util.packCaptionByDate(cal, getDays(), locale, getDefaultTimeZone(), dfhandler)));

		cal.set(Calendar.MINUTE, 0);
		renderer.render("captionByTimeOfDay", Util.encloseList(Util.packCaptionByTimeOfDay(cal, _tzones, locale, dfhandler)));
	}

	private void rendererMonthData(DateFormatter dfhandler, ContentRenderer renderer) throws IOException {
		Calendar cal = getCalendar();
		cal.setTime(getBeginDate());

		List<List<String>> result = Util.packAllCaptionOfMonth(this, cal, Locales.getCurrent(), getDefaultTimeZone(), dfhandler);
		renderer.render("captionByDayOfWeek", Util.encloseList(result.get(0)));
		renderer.render("captionByPopup", Util.encloseList(result.get(1)));
		renderer.render("captionByDateOfMonth", Util.encloseList(result.get(2)));

		if (isWeekOfYear())
			renderer.render("captionByWeekOfYear", Util.encloseList(result.get(3)));
	}
	
	/**
	 * @deprecated As of release 2.0-RC
	 * Returns the item renderer used for {@link CalendarItem} to draw its
	 * outline (i.e. HTML), like the DSP renderer of ZK component.
	 * <p>
	 * Note: never null.
	 */
	public ItemRender getItemRender() {
		return null;
	}

	/**
	 * @deprecated As of release 2.0-RC
	 * Sets the item renderer.
	 */
	public void setItemRender(ItemRender render) {
		
	}


 }
