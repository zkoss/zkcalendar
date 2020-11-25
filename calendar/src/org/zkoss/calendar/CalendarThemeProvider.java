/* CalendarThemeProvider.java

		Purpose:
		
		Description:
		
		History:
				Wed Dec 30 11:11:46 CST 2020, Created by leon

Copyright (C) 2020 Potix Corporation. All Rights Reserved.
*/
package org.zkoss.calendar;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.zkoss.html.StyleSheet;
import org.zkoss.lang.Library;
import org.zkoss.zk.ui.Execution;
import org.zkoss.zul.theme.StandardThemeProvider;

public class CalendarThemeProvider extends StandardThemeProvider {
	private static final String CALENDAR_THEME_PREFERRED_KEY = "org.zkoss.calendar.theme.preferred";
	private static final String THEME_PREFERRED_KEY = "org.zkoss.theme.preferred";
	private static final List<String> BUILT_IN_THEMES = Arrays.asList("iceblue", "breeze", "wcag", "dark");
	private static final List<String> CLASSIC_THEMES = Arrays.asList("breeze", "sapphire", "silvertail");
	private static final List<String> WCAG_THEMES = Arrays.asList("wcag", "wcag_navy", "wcag_purple");
	private static final List<String> DARK_THEMES = Arrays.asList("dark", "ruby", "amber", "emerald", "aquamarine", "montana", "violet", "spaceblack", "cardinal", "mysteriousgreen", "zen");

	public Collection<Object> getThemeURIs(Execution exec, List<Object> uris) {
		uris = (List<Object>) super.getThemeURIs(exec, uris);
		// Inserting specific calendar theme css
		uris.add(new StyleSheet("~./js/calendar/css/theme/" + getCalendarThemeName() + ".css.dsp", "text/css"));
		return uris;
	}

	private String getCalendarThemeName() {
		String calendarThemePreferred = Library.getProperty(CALENDAR_THEME_PREFERRED_KEY);
		if (calendarThemePreferred != null && !calendarThemePreferred.trim().isEmpty()) {
			if (BUILT_IN_THEMES.contains(calendarThemePreferred))
				return "calendar-" + calendarThemePreferred; // use built-in theme
			return calendarThemePreferred; // custom theme name
		}

		String themePreferred = Library.getProperty(THEME_PREFERRED_KEY);
		if (themePreferred != null && !themePreferred.trim().isEmpty()) {
			themePreferred = themePreferred.toLowerCase();
			if (themePreferred.endsWith("_c")) // ignore compact
				themePreferred = themePreferred.substring(0, themePreferred.length() - 2);
			if (WCAG_THEMES.contains(themePreferred))
				return "calendar-wcag";
			if (DARK_THEMES.contains(themePreferred))
				return "calendar-dark";
			if (CLASSIC_THEMES.contains(themePreferred))
				return "calendar-breeze";
		}
		return "calendar-iceblue";
	}

}
