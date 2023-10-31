package test;

import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.zkoss.test.webdriver.WebDriverTestCase;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.Assert.assertEquals;

/**
 * test supported events
 */
public class EventTest extends CalendarTestBase{
    static {
            TEST_ZUL = "event.zul";
    }

    @Test //ZKCAL-103
    public void onDayClick() {
        JQuery jan1 = jq(".z-calendars-day-of-week-inner .z-calendars-day-of-week-cnt").eq(0);
        click(jan1);
        waitResponse();
        JQuery dayInWeek = jq(".z-calendars-day-of-week");
        //switch to 1 day
        assertEquals(1, dayInWeek.length());
        assertEquals("1/1", dayInWeek.find(".z-calendars-day-of-week-fmt").get(0).get("textContent"));
    }
    }
}
