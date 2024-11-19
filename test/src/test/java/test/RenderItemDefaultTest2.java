package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class RenderItemDefaultTest2 extends CalendarTestBase{

    static {
        TEST_ZUL = "renderItem.zul";
    }

    /* when change to month mold, calendars should render the month date upon the current date */
    @Test //ZKCAL-105
    public void toMonthMold() {
        JQuery nextButton = jq("$next");
        for (int i = 1 ; i<=5 ; i++) {
            click(nextButton);
            waitResponse();
        }
        assertEquals("2/5", jq(".z-calendars-day-of-week-fmt").eq(0).text());

        click(jq("$monthMold"));
        waitResponse();
        //1/29~1/31 are date-off
        assertEquals(3, jq(calendarSclass("day-of-month-bg")).eq(0).find(calendarSclass("month-date-off")).length());
        assertEquals(0, jq(calendarSclass("day-of-month-bg")).eq(1).find(calendarSclass("month-date-off")).length());
        assertEquals(0, jq(calendarSclass("day-of-month-bg")).eq(2).find(calendarSclass("month-date-off")).length());
        assertEquals(0, jq(calendarSclass("day-of-month-bg")).eq(3).find(calendarSclass("month-date-off")).length());
        //3/1 ~ 3/4 are date-off
        assertEquals(4, jq(calendarSclass("day-of-month-bg")).eq(4).find(calendarSclass("month-date-off")).length());
    }
}
