package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static test.CssClassNames.MONTH_WEEK;

/**
 * ZKCAL-142: Reproduces the bug: a short event (< 30 min) on March 10 causes the March 11 events
 * to be pushed into lower rows, leaving a blank space between the date header and
 * the first March 11 event.
 *
 * In the month mold each week body (.z-calendars-day-of-month-body) has:
 *   tr eq(0) — date header row
 *   tr eq(1) — first event row  ← March 11 events should appear here
 *   tr eq(2) — second event row (overflow)
 *
 * Bug: March 11 events land in tr eq(2)+, leaving tr eq(1) empty for Wednesday.
 * Fix: tr eq(1) must contain a March 11 item.
 *
 * Week of March 8–14, 2026 is the second week in the March calendar (eq(1)).
 *   Sunday=col0, Monday=col1, Tuesday=col2(March10), Wednesday=col3(March11)
 */
public class TwoEventsConsecutiveDaysTest extends CalendarTestBase {

    static {
        TEST_ZUL = "twoEventsConsecutiveDays.zul";
    }

    /**
     * March 11 events must appear in the first event row (tr index 1), directly
     * below the date header — no blank row between the header and the events.
     * This test FAILS when the bug is present.
     */
    @Test
    public void march11EventsAreInFirstEventRow() {
        // March 8–14 is the second week in the March 2026 calendar
        JQuery weekBody = jq(".z-calendars-day-of-month-body").eq(1);

        // tr eq(0) is the date header; tr eq(1) is the first event row
        JQuery firstEventRow = weekBody.find("tr").eq(1);

        JQuery march11Items = firstEventRow.find(".item-march11");
        assertTrue(march11Items.length() > 0,
                "March 11 events should be in the first event row (tr index 1). " +
                "Bug: short event on March 10 pushes March 11 events down, leaving a blank row.");
    }

    /**
     * Sanity check: March 10 event is present in the first event row.
     */
    @Test
    public void march10EventIsInFirstEventRow() {
        JQuery weekBody = jq(".z-calendars-day-of-month-body").eq(1);
        JQuery firstEventRow = weekBody.find("tr").eq(1);
        assertEquals(1, firstEventRow.find(".item-march10").length(),
                "March 10 event should be in the first event row");
    }
}
