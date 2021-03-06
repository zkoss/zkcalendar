/* CalendarWebAppInit.java

		Purpose:
		
		Description:
		
		History:
				Tue Jan 12 16:24:09 CST 2021, Created by leon

Copyright (C) 2021 Potix Corporation. All Rights Reserved.
*/
package org.zkoss.calendar;

import java.util.Arrays;
import java.util.List;

import org.zkoss.lang.Library;
import org.zkoss.zk.ui.WebApp;
import org.zkoss.zk.ui.util.Configuration;
import org.zkoss.zk.ui.util.WebAppInit;

/**
 * This is a fallback for older ZK versions in which the ThemeProvider cannot be customized for themed addon components.
 * To be refactored after ZK-4771 is available.
 */
public class CalendarWebAppInit implements WebAppInit {
	private static final String CALENDAR_THEME_PREFERRED_KEY = "org.zkoss.calendar.theme.preferred";
	private static final String THEME_PREFERRED_KEY = "org.zkoss.theme.preferred";
	private static final List<String> BUILT_IN_THEMES = Arrays.asList("iceblue", "breeze", "wcag", "dark");
	private static final List<String> CLASSIC_THEMES = Arrays.asList("breeze", "sapphire", "silvertail");
	private static final List<String> WCAG_THEMES = Arrays.asList("wcag", "wcag_navy", "wcag_purple");
	private static final List<String> DARK_THEMES = Arrays.asList("ruby", "amber", "emerald", "aquamarine", "montana", "violet", "spaceblack", "cardinal", "mysteriousgreen", "zen");
	public static final String PREFIX = "~./js/calendar/css/theme/calendar-";
	public static final String SUFFIX = ".css.dsp";

	public static String getCalendarThemeURI() {
		String calendarThemePreferred = Library.getProperty(CALENDAR_THEME_PREFERRED_KEY);
		if (calendarThemePreferred != null && !calendarThemePreferred.trim().isEmpty()) {
			if (BUILT_IN_THEMES.contains(calendarThemePreferred))
				return PREFIX + calendarThemePreferred + SUFFIX;// use built-in theme
			return ""; // custom theme, don't apply built-in theme
		}

		return getCalendarThemeURI(Library.getProperty(THEME_PREFERRED_KEY));
	}

	public static String getCalendarThemeURI(String themePreferred) {
		String result = "";
		if (themePreferred != null && !themePreferred.trim().isEmpty()) {
			themePreferred = themePreferred.toLowerCase();
			if (themePreferred.endsWith("_c")) // ignore compact
				themePreferred = themePreferred.substring(0, themePreferred.length() - 2);
			if (WCAG_THEMES.contains(themePreferred))
				result = "wcag";
			if (DARK_THEMES.contains(themePreferred))
				result = "dark";
			if (CLASSIC_THEMES.contains(themePreferred))
				result = "breeze";
		}
		if (result.isEmpty())
			result = "iceblue";
		return PREFIX + result + SUFFIX;
	}

	@Override
	public void init(WebApp webApp) throws Exception {
		String themeURI = getCalendarThemeURI();
		if (!themeURI.isEmpty()) {
			Configuration config = webApp.getConfiguration();
			config.addThemeURI(themeURI);
		}
	}
}