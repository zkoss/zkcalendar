package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.assertEquals;

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

    @Test
    public void dayHoverEffect(){
        JQuery jan1 = jq(".z-calendars-day-of-week-inner").eq(0);
        getActions().moveToElement(toElement(jan1)).pause(20).perform();
        JQuery jan1Content = jq(".z-calendars-day-of-week-inner .z-calendars-day-of-week-fmt").eq(0);
        assertEquals(true, jan1Content.hasClass("z-calendars-day-over"));
    }
}
