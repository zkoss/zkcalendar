package org.zkoss.calendar.essentials.usecase;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.*;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;

import java.text.*;
import java.util.Calendar;

public class HiddenWeekendComposer extends SelectorComposer {
	
	private static final long serialVersionUID = 201011240904L;
	private SimpleCalendarModel model;
	@Wire
	private Calendars calendars;

	
	@Override
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		initCalendarModel(comp.getPage());
		calendars.setModel(model);
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
			{date2 + "/01 10:00", date2 + "/02 12:30", "#3467CE", "#668CD9", "New Feature of ZK 3.6.1"}, //invisible
			{date2 + "/05 08:00", date2 + "/05 12:00", "#7A367A", "#B373B3", "Tutorial : Reading from the DB with Netbeans and ZK"},
			{date2 + "/13 11:00", date2 + "/13 14:30", "#7A367A", "#B373B3", "Small talk - ZK Charts"},
			{date2 + "/16 14:00", date2 + "/18 16:00", "#7A367A", "#B373B3", "Style Guide for ZK 3.6 released !"},
		};

		// fill the events' data
		model = new SimpleCalendarModel();

		for (int i = 0; i < evts.length; i++) {
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
			model.add(sce);
		}
		page.setAttribute("model", model);
	}

	@Listen("onClick = #previous")
	public void previousPage(){
		calendars.previousPage();
	}

	@Listen("onClick = #next")
	public void nextPage(){
		calendars.nextPage();
	}
}