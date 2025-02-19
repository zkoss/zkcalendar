package test;

public enum CssClassNames {
    CALENDAR("z-calendars"),
    DAY_OF_WEEK_CONTENT(CALENDAR.className + "-day-of-week-cnt"),
    DAY_OF_WEEK(CALENDAR.className + "-day-of-week"),
    TIMEZONE(CALENDAR.className + "-timezone"),
    HOUR_OF_DAY(CALENDAR.className + "-hour-of-day"),
    WEEK_DAY(CALENDAR.className + "-week-day"),
    WEEK_WEEKEND(CALENDAR.className + "-week-weekend");

    private final String className;

    CssClassNames(String className) {
        this.className = className;
    }

    public String className() {
        return className;
    }

    /**
     * @return CSS selector for this class name
     */
    public String selector() {
        return "." + className;
    }

}
