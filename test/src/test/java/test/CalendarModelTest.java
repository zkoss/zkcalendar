package test;

import org.junit.jupiter.api.Test;
import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.api.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CalendarModelTest {

    @Test
    public void testGetWithLocalDateTime() {
        RenderItemsComposer renderItemsComposer = new RenderItemsComposer();

        renderItemsComposer.calendars = new Calendars();
        renderItemsComposer.initModel();

        LocalDateTime jan5 = LocalDateTime.of(2023, 1, 5, 0, 0);

        RenderContext context = new RenderContext() {
            public TimeZone getTimeZone() {
                return renderItemsComposer.calendars.getDefaultTimeZone();
            }
        };

        List<CalendarItem> items = renderItemsComposer.model.get(jan5, jan5.plusHours(23), context);
        assertEquals(3, items.size());

        LocalDateTime jan1 = LocalDateTime.of(2023, 1, 1, 0, 0);
        items = renderItemsComposer.model.get(jan1, jan1.plusHours(23), context);
        assertEquals(4, items.size());
    }
}
