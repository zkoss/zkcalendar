package test;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.DefaultCalendarItem;
import org.zkoss.calendar.impl.SimpleCalendarModel;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Wire;

import java.time.LocalDateTime;
import java.util.Date;

/**
 * ZKCAL-142: Reproduces the bug where a short event (< 30 min) on day N pushes events on day N+1
 * into a lower row, leaving a blank space between the date header and the day N+1 events.
 *
 * Root cause: short events set lowerBoundEd = addDay(endDate, 1) which keeps the
 * time component (e.g. March 11 16:54). The next-day event's upperBoundBd is March 11 00:00,
 * and the check "March 11 00:00 >= March 11 16:54" is false, so it cannot share row 0
 * with the March 10 event.
 *
 * Setup (matches the original bug report):
 *   - 1 short event on March 10, 2026 at 16:53–16:54
 *   - 3 short events on March 11, 2026 at 16:53–16:54
 */
public class TwoEventsConsecutiveDaysComposer extends SelectorComposer {

    @Wire("calendars")
    private Calendars calendars;

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);

        // March 2026: week of March 8–14 contains Tue March 10 and Wed March 11
        LocalDateTime march2026 = LocalDateTime.of(2026, 3, 1, 0, 0);
        LocalDateTime march10 = LocalDateTime.of(2026, 3, 10, 16, 53);
        LocalDateTime march11 = LocalDateTime.of(2026, 3, 11, 16, 53);

        SimpleCalendarModel model = new SimpleCalendarModel();

        // 1 short event on March 10 — triggers the bug for March 11 events
        model.add(new DefaultCalendarItem.Builder()
                .withTitle("March 10 Event")
                .withBegin(march10)
                .withEnd(march10.plusMinutes(1))
                .withSclass("item-march10")
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .build());

        // 3 short events on March 11 — should appear in the first event row, not pushed down
        for (int i = 1; i <= 3; i++) {
            model.add(new DefaultCalendarItem.Builder()
                    .withTitle("March 11 Event " + i)
                    .withBegin(march11)
                    .withEnd(march11.plusMinutes(1))
                    .withSclass("item-march11")
                    .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                    .build());
        }

        calendars.setCurrentDate(Date.from(march2026.atZone(calendars.getDefaultTimeZone().toZoneId()).toInstant()));
        calendars.setModel(model);
    }
}
