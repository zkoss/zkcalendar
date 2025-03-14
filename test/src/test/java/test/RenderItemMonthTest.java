package test;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.*;

public class RenderItemMonthTest extends CalendarTestBase {
    public static final int ITEM_HEIGHT_MONTH_MOLD = 20;

    static {
        TEST_ZUL = "renderItemMonth.zul";
    }


    @Test //ZKCAL-114
    public void instantItemCauseNoError() {
        JQuery sameBeginEndTimeItem = jq(".z-calendars-day-of-month-body").eq(3).find("tr").eq(1).find(".z-calitem");
        assertEquals(1, sameBeginEndTimeItem.length());
        assertEquals("00:00",  sameBeginEndTimeItem.find(".z-calitem-header").get(0).get("textContent"));
    }

    @Test //ZKCAL-114 ZKCAL-119
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

    public static final String RIGHT_ARROW = ".z-calitem-right-arrow";
    public static final String LEFT_ARROW = ".z-calitem-left-arrow";


    /**
     * ZKCAL-111. an item spanning over a weekend is divided into 2 segments, representing the continuation of the event from the first week into the second:
     * - the 1st one, its right border-radius should be 0, indicating it's not an end of an item
     * - the 2nd one, its left border-radius should be 0, indicating it's a continuation of the previous week
     */
    @Test
    public void itemOverWeek(){
        JQuery overWeekItem = jq(".over-weekend");
        assertEquals(2, overWeekItem.length()); // 2 segments

        JQuery segment1 = overWeekItem.eq(0);
        assertTrue(segment1.find(RIGHT_ARROW).exists());
        assertTrue(isCssRuleApplied(toElement(segment1.find(".z-calitem-inner").get(0)), ".z-calitem-body" +RIGHT_ARROW+" .z-calitem-inner", "border-top-right-radius", "0px"));
        assertTrue(isCssRuleApplied(toElement(segment1.find(".z-calitem-inner").get(0)), ".z-calitem-body" +RIGHT_ARROW+" .z-calitem-inner", "border-bottom-right-radius", "0px"));

        JQuery segment2 = overWeekItem.eq(1);
        assertTrue(segment2.find(LEFT_ARROW).exists());
        assertTrue(isCssRuleApplied(toElement(segment2.find(".z-calitem-inner").get(0)), ".z-calitem-body" + LEFT_ARROW +" .z-calitem-inner", "border-top-left-radius", "0px"));
        assertTrue(isCssRuleApplied(toElement(segment2.find(".z-calitem-inner").get(0)), ".z-calitem-body" + LEFT_ARROW + " .z-calitem-inner", "border-bottom-left-radius", "0px"));
    }

    @Test //ZKCAL-124 ZKCAL-123 ZKCAL-125
    public void endAfter1200(){
        JQuery item = jq(".end-after-12");
        assertEquals(1, item.length());
    }

    @Test //ZKCAL-127
    public void zkcal127(){
        JQuery item = jq(".zkcal-127");
        assertEquals(1, item.length());
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, item.height());
    }

    public boolean isCssRuleApplied(WebElement element, String selector, String property, String value) {
        return (Boolean)((JavascriptExecutor) this.driver).executeScript("return isCssRuleApplied(arguments[0], arguments[1], arguments[2], arguments[3]);",
                element, selector, property, value);
    }

}
