package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static test.RenderItemsComposer.*;

/**
 * item rendering in the default mold.
 */
public class RenderItemDefaultTest extends CalendarTestBase {
    public static final int HALF_HOUR_HEIGHT = 31;

    static {
            TEST_ZUL = "renderItem.zul";
    }


    /**
     * non-overlapping item has 100% width, no shifting
     */
    @Test
    public void nonOverlapping() {
        JQuery separateItems = jq(".z-calendars-week-day").eq(0).find(".z-calitem");
        String width = separateItems.get(0).get("style.width");
        assertEquals("100%", width);
        String left = separateItems.get(0).get("style.left");
        assertEquals("", left);
    }

    @Test
    public void headerContentColor(){
        JQuery coloredItem = jq(".z-calendars-week-day").eq(0).find(".colored");
        JQuery header = coloredItem.find(".z-calitem-header");
        String blue = "rgb(0, 0, 255)";
        assertEquals(blue, header.eq(0).css("background-color"));
        JQuery content = coloredItem.find(".z-calitem-cnt");
        String yellow = "rgb(255, 255, 0)";
        assertEquals(yellow, content.eq(0).css("background-color"));
    }

    /**
     * 3 items overlap each other
     */
    @Test
    public void test3Overlapping() {
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
        JQuery consecutiveItems = jq(".z-calendars-week-day").eq(4).find(".z-calitem");
        assertEquals(3, consecutiveItems.length());
        for (int i = 0; i < consecutiveItems.length(); i++) {
            assertEquals("100%", consecutiveItems.get(i).get("style.width"));
            assertEquals("", consecutiveItems.get(i).get("style.left"));
        }
    }

    @Test //ZKCAL-116
    public void renderSclass(){
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
        JQuery halfHourItem = jq(".half-hour");
        assertEquals("85%", halfHourItem.get(0).get("style.width"));
        assertEquals("", halfHourItem.get(0).get("style.left"));

        JQuery instantItem = jq(".instant");
        assertEquals("50%", instantItem.get(0).get("style.width"));
        assertEquals("50%", instantItem.get(0).get("style.left"));
    }

    @Test
    public void spanMultipleDaysItem(){
        JQuery dayLongContentRow = jq(".z-calendars-daylong-cnt tr:first-child");
        JQuery span3daysItem = dayLongContentRow.find("td:nth-child(1)").eq(0);
        assertEquals("3", span3daysItem.attr("colspan"));

        JQuery span2daysItem = dayLongContentRow.find("td:nth-child(4)").eq(0);
        assertEquals("2", span2daysItem.attr("colspan"));
    }

    @Test
    public void spanOverWeekend(){
        JQuery dayLongContentRow = jq(".z-calendars-daylong-cnt tr:nth-child(2)");
        JQuery dayCells = dayLongContentRow.find("td");
        assertEquals(7, dayCells.length());
        JQuery seventhCell = dayLongContentRow.find("td:nth-child(7)").eq(0);
        assertEquals("1", seventhCell.attr("colspan"));
        JQuery overWeekendItem = seventhCell.find(".z-calitem");
        assertEquals(1, overWeekendItem.length());
        assertEquals("span over weekend", overWeekendItem.text());
    }

    @Test //ZKCAL-128
    public void simpleItemUpdate(){
        //check initial state
        //begin date
        JQuery day1 = jq(CssClassNames.WEEK_DAY.selector()).eq(0);
        JQuery simpleItem = day1.find("."+ SIMPLE_CLASS_INITIAL);
        assertEquals("310px", simpleItem.css("top")); //begin time
        assertEquals(Size.itemHeight(1) , simpleItem.height()); // end time

        assertEquals("18px", simpleItem.find("dl").css("font-size"));
        JQuery header = simpleItem.find(CssClassNames.ITEM_HEADER.selector());
        assertEquals("rgb(0, 128, 0)", header.css("color"));
        assertEquals("simple title", header.text());
        JQuery content = simpleItem.find(CssClassNames.ITEM_CONTENT.selector());
        assertEquals("rgb(0, 0, 255)", content.css("color"));
        assertEquals("simple content", content.text());

        click(jq("$modelUpdateSimple"));
        waitResponse();
        //check updated state
        simpleItem = day1.find("."+ SIMPLE_CLASS_UPDATE);
        assertEquals(true, simpleItem.exists());
        assertEquals("372px", simpleItem.css("top")); //begin time
        assertEquals(Size.itemHeight(1) , simpleItem.height()); // end time

        assertEquals("italic", simpleItem.find("dl").css("font-style"));
        header = simpleItem.find(CssClassNames.ITEM_HEADER.selector());
        assertEquals("rgb(255, 192, 203)", header.css("color"));
        assertEquals("title updated", header.text());
        content = simpleItem.find(CssClassNames.ITEM_CONTENT.selector());
        assertEquals("rgb(255, 0, 0)", content.css("color"));
        assertEquals("content updated", content.text());
    }

}
