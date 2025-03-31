package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static test.CssClassNames.ITEM_HEADER;

/**
 * item rendering in one day view. The test cases interact with components, need to reload test page before testing.
 */
public class ItemDayViewTest extends CalendarTestBase {
    static {
            TEST_ZUL = "renderItem.zul";
    }

    /**
     * in 1-day view, a span-2-day item's width should equal to the width of the day column.
     */
    @Test //ZKCAL-121
    public void span2DayItem1DayView(){
        reloadPage();
        JQuery jan6 = jq(".z-calendars-day-of-week-inner .z-calendars-day-of-week-cnt").eq(5);
        click(jan6);//switch to 1-day view
        waitResponse();
        JQuery dayLongItems = jq(".z-calendars-daylong-cnt .z-calendars-daylong-evt");
        // one is an item, another is the empty space
        assertEquals(2, dayLongItems.length());
        JQuery firstDayLongItem = jq(".z-calendars-daylong-cnt tr:first-child .z-calendars-daylong-evt");
        assertEquals(1, firstDayLongItem.length());
        assertEquals("span 2 days 00:00", firstDayLongItem.find(ITEM_HEADER.selector()).text());

        click(jq("$next")); //jan 7, next day
        waitResponse();
        assertEquals(3, dayLongItems.length());
        assertEquals(1, firstDayLongItem.length());
        assertEquals(0, jq(".z-calendars-week-day-cnt .z-calitem").length());
    }

    @Test
    public void span3DayItem1DayView() {
        reloadPage();
        JQuery jan1 = jq(".z-calendars-day-of-week-inner .z-calendars-day-of-week-cnt").eq(0);
        click(jan1);//switch to 1-day view
        waitResponse();
        JQuery dayLongItems = jq(".z-calendars-daylong-cnt .z-calendars-daylong-evt");
        // one is an item, another is the empty space
        assertEquals(2, dayLongItems.length());
        JQuery firstDayLongItem = jq(".z-calendars-daylong-cnt tr:first-child .z-calendars-daylong-evt");
        assertEquals(1, firstDayLongItem.length());
        assertEquals("span 3 days 00:00", firstDayLongItem.find(ITEM_HEADER.selector()).text());

        click(jq("$next")); //jan 2, next day
        waitResponse();
        assertEquals(2, dayLongItems.length());
        assertEquals(1, firstDayLongItem.length());

        click(jq("$next")); //jan 3, next day
        waitResponse();
        assertEquals(2, dayLongItems.length());
        assertEquals(1, firstDayLongItem.length());
    }

    @Test
    public void enlargeItemToOverlap() {
        reloadPage();
        JQuery separateItem = jq(".z-calendars-week-day").eq(0).find(".separate");
        JQuery colorItem = jq(".colored").eq(0);
        getActions().dragAndDrop(toElement(separateItem.find(".z-calitem-resizer")), toElement(colorItem)).perform();
        waitResponse();
        assertEquals("85%", separateItem.get(0).get("style.width"));
        assertEquals("50%", colorItem.get(0).get("style.width"));
    }

    //TODO add drag items tests
}
