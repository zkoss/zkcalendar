package test;

public enum CssClassNames {
    CALENDAR("z-calendars"),
    BODY(CALENDAR.className + "-body"),
    DAY_OF_WEEK_CONTENT(CALENDAR.className + "-day-of-week-cnt"),
    DAY_OF_WEEK_FORMAT(CALENDAR.className + "-day-of-week-fmt"),
    DAY_OF_WEEK(CALENDAR.className + "-day-of-week"),
    TIMEZONE(CALENDAR.className + "-timezone"),
    HOUR_OF_DAY(CALENDAR.className + "-hour-of-day"),
    WEEK_DAY(CALENDAR.className + "-week-day"),
    WEEK(CALENDAR.className + "-week"),
    WEEK_WEEKEND(CALENDAR.className + "-week-weekend"),
    DAYLONG_EVT(CALENDAR.className + "-daylong-evt"),
    WEEK_BODY(CALENDAR.className + "-week-body"),
    HOUR_SEPARATOR(CALENDAR.className + "-hour-sep"),

    MONTH_WEEK(CALENDAR.className+ "-month-week"),
    MONTH_DATE(CALENDAR.className+ "-month-date"),
    MONTH_DATE_OFF(CALENDAR.className+ "-month-date-off"),
    MONTH_HEADER(CALENDAR.className + "-month-header"),
    MONTH_CONTENT(CALENDAR.className + "-month-cnt"),
    MORE_LINK(CALENDAR.className + "-evt-faker-more"),

    MORE_POPUP("z-calpp-month"),
    POPUP_CLOSE_ICON(MORE_POPUP.className + "-close"),
    ITEM_LEFT_SPAN_INDICATOR(MORE_POPUP.className + "-evt-l"),
    ITEM_RIGHT_SPAN_INDICATOR(MORE_POPUP.className + "-evt-r"),

    ITEM("z-calitem"),
    ITEM_GHOST(CALENDAR.className + "-evt-ghost"),
    ITEM_INNER(ITEM.className + "-inner"),
    ITEM_HEADER(ITEM.className + "-header"),
    ITEM_CONTENT(ITEM.className + "-cnt"),
    ITEM_TEXT(ITEM.className + "-text"),
    ITEM_RESIZER(ITEM.className + "-resizer");

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
