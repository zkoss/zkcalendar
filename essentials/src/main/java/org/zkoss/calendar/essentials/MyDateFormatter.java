package org.zkoss.calendar.essentials;

import org.zkoss.calendar.impl.SimpleDateFormatter;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class MyDateFormatter extends SimpleDateFormatter {
    private DateTimeFormatter dateFormat;


    @Override
    public String getCaptionByDate(ZonedDateTime date, Locale locale) {
        if (dateFormat == null) {
            dateFormat = DateTimeFormatter.ofPattern("EEE MM-d", locale);
        }
        return "[" + date.format(dateFormat) + "]";
    }
}
