package test;

import org.zkoss.calendar.impl.DefaultCalendarItem;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class CalendarItemHelper {
    private String sclass;
    private String title;
    private String content;
    private Instant begin;
    private Instant end;
    private String headerColor;
    private String contentColor;
    private boolean locked;
    private ZoneId zoneId = ZoneId.systemDefault();

    public CalendarItemHelper(){

    }

    public CalendarItemHelper(DefaultCalendarItem item){
        title = item.getTitle();
        content = item.getContent();
        begin = item.getBegin();
        end = item.getEnd();
        headerColor = item.getHeaderColor();
        contentColor = item.getContentColor();
        locked = item.isLocked();
        sclass = item.getSclass();
    }

    public CalendarItemHelper setTitle(String title) {
        this.title = title;
        return this;
    }

    public CalendarItemHelper setContent(String content) {
        this.content = content;
        return this;
    }

    public CalendarItemHelper setBegin(Instant begin) {
        this.begin = begin;
        return this;
    }

    public CalendarItemHelper setEnd(Instant end) {
        this.end = end;
        return this;
    }

    public CalendarItemHelper setHeaderColor(String headerColor) {
        this.headerColor = headerColor;
        return this;
    }

    public CalendarItemHelper setContentColor(String contentColor) {
        this.contentColor = contentColor;
        return this;
    }

    public CalendarItemHelper setLocked(boolean locked) {
        this.locked = locked;
        return this;
    }

    public CalendarItemHelper setZoneId(ZoneId zoneId) {
        this.zoneId = zoneId;
        return this;
    }

    public DefaultCalendarItem build(){

        return new DefaultCalendarItem.Builder()
                .withTitle(title)
                .withContent(content)
                .withHeaderColor(headerColor)
                .withContentColor(contentColor)
                .withBegin(LocalDateTime.ofInstant(begin, zoneId))
                .withEnd(LocalDateTime.ofInstant(end, zoneId))
                .withSclass(sclass)
                .withZoneId(zoneId)
                .build();
    }
}
