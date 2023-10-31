package test;

import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.zkoss.test.webdriver.WebDriverTestCase;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.Assert.assertEquals;

public class RenderItemMonthTest extends CalendarTestBase {
    static {
        TEST_ZUL = "renderItemMonth.zul";
    }


    @Test //ZKCAL-114
    public void instantItemCauseNoError() {
        //if it finishes loading for a js error, no z-loading exists
        assertEquals(0 , jq(".z-loading").length());
        JQuery sameBeginEndTimeItem = jq(".z-calendars-day-of-month-body").eq(3).find("tr").eq(1).find(".z-calitem");
        assertEquals(1, sameBeginEndTimeItem.length());
        assertEquals("00:00",  sameBeginEndTimeItem.find(".z-calitem-header").get(0).get("textContent"));
    }

    @Test
    public void itemsOnSameDay(){
        JQuery firstWeekBody = jq(".z-calendars-day-of-month-body").eq(0);
        //first row contains month header
        JQuery firstRowContent = firstWeekBody.find("tr").eq(0).find(".z-calendars-month-date-cnt");
        assertEquals("Jan 1", firstRowContent.get(0).get("textContent"));

        JQuery secondRow = firstWeekBody.find("tr").eq(1);
        assertEquals("00:00", secondRow.find(".z-calitem-header").get(0).get("textContent"));
        JQuery thirdRow = firstWeekBody.find("tr").eq(2);
        assertEquals("01:00", thirdRow.find(".z-calitem-header").get(0).get("textContent"));
        JQuery fourthRow = firstWeekBody.find("tr").eq(3);
        assertEquals("03:00", fourthRow.find(".z-calitem-header").get(0).get("textContent"));
    }
}
