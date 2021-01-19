package org.zkoss.calendar.essentials;

import org.zkoss.calendar.impl.DefaultCalendarItem;

import java.time.*;
import java.util.Calendar;

public class CalendarItemBuilder {
    private String title;
    private String content;
    private Instant begin;
    private Instant end;
    private String headerColor;
    private String contentColor;
    private boolean locked;
    private ZoneId zoneId = ZoneId.systemDefault();

    public CalendarItemBuilder(){

    }

    public CalendarItemBuilder(DefaultCalendarItem item){
        title = item.getTitle();
        content = item.getContent();
        begin = item.getBegin();
        end = item.getEnd();
        headerColor = item.getHeaderColor();
        contentColor = item.getContentColor();
        locked = item.isLocked();
    }

    public CalendarItemBuilder setTitle(String title) {
        this.title = title;
        return this;
    }

    public CalendarItemBuilder setContent(String content) {
        this.content = content;
        return this;
    }

    public CalendarItemBuilder setBegin(Instant begin) {
        this.begin = begin;
        return this;
    }

    public CalendarItemBuilder setEnd(Instant end) {
        this.end = end;
        return this;
    }

    public CalendarItemBuilder setHeaderColor(String headerColor) {
        this.headerColor = headerColor;
        return this;
    }

    public CalendarItemBuilder setContentColor(String contentColor) {
        this.contentColor = contentColor;
        return this;
    }

    public CalendarItemBuilder setLocked(boolean locked) {
        this.locked = locked;
        return this;
    }

    public CalendarItemBuilder setZoneId(ZoneId zoneId) {
        this.zoneId = zoneId;
        return this;
    }

    public DefaultCalendarItem build(){

        return new DefaultCalendarItem(title, content, headerColor, contentColor, locked,
                LocalDateTime.ofInstant(begin, zoneId),
                LocalDateTime.ofInstant(end, zoneId)
                , zoneId);
    }
}
