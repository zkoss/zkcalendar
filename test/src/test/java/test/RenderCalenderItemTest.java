package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.WebDriverTestCase;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.Assert.assertEquals;

public class RenderCalenderItemTest extends WebDriverTestCase {

    public static final String TEST_ZUL = "renderItem.zul";
    public static final int HALF_HOUR_HEIGHT = 31;

    static {
        System.setProperty("zkWebdriverContextPath", "/test/");
    }

    /**
     * non-overlapping item has 100% width, no shifting
     */
    @Test
    public void nonOverlapping() {
        connect(TEST_ZUL);
        JQuery separateItems = jq(".z-calendars-week-day").eq(0).find(".z-calitem");
        String width = separateItems.get(0).get("style.width");
        assertEquals("100%", width);
        String left = separateItems.get(0).get("style.left");
        assertEquals("", left);
    }


    /**
     * 3 items overlap each other
     */
    @Test
    public void test3Overlapping() {
        connect(TEST_ZUL);
        // a bug that I can't set sclass in calendaritem
        JQuery items = jq(".z-calendars-week-day").eq(1).find(".z-calitem");
        assertEquals(3, items.length());

        assertEquals("56.6", items.get(0).get("style.width").substring(0, 4));
        assertEquals("56.6", items.get(1).get("style.width").substring(0, 4));
        assertEquals("33.3", items.get(2).get("style.width").substring(0, 4));

        assertEquals("33.3", items.get(1).get("style.left").substring(0, 4));
        assertEquals("66.6", items.get(2).get("style.left").substring(0, 4));
    }

    /** one middle item overlaps other 2 items at begin time and end time respectively
     */
    @Test
    public void oneItemOverlapOther2() {
        connect(TEST_ZUL);
        JQuery items = jq(".z-calendars-week-day").eq(2).find(".z-calitem");
        assertEquals(3, items.length());

        assertEquals("85%", items.get(0).get("style.width"));
        assertEquals("85%", items.get(1).get("style.width"));
        assertEquals("50%", items.get(2).get("style.width"));

        assertEquals("", items.get(0).get("style.left"));
        assertEquals("", items.get(1).get("style.left"));
        assertEquals("50%", items.get(2).get("style.left"));
    }

    /** item 0 and item 1 are consecutive e.g. 0:00 ~ 1:00.
     * Item 1 and item 2 are overlapping e.g. both are in 1:00 ~ 2:00
     */
    @Test
    public void consecutiveAndOverlappingTime(){
        connect(TEST_ZUL);
        JQuery items = jq(".z-calendars-week-day").eq(3).find(".z-calitem");
        assertEquals(3, items.length());
        assertEquals("100%", items.get(0).get("style.width"));
        assertEquals("85%", items.get(1).get("style.width"));
        assertEquals("50%", items.get(2).get("style.width"));

        assertEquals("", items.get(0).get("style.left"));
        assertEquals("", items.get(1).get("style.left"));
        assertEquals("50%", items.get(2).get("style.left"));
    }

    /**
     * item 1's and item 2's time interval are consecutive. e.g. 1:00~2:00, 2:00~3:00
     * Render these 2 items in non-overlapping way. Don't shrink their width and shift to right.
     */
    @Test
    public void consecutiveItemsNotOverlapping() {
        connect(TEST_ZUL);
        JQuery consecutiveItems = jq(".z-calendars-week-day").eq(4).find(".z-calitem");
        assertEquals(3, consecutiveItems.length());
        for (int i = 0; i < consecutiveItems.length(); i++) {
            assertEquals("100%", consecutiveItems.get(i).get("style.width"));
            assertEquals("", consecutiveItems.get(i).get("style.left"));
        }
    }

    @Test //ZKCAL-116
    public void renderSclass(){
        connect(TEST_ZUL);
        JQuery item = jq(".separate");
        assertEquals(true, item.exists());
        assertEquals(true, item.eq(0).attr("class").contains("z-calitem"));
    }


    /**
     * All items shorter than half hour shall have the same height as half hour item, 1 time slot height
     * an instant item, same begin and end time.
     */
    @Test
    public void shortIntervalItem(){
        connect(TEST_ZUL);
        JQuery halfHourItem = jq(".half-hour");
        assertEquals(HALF_HOUR_HEIGHT, halfHourItem.eq(0).height());
        //ZKCAL-117
        JQuery instantItem = jq(".instant");
        assertEquals(HALF_HOUR_HEIGHT, instantItem.eq(0).height());

        JQuery tenMinuteItem = jq(".10minute");
        assertEquals(HALF_HOUR_HEIGHT, tenMinuteItem.eq(0).height());
    }

    /**
     *  an instant item overlaps an half-hour item
     */
    @Test //ZKCAL-118
    public void instantOverlapping(){
        connect(TEST_ZUL);
        JQuery halfHourItem = jq(".half-hour");
        assertEquals("85%", halfHourItem.get(0).get("style.width"));
        assertEquals("", halfHourItem.get(0).get("style.left"));

        JQuery instantItem = jq(".instant");
        assertEquals("50%", instantItem.get(0).get("style.width"));
        assertEquals("50%", instantItem.get(0).get("style.left"));

    }

    //TODO add drag items tests
}
