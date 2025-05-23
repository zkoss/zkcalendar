package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.*;

import static org.junit.jupiter.api.Assertions.*;
import static test.CssClassNames.*;
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
     * Verifies that non-overlapping calendar items have a width of 100% and no left shift.
     */
    @Test
    public void nonOverlapping() {
        JQuery separateItems = jq(".z-calendars-week-day").eq(0).find(".z-calitem");
        String width = separateItems.get(0).get("style.width");
        assertEquals("100%", width);
        String left = separateItems.get(0).get("style.left");
        assertEquals("", left);
    }

    /**
     * Verifies that the header and content colors are applied correctly to calendar items.
     */
    @Test //ZKCAL-120 ZKCAL-100
    public void headerContentColor(){
        JQuery coloredItem = jq(".z-calendars-week-day").eq(0).find(".colored");
        JQuery header = coloredItem.find(".z-calitem-header");
        String blue = "rgb(0, 0, 255)";
        assertEquals(blue, header.eq(0).css("background-color"));
        JQuery content = coloredItem.find(".z-calitem-cnt");
        String yellow = "rgb(255, 255, 0)";
        assertEquals(yellow, content.eq(0).css("background-color"));
    }

    @Test //ZKCAL-130 ZKCAL-93
    public void headerContentStyle(){
        JQuery styledItem = jq(".z-calendars-week-day").eq(5).find(".styled");

        Element header = styledItem.find(ITEM_HEADER.selector()).toElement();
        assertEquals("italic", header.get("style['font-style']"));
        assertEquals("red", header.get("style['color']"));

        Element content = styledItem.find(ITEM_CONTENT.selector()).toElement();
        assertEquals("20px", content.get("style['font-size']"));
        assertEquals("lightgreen", content.get("style['color']"));
    }

    /**
     * Verifies that three overlapped items have correct reduced width
     */
    @Test
    public void test3Overlapping() {
        JQuery items = jq(".z-calendars-week-day").eq(1).find(".3overlapping");
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
     * ZKCAL-113. ZKCAL-90.
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

    @Test //ZKCAL-116 ZKCAL-88
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
        assertEquals("span over weekend 00:00", overWeekendItem.text()); //ZKCAL-94
    }

    /**
     * Verifies that a simple item is updated correctly
     */
    @Test //ZKCAL-128
    public void simpleItemUpdate(){
        //check initial state
        //begin date
        JQuery day1 = jq(CssClassNames.WEEK_DAY.selector()).eq(0);
        JQuery simpleItem = day1.find("."+ SIMPLE_CLASS_INITIAL);
        assertEquals("310px", simpleItem.css("top")); //begin time
        assertEquals(Size.itemHeight(1) , simpleItem.height()); // end time

        assertEquals("18px", simpleItem.find("dl").css("font-size"));
        JQuery header = simpleItem.find(ITEM_HEADER.selector());
        assertEquals("rgb(0, 128, 0)", header.css("color"));
        assertEquals("simple title 05:00 - 06:00", header.text());
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
        header = simpleItem.find(ITEM_HEADER.selector());
        assertEquals("rgb(255, 192, 203)", header.css("color"));
        assertEquals("title updated 06:00 - 07:00", header.text());
        content = simpleItem.find(CssClassNames.ITEM_CONTENT.selector());
        assertEquals("rgb(255, 0, 0)", content.css("color"));
        assertEquals("content updated", content.text());
    }

    /** when change to month mold, calendars should render the month date upon the current date */
    @Test //ZKCAL-105
    public void changeDateToMonthMold() {
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
        reloadPage();
    }

    @Test
    public void toMonthMold(){
        click(jq("$monthMold"));
        waitResponse();
        reloadPage();
    }

    /**
     * Verifies that short time items have a minimal height, at least equal to half-hour items.
     */
    @Test //ZKCAL-77
    public void shortTimeItemHasMinimalHeight(){
        JQuery shortTimeItem = jq(".five-min");
        assertTrue(shortTimeItem.height() >= HALF_HOUR_HEIGHT);
    }

    /**
     * ZKCAL-94
     * format:
     *  title time
     */
    @Test
    public void shortItemHeaderText() {
        JQuery shortItem = jq(".five-min");
        JQuery header = shortItem.find(ITEM_HEADER.selector());
        JQuery content = shortItem.find(CssClassNames.ITEM_CONTENT.selector());

        assertEquals(" 05:00", header.text());
        assertEquals("5 min", content.text());
    }

    @Test
    public void longItemHeaderText() {
        JQuery longItem = jq(".colored");
        JQuery header = longItem.find(ITEM_HEADER.selector());
        JQuery content = longItem.find(CssClassNames.ITEM_CONTENT.selector());

        assertEquals("blue 02:00 - 04:00", header.text());
        assertEquals("yellow", content.text());
    }

    @Test
    public void dayLongItemHeaderText() {
        JQuery dayLongItem = jq(".span3");
        JQuery content = dayLongItem.find(ITEM_HEADER.selector());

        assertEquals("span 3 days 00:00", content.text());
    }

}
