package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.*;
import static test.CssClassNames.*;

// ZKCAL-141
public class SaturdayItemTest extends CalendarTestBase {

    static {
        TEST_ZUL = "saturdayItem.zul";
    }

    /**
     * Bug verification: Check that all rows in the first week have exactly 7 cells.
     * Known issue: Saturday item causes an extra 8th cell to be generated in the item row.
     */
    @Test
    public void firstWeekRowsHaveCorrectCellCount() {
        JQuery weeks = jq(MONTH_WEEK.selector());
        assertTrue(weeks.length() >= 1, "Calendar should have at least 1 week");

        // Get the first week (contains Saturday item on Jan 7)
        JQuery firstWeek = weeks.eq(0);

        // Get all rows in the first week
        JQuery rows = firstWeek.find("tr");
        assertTrue(rows.length() >= 1, "First week should have at least 1 row");

        // Verify each row has exactly 7 cells (for 7 days of the week)
        for (int i = 0; i < rows.length(); i++) {
            JQuery row = rows.eq(i);
            JQuery cells = row.find("td");
            assertEquals(7, cells.length(),
                String.format("Row %d in first week should have exactly 7 cells (found %d). " +
                    "Bug: Saturday item causes an extra 8th cell in item row.",
                    i, cells.length()));
        }
    }
}
