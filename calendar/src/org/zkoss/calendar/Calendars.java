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
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;

import org.zkoss.json.JSONArray;
import org.zkoss.calendar.api.*;
import org.zkoss.calendar.event.*;
import org.zkoss.calendar.impl.SimpleDateFormatter;
import org.zkoss.calendar.impl.Util;
import org.zkoss.lang.*;
import org.zkoss.util.Locales;
import org.zkoss.zk.au.out.AuSetAttribute;
import org.zkoss.zk.ui.*;
import org.zkoss.zk.ui.event.*;
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
 * <p> The Calendars component doesn't allow any child component, and now it can
 * only manipulate the calendar event by a model named {@link CalendarModel}. And there
 * are three events, <code>onEventCreate</code>, <code>onEventEdit</code>, and 
 * <code>onEventUpdate</code> that can be listened to operate the calendar event
 * triggering by user action, in addition to there are two events <code>onDayClick</code> and
 * <code>onWeekClick</code> to be triggered when user clicks on the caption of
 * the day number and the week number within the current year. Besides,
 * the calendar can also support the read-only
 * display by invoking {@link #setReadonly(boolean)}.
 * 
 * @author jumperchen,jimmy
 * 
 */
public class Calendars extends XulElement implements
		org.zkoss.calendar.api.Calendars {
	private static final long serialVersionUID = 20090310L;
	private static final String ATTR_ON_INIT_POSTED = "org.zkoss.calendar.Calendars.onInitLaterPosted";	
	private int _firstDayOfWeek;
	private Date _curDate;
	private int _days = 7;
	private DateFormatter _dfmter;
	private Map<String, List<CalendarEvent>> _evts;
	private Map<TimeZone, String> _tzones;
	private Map<Object, Object> _ids;
	private CalendarModel _model;
	private transient CalendarDataListener _dataListener;
	private SimpleDateFormat _sdfKey = new SimpleDateFormat("yyyy/MM/dd");
	private boolean _readonly;
	private boolean _weekOfYear;
	private boolean _hasEmptyZone= false;
	private List<CalendarEvent> _addEvtList, _mdyEvtList, _rmEvtList;
	
 	private static final String ATTR_ON_ADD_EVENT_RESPONSE = "org.zkoss.calendar.Calendars.onAddEventResponse";
	private static final String ATTR_ON_REMOVE_EVENT_RESPONSE = "org.zkoss.calendar.Calendars.onRemoveEventResponse";
	private static final String ATTR_ON_MODIFY_EVENT_RESPONSE = "org.zkoss.calendar.Calendars.onModifyEventResponse";
	
	private static final Comparator<CalendarEvent> _defCompare = new Comparator<CalendarEvent>() {
		public int compare(CalendarEvent arg0, CalendarEvent arg1) {
			return arg0.getBeginDate().compareTo(arg1.getBeginDate());
		}
	};
	
	static {		
		addClientEvent(Calendars.class, "onEventCreate", 0);
		addClientEvent(Calendars.class, "onEventEdit", 0);
		addClientEvent(Calendars.class, "onEventUpdate", 0);
		addClientEvent(Calendars.class, "onDayClick", CE_REPEAT_IGNORE);
		addClientEvent(Calendars.class, "onWeekClick", CE_REPEAT_IGNORE);
	}	
	
	public Calendars() {
		init();
		_curDate = Calendar.getInstance().getTime();
		
		//for test
		_dfmter= new SimpleDateFormatter();
		_weekOfYear = true;
	}
	
	private void init() {
		_evts = new HashMap<String, List<CalendarEvent>>(32);
		_tzones = new LinkedHashMap<TimeZone, String>();
		_ids = new HashMap<Object, Object>(32);
		_firstDayOfWeek = Calendar.getInstance().getFirstDayOfWeek();
	}
	
	/**
	 * Sets whether enable to show the week number within the current year or not.
	 */
	public void setWeekOfYear(boolean weekOfYear) {
		if (_weekOfYear != weekOfYear) {
			_weekOfYear = weekOfYear;
			if ("month".equals(getMold())) 
				smartUpdate("woy", _weekOfYear);
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
			smartUpdate("cd", getCurrentDate().getTime());
			reSendEventGroup();
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
				reSendEventGroup();
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
				reSendEventGroup();
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
		
	public void onAddDayEventResponse() {
		removeAttribute(ATTR_ON_ADD_EVENT_RESPONSE);
		response("addEvent" + getUuid(), new AuSetAttribute(this,"addDayEvent",Util.encloseEventList(this, _addEvtList)));
	}
	
	public void onRemoveDayEventResponse() {
		removeAttribute(ATTR_ON_REMOVE_EVENT_RESPONSE);
		response("removeEvent" + getUuid(), new AuSetAttribute(this,"removeDayEvent",Util.encloseEventList(this, _rmEvtList)));
	}
	
	public void onModifyDayEventResponse() {
		removeAttribute(ATTR_ON_MODIFY_EVENT_RESPONSE);
		response("modifyEvent" + getUuid(), new AuSetAttribute(this,"modifyDayEvent",Util.encloseEventList(this, _mdyEvtList)));
	}
	
	public void addDayEvent(CalendarEvent ce){
		if (ce == null) return;
		if (_addEvtList == null)
			_addEvtList = new LinkedList<CalendarEvent>();
		_addEvtList.add(ce);
		if (getAttribute(ATTR_ON_ADD_EVENT_RESPONSE) == null) {
			setAttribute(ATTR_ON_ADD_EVENT_RESPONSE, Boolean.TRUE);
			Events.postEvent(-20000, "onAddDayEventResponse", this, null);
		}
	}
	
	public void modifyDayEvent(CalendarEvent ce) {
		if (ce == null) return;
		if (_mdyEvtList == null)
			_mdyEvtList = new LinkedList<CalendarEvent>();
		_mdyEvtList.add(ce);
		if (getAttribute(ATTR_ON_MODIFY_EVENT_RESPONSE) == null) {
			setAttribute(ATTR_ON_MODIFY_EVENT_RESPONSE, Boolean.TRUE);
			Events.postEvent(-20000, "onModifyDayEventResponse", this, null);
		}
	}
	
	public void removeDayEvent(CalendarEvent ce){
		if (ce == null) return;
		if (_rmEvtList == null)
			_rmEvtList = new LinkedList<CalendarEvent>();
		_rmEvtList.add(ce);
		if (getAttribute(ATTR_ON_REMOVE_EVENT_RESPONSE) == null) {
			setAttribute(ATTR_ON_REMOVE_EVENT_RESPONSE, Boolean.TRUE);
			Events.postEvent(-20000, "onRemoveDayEventResponse", this, null);
		}
	}
	
	private void cleanEmptyZone(){
		Map<TimeZone, String> tzones = new HashMap<TimeZone, String>(_tzones);		
		for (Entry<TimeZone, String> es : tzones.entrySet()) {
			if(es.getValue().equals(""))
				_tzones.remove(es.getKey());
		}
		_hasEmptyZone = false;
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
			Calendar cal = Calendar.getInstance(getDefaultTimeZone());			
			cal.set(Calendar.MINUTE, 0);
			smartUpdate("captionByTimeOfDay", Util.encloseList(Util.packCaptionByTimeOfDay(cal, _tzones, Locales.getCurrent(), _dfmter)));
		}
		
		TimeZone tz = getDefaultTimeZone();		
		smartUpdate("tz", (tz.getRawOffset() + (tz.inDaylightTime(Calendar.getInstance(tz).getTime()) ? tz.getDSTSavings() : 0))/60000);
		smartUpdate("bd", getBeginDate().getTime());
		smartUpdate("ed", getEndDate().getTime());
		reSendEventGroup();
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
		
		for (String timezoneString : timezone.trim().split(",")) {
			String[] pair = timezoneString.split("=");
			addTimeZone(pair[0].trim(), pair[1].trim());
		}
	}

	/**
	 * Removes the time zone from the calendar
	 */
	public boolean removeTimeZone(TimeZone timezone) {
		if (_tzones.remove(timezone) != null) {
			smartUpdate("bd", getBeginDate().getTime());
			smartUpdate("ed", getEndDate().getTime());
			reSendEventGroup();
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
			TimeZone t = TimeZone.getDefault();
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
		
	public String getCalendarEventId(CalendarEvent ce) {
		Object o = _ids.get(ce);
		if (o == null) {
			o = ((DesktopCtrl)getDesktop()).getNextUuid();
			_ids.put(o, ce);
			_ids.put(ce, o);
		}
		return (String) o;
	}	
	
	public CalendarEvent getCalendarEventById(String id) {
		return (CalendarEvent)_ids.get(id);
	}
	
	protected String getEventKey(CalendarEvent evt) {
		Date begin = evt.getBeginDate();
		Date end = evt.getEndDate();
		if (begin == null)
			throw new UiException("Begin date cannot be null: " + evt);
		if (end == null)
			throw new UiException("End date cannot be null: " + evt);
		return getEventKey(begin);
	}	
	
	private String getEventKey(Date date) {
		return _sdfKey.format(date);
	}

	/**
	 * Returns the unmodifiable list including all the calendar events matching
	 * from the specified date in the same date. e.g. "20090324" exclusive the
	 * time of the date "23:30".
	 * <p>
	 * Note: never null.
	 */
	public List<CalendarEvent> getEvent(Date beginDate) {
		String key = getEventKey(beginDate);
		List<CalendarEvent> list =  _evts.get(key);
		if (list != null)
			Collections.sort(list, getDefaultBeginDateComparator());
		else list = Collections.emptyList();
		return Collections.unmodifiableList(list);
	}
	
	private static final Comparator<CalendarEvent> getDefaultBeginDateComparator() {
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
		
		Calendar cal = Calendar.getInstance(getDefaultTimeZone());
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

		TimeZone t = getDefaultTimeZone();

		Calendar cal = Calendar.getInstance(t);
		cal.setTimeZone(t);
		cal.setTime(_curDate);
		boolean inMonth = inMonthMold();
		if (inMonth)
			cal.set(Calendar.DAY_OF_MONTH, 1);
			
		if (_days == 7 || inMonth) {
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
		
		Calendar cal = Calendar.getInstance(getDefaultTimeZone());

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
			smartUpdate("cd", getCurrentDate().getTime());
			reSendEventGroup();
		}
	}

	/**
	 * Returns the current date.
	 * <p> Default: today (depend on which timezone the calendar is using).
	 */
	public Date getCurrentDate() {
		return _curDate;
	}

	private void reSendDateRange(){
		Date beginDate = getBeginDate();
		
		smartUpdate("bd", beginDate.getTime());
		smartUpdate("ed", getEndDate().getTime());	
		if (inMonthMold())
			smartUpdate("weekOfMonth", getWeekOfMonth());
		
		DateFormatter dfhandler = getDateFormatter();		
		if(dfhandler == null) return;
		
		final Locale locale = Locales.getCurrent();	
		TimeZone timezone = getDefaultTimeZone();	
		Calendar cal = Calendar.getInstance(timezone);
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
		Calendar cal = Calendar.getInstance(getDefaultTimeZone());
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
			cal.set(Calendar.DAY_OF_MONTH, maximun);
			return cal.get(Calendar.WEEK_OF_MONTH);
		}
	}
	
	private void reSendEventGroup() {
		if (getAttribute(ATTR_ON_INIT_POSTED) == null) {
			setAttribute(ATTR_ON_INIT_POSTED, Boolean.TRUE);
			Events.postEvent(-10100, "onInitRender", this, null);
		}
	}
	
	public void onInitRender() {
		removeAttribute(ATTR_ON_INIT_POSTED);
		_evts.clear();
		_ids.clear();
		
		final TimeZone tzone = getDefaultTimeZone();		
		
		smartUpdate("zonesOffset", Util.encloseList(Util.packZonesOffset(_tzones)));			
		smartUpdate("zones", Util.encloseList(_tzones.values()));
		// reset default timezone
		_sdfKey.setTimeZone(tzone);
		
		if (_model != null) {
			List<CalendarEvent> list = _model.get(getBeginDate(), getEndDate(),
					new RenderContext() {
						public TimeZone getTimeZone() {
							return tzone;
						}
					});

			if (list != null) {
				for (CalendarEvent ce : list) {
					if (!ce.getBeginDate().before(ce.getEndDate()))
						throw new IllegalArgumentException("Illegal date: from " + ce.getBeginDate() + " to " + ce.getEndDate());
					
					String key = ce.getBeginDate().before(getBeginDate()) ?
										getEventKey(getBeginDate()): 
										getEventKey(ce.getBeginDate());
				
					
					List<CalendarEvent> dayevt =  _evts.get(key);
					if (dayevt == null) {
						dayevt = new LinkedList<CalendarEvent>();
						_evts.put(key, dayevt);
					} 
					dayevt.add(ce);
				}
			}
		}		
		smartUpdate("events", Util.encloseEventMap(this, _evts.values()));
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
		reSendEventGroup();
	}
	
	/** Initializes _dataListener and register the listener to the model
	 */
	private void initDataListener() {
		if (_dataListener == null)
			_dataListener = new CalendarDataListener() {
				public void onChange(CalendarDataEvent event) {
					switch (event.getType()) {
					case CalendarDataEvent.INTERVAL_ADDED:
						addDayEvent(event.getCalendarEvent());			
						break;
					case CalendarDataEvent.INTERVAL_REMOVED:				
						removeDayEvent(event.getCalendarEvent());			
						break;
					case CalendarDataEvent.CONTENTS_CHANGED:	
						modifyDayEvent(event.getCalendarEvent());			
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
			reSendEventGroup();
		}
	}
	
	/**package*/ boolean inMonthMold() {
		return "month".equals(getMold());
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
		final JSONArray data = (JSONArray) request.getData().get("data");
		boolean onEvtCreate = cmd.equals("onEventCreate");

		if (onEvtCreate || cmd.equals("onEventEdit") || cmd.equals("onEventUpdate")) {

			int fieldNum = 6;

			if (cmd.equals("onEventEdit")) fieldNum--;
			if (cmd.equals("onEventUpdate")) fieldNum++;			
			final Calendars cmp = Util.verifyEvent(this, request, data, fieldNum);

			CalendarEvent ce = null;

			if (!cmd.equals("onEventCreate"))
				ce = cmp.getCalendarEventById(String.valueOf(data.get(0)));

			if (onEvtCreate || ce != null)
				Events.postEvent(Util.createCalendarsEvent(cmd, cmp, ce, data));

		} else if (cmd.equals("onDayClick") || cmd.equals("onWeekClick")) {
			
			final Calendars cmp = Util.verifyEvent(this, request, data, 1);
			Events.postEvent(new Event(cmd, cmp, new Date(Long.parseLong(String.valueOf(data.get(0))))));
			
		} else super.service(request, everError);
	}	

	/*
	 * (non-Javadoc)
	 * @see org.zkoss.zul.impl.XulElement#renderProperties(org.zkoss.zk.ui.sys.ContentRenderer)
	 */
	protected void renderProperties(org.zkoss.zk.ui.sys.ContentRenderer renderer)
			throws IOException {
		super.renderProperties(renderer);		
		TimeZone tz = getDefaultTimeZone();
		renderer.render("tz", (tz.getRawOffset() + (tz.inDaylightTime(Calendar.getInstance(tz).getTime()) ? tz.getDSTSavings() : 0))/60000);
					
		renderer.render("zonesOffset", Util.encloseList(Util.packZonesOffset(_tzones)));
		renderer.render("zones", Util.encloseList(_tzones.values()));
		
		if (inMonthMold()) {
			renderer.render("mon", true);
			renderer.render("weekOfMonth", getWeekOfMonth());
			
			if (_weekOfYear) renderer.render("woy", true);
			if (_dfmter != null) rendererMonthData(_dfmter, renderer);
		} else
			if (_dfmter != null) rendererDayData(_dfmter ,renderer);
		
		
		renderer.render("bd", getBeginDate().getTime());
		renderer.render("ed", getEndDate().getTime());
		renderer.render("cd", getCurrentDate().getTime());
		
		if (_readonly)
			renderer.render("readonly", true);
		
		renderer.render("days", _days);
		
		renderer.render("events", Util.encloseEventMap(this, _evts.values()));
	}		

	private void rendererDayData(DateFormatter dfhandler, ContentRenderer renderer) throws IOException {
		final Locale locale = Locales.getCurrent();
		TimeZone timezone = getDefaultTimeZone();
		Calendar cal = Calendar.getInstance(timezone);
		cal.setTime(getBeginDate());

		renderer.render("captionByDate", Util.encloseList(Util.packCaptionByDate(cal, getDays(), locale, timezone, dfhandler)));

		cal.set(Calendar.MINUTE, 0);
		renderer.render("captionByTimeOfDay", Util.encloseList(Util.packCaptionByTimeOfDay(cal, _tzones, locale, dfhandler)));
	}

	private void rendererMonthData(DateFormatter dfhandler, ContentRenderer renderer) throws IOException {
		TimeZone timezone = getDefaultTimeZone();
		Calendar cal = Calendar.getInstance(timezone);
		cal.setTime(getBeginDate());

		List<List<String>> result = Util.packAllCaptionOfMonth(this, cal, Locales.getCurrent(), timezone, dfhandler);
		renderer.render("captionByDayOfWeek", Util.encloseList(result.get(0)));
		renderer.render("captionByPopup", Util.encloseList(result.get(1)));
		renderer.render("captionByDateOfMonth", Util.encloseList(result.get(2)));

		if (isWeekOfYear())
			renderer.render("captionByWeekOfYear", Util.encloseList(result.get(3)));
	}
	
	/**
	 * @deprecated As of release 2.0-RC
	 * Returns the event renderer used for {@link CalendarEvent} to draw its
	 * outline (i.e. HTML), like the DSP renderer of ZK component.
	 * <p>
	 * Note: never null.
	 */
	public EventRender getEventRender() {
		return null;
	}

	/**
	 * @deprecated As of release 2.0-RC
	 * Sets the event renderer.
	 */
	public void setEventRender(EventRender render) {
		
	}
 }
