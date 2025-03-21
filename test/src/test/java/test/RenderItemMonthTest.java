package test;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.zkoss.test.webdriver.ztl.JQuery;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static test.CssClassNames.*;

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
        assertEquals("11:00", item.find(ITEM_HEADER.selector()).text());
    }

    @Test //ZKCAL-127
    public void zkcal127(){
        JQuery item = jq(".zkcal-127");
        assertEquals(1, item.length());
        assertEquals("13:30", item.find(ITEM_HEADER.selector()).text());
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, item.height());
    }

    @Test //ZKCAL-80
    public void itemHeaderContentTooltip() {
        JQuery item = jq(".zkcal-80");
        assertEquals(1, item.length());
        final String TITLE = "ZKCAL-80 Calendar item text is cut if not enough space to display";

        JQuery content = item.find(ITEM_CONTENT.selector());
        assertEquals(TITLE, content.text());
        assertEquals("00:00", item.find(ITEM_HEADER.selector()).text());
        assertEquals(TITLE, content.attr("title"));
    }

    /**
     * use class selector to verify DOM structure
     */
    @Test
    public void instantItemDOMStructure() {
        JQuery instantItem = jq(".instant").eq(0);

        assertEquals("00:00", instantItem.find(ITEM_INNER.selector() + " " + ITEM_HEADER.selector()).text());
        assertTrue(instantItem.find(ITEM_INNER.selector() + " " + ITEM_CONTENT.selector()).exists());
    }


    @Test
    public void spanDaysItem(){
        JQuery span2d = jq(".span2");
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, span2d.height());
        assertEquals("2", span2d.parent().attr("colspan"));
        assertEquals("span 2d", span2d.find(ITEM_TEXT.selector()).text());

        JQuery span3d = jq(".span3");
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, span3d.height());
        assertEquals("3", span3d.parent().attr("colspan"));
        assertEquals("span 3d", span3d.find(ITEM_TEXT.selector()).text());

        JQuery span4d = jq(".span4");
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, span4d.height());
        assertEquals("4", span4d.parent().attr("colspan"));
        assertEquals("span 4d", span4d.find(ITEM_TEXT.selector()).text());
    }


    @Test
    public void renderMoreLinks350Height(){
        click(jq("$height350px"));
        waitResponse();
        JQuery weeks = jq(MONTH_WEEK.selector());

        verify1stWeek(weeks);
        verify2ndWeek(weeks);
        verify3rdWeek(weeks);
        verify4thWeek(weeks);
        verify5thWeek(weeks);

        reloadPage();
    }
    private void verify5thWeek(JQuery weeks) {
        JQuery week5th = weeks.eq(4);
        JQuery moreLinks = week5th.find(MORE_LINK.selector());
        assertEquals(0, moreLinks.length());
    }
    private void verify4thWeek(JQuery weeks) {
        JQuery week4th = weeks.eq(3);
        JQuery moreLinks = week4th.find(MORE_LINK.selector());
        assertEquals(7, moreLinks.length());
        assertEquals("2 more", moreLinks.eq(0).text());
        for (int i = 1 ; i < 7 ; i ++){
            assertTrue(moreLinks.eq(i).text().isEmpty());
        }
    }
    private void verify3rdWeek(JQuery weeks) {
        JQuery week3rd = weeks.eq(2);
        JQuery moreLinks = week3rd.find(MORE_LINK.selector());
        assertEquals(0, moreLinks.length());
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, jq(".over-weekend").height());
    }
    private void verify2ndWeek(JQuery weeks) {
        JQuery week2nd = weeks.eq(1);
        JQuery moreLinks = week2nd.find(MORE_LINK.selector());
        assertEquals(0, moreLinks.length());
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, jq(".over-weekend").height());
    }
    private void verify1stWeek(JQuery weeks) {
        JQuery week1st = weeks.eq(0);
        JQuery moreLinks = week1st.find(MORE_LINK.selector());
        assertEquals(7, moreLinks.length());

        assertEquals("3 more", moreLinks.eq(0).text());
        assertEquals("3 more", moreLinks.eq(1).text());
        assertEquals("3 more", moreLinks.eq(2).text());
        assertEquals("2 more", moreLinks.eq(3).text());
        assertEquals("2 more", moreLinks.eq(4).text());
        assertEquals("1 more", moreLinks.eq(5).text());
        assertEquals("1 more", moreLinks.eq(6).text());
    }

    @Test
    public void testItemsData(){
        Object itemsDataObj = getEvalObject("zk.Widget.$('$cal')._itemsData");
        assertNotNull(itemsDataObj);
        List itemListByWeek = (List) itemsDataObj;
        test1stWeekItems(itemListByWeek);
        test2ndWeekItems(itemListByWeek);
        test3rdWeekItems(itemListByWeek);
        test4thWeekItems(itemListByWeek);
        test5thWeekItems(itemListByWeek);
    }

    private void test5thWeekItems(List itemListByWeek) {
        List<List> itemListByDay = (List)itemListByWeek.get(4);
        assertEquals(0, itemListByDay.get(0).size());
        assertEquals(0, itemListByDay.get(1).size());
        assertEquals(0, itemListByDay.get(2).size());
        assertEquals(0, itemListByDay.get(3).size());
        assertEquals(0, itemListByDay.get(4).size());
        assertEquals(0, itemListByDay.get(5).size());
        assertEquals(0, itemListByDay.get(6).size());
    }

    private void test4thWeekItems(List itemListByWeek) {
        List<List> itemListByDay = (List)itemListByWeek.get(3);
        assertEquals(2, itemListByDay.get(0).size());
        assertEquals(0, itemListByDay.get(1).size());
        assertEquals(0, itemListByDay.get(2).size());
        assertEquals(0, itemListByDay.get(3).size());
        assertEquals(0, itemListByDay.get(4).size());
        assertEquals(0, itemListByDay.get(5).size());
        assertEquals(0, itemListByDay.get(6).size());
    }

    private void test3rdWeekItems(List itemListByWeek) {
        List<List> itemListByDay = (List)itemListByWeek.get(2);
        assertEquals(1, itemListByDay.get(0).size());
        assertEquals(0, itemListByDay.get(1).size());
        assertEquals(0, itemListByDay.get(2).size());
        assertEquals(0, itemListByDay.get(3).size());
        assertEquals(0, itemListByDay.get(4).size());
        assertEquals(0, itemListByDay.get(5).size());
        assertEquals(0, itemListByDay.get(6).size());
    }

    private void test2ndWeekItems(List itemListByWeek) {
        List<List> itemListByDay = (List)itemListByWeek.get(1);
        assertEquals(0, itemListByDay.get(0).size());
        assertEquals(0, itemListByDay.get(1).size());
        assertEquals(0, itemListByDay.get(2).size());
        assertEquals(0, itemListByDay.get(3).size());
        assertEquals(0, itemListByDay.get(4).size());
        assertEquals(1, itemListByDay.get(5).size());
        assertEquals(1, itemListByDay.get(6).size());
    }

    private static void test1stWeekItems(List<List> itemListByWeek) {
        List<List> itemListByDay = (List)itemListByWeek.get(0);

        assertEquals(3, itemListByDay.get(0).size());
        assertEquals(3, itemListByDay.get(1).size());
        assertEquals(3, itemListByDay.get(2).size());
        assertEquals(2, itemListByDay.get(3).size());
        assertEquals(2, itemListByDay.get(4).size());
        assertEquals(1, itemListByDay.get(5).size());
        assertEquals(1, itemListByDay.get(6).size());
    }

    protected Object getEval(String script, Object... args) {
        return ((JavascriptExecutor) driver).executeScript(script, args);
    }

    public Object getEvalObject(String script) {
        return ((JavascriptExecutor) driver).executeScript("return " + script);
    }


    public boolean isCssRuleApplied(WebElement element, String selector, String property, String value) {
        return (Boolean)((JavascriptExecutor) this.driver).executeScript("return isCssRuleApplied(arguments[0], arguments[1], arguments[2], arguments[3]);",
                element, selector, property, value);
    }

}
