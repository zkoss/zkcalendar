package test;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.zkoss.test.webdriver.ztl.JQuery;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static test.CssClassNames.*;

public class RenderItemMonthTest extends CalendarTestBase {

    static {
        TEST_ZUL = "renderItemMonth.zul";
    }


    @Test //ZKCAL-114
    public void instantItemCauseNoError() {
        JQuery sameBeginEndTimeItem = jq(".z-calendars-day-of-month-body").eq(3).find("tr").eq(1).find(".z-calitem.instant");
        assertEquals(1, sameBeginEndTimeItem.length());
        assertEquals("00:00 ",  sameBeginEndTimeItem.find(".z-calitem-header").get(0).get("textContent"));
    }

    @Test //ZKCAL-114 ZKCAL-119
    public void itemsOnSameDay(){
        JQuery firstWeekBody = jq(".z-calendars-day-of-month-body").eq(0);
        //first row contains month header
        JQuery firstRowContent = firstWeekBody.find("tr").eq(0).find(".z-calendars-month-date-cnt");
        assertEquals("Jan 1", firstRowContent.get(0).get("textContent"));

        JQuery secondRow = firstWeekBody.find("tr").eq(1);
        assertEquals("00:00 ", secondRow.find(".z-calitem-header").get(0).get("textContent"));
        JQuery thirdRow = firstWeekBody.find("tr").eq(2);
        assertEquals("01:00 ", thirdRow.find(".z-calitem-header").get(0).get("textContent"));
        JQuery fourthRow = firstWeekBody.find("tr").eq(3);
        assertEquals("03:00 ", fourthRow.find(".z-calitem-header").get(0).get("textContent"));
    }

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
        assertTrue(segment1.find(ITEM_RIGHT_ARROW.selector()).exists());
        assertEquals("0px", segment1.find(".z-calitem-inner").css("border-top-right-radius"));
        assertEquals("0px", segment1.find(".z-calitem-inner").css("border-bottom-right-radius"));


        JQuery segment2 = overWeekItem.eq(1);
        assertTrue(segment2.find(ITEM_LEFT_ARROW.selector()).exists());
        assertEquals("0px", segment2.find(".z-calitem-inner").css("border-top-left-radius"));
        assertEquals("0px", segment2.find(".z-calitem-inner").css("border-bottom-left-radius"));
    }

    @Test //ZKCAL-124 ZKCAL-123 ZKCAL-125
    public void endAfter1200(){
        JQuery item = jq(".end-after-12");
        assertEquals(1, item.length());
        assertEquals("11:00 end after 12:00", item.find(ITEM_HEADER.selector()).text());
    }

    @Test //ZKCAL-127
    public void zkcal127(){
        JQuery item = jq(".zkcal-127");
        assertEquals(1, item.length());
        assertEquals("13:30 ZKCAL-127", item.find(ITEM_HEADER.selector()).text());
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, item.height());
    }

    @Test //ZKCAL-80
    public void itemHeaderContentTooltip() {
        JQuery item = jq(".zkcal-80");
        assertEquals(1, item.length());
        final String TITLE = "00:00 ZKCAL-80 Calendar item text is cut if not enough space to display";

        JQuery content = item.find(ITEM_CONTENT.selector());
        assertEquals("", content.text());
        JQuery header = item.find(ITEM_HEADER.selector());
        assertEquals(TITLE, header.text());
        assertEquals(TITLE, header.attr("title"));
    }

    /**
     * use class selector to verify DOM structure
     */
    @Test
    public void instantItemDOMStructure() {
        JQuery instantItem = jq(".instant").eq(0);

        assertEquals("00:00 ", instantItem.find(ITEM_INNER.selector() + " " + ITEM_HEADER.selector()).text());
        assertFalse(instantItem.find(ITEM_INNER.selector() + " " + ITEM_CONTENT.selector()).exists());
    }

    /**
     * verify colspan of spanning day items
     */
    @Test //ZKCAL-94
    public void spanDaysItem(){
        JQuery span2d = jq(".span2");
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, span2d.height());
        assertEquals("2", span2d.parent().attr("colspan"));
        assertEquals("00:00 span 2d", span2d.find(ITEM_HEADER.selector()).text());

        JQuery span3d = jq(".span3");
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, span3d.height());
        assertEquals("3", span3d.parent().attr("colspan"));
        assertEquals("00:00 span 3d", span3d.find(ITEM_HEADER.selector()).text());

        JQuery span4d = jq(".span4");
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, span4d.height());
        assertEquals("4", span4d.parent().attr("colspan"));
        assertEquals("00:00 span 4d", span4d.find(ITEM_HEADER.selector()).text());
    }


    @Test
    public void renderMoreLinks350Height(){
        shrinkCalendarHeight();
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
        assertEquals("1 more", moreLinks.eq(1).text());
        assertEquals("1 more", moreLinks.eq(2).text());
        assertEquals("2 more", moreLinks.eq(3).text());
        assertEquals("1 more", moreLinks.eq(4).text());
        assertTrue(moreLinks.eq(5).text().isEmpty());
        assertTrue(moreLinks.eq(6).text().isEmpty());
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
        assertEquals(1, itemListByDay.get(1).size());
        assertEquals(1, itemListByDay.get(2).size());
        assertEquals(2, itemListByDay.get(3).size());
        assertEquals(1, itemListByDay.get(4).size());
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

    /**
     * ZKCAL-79. Tests the popup functionality when clicking "more" link in the calendar month view.
     * The test verifies different cases of items spanning across days:
     * <ul>
     *   <li>Single day items have no span indicators</li>
     *   <li>Items spanning to next day show right span indicator</li>
     *   <li>Items spanning both previous and next days show both indicators</li>
     *   <li>Items spanning from previous day show left span indicator</li>
     * </ul>
     */
    @Test
    public void itemSpanIndicatorInMoreItemPopup(){
        shrinkCalendarHeight();
        JQuery weeks = jq(MONTH_WEEK.selector());
        JQuery week1st = weeks.eq(0);
        JQuery moreLinks = week1st.find(MORE_LINK.selector());

        oneDayItemHasNoSpanIndicator(moreLinks);
        itemOverNextDay(moreLinks);
        itemOverPreviousNextDay(moreLinks);
        itemOverPreviousDay(moreLinks);
        reloadPage();
    }

    private void itemOverPreviousDay(JQuery moreLinks) {
        click(moreLinks.eq(4));
        waitResponse();
        JQuery morePopup = jq(MORE_POPUP.selector());
        JQuery itemRow = morePopup.find("tr").eq(0);
        assertTrue(itemRow.find(ITEM_LEFT_SPAN_INDICATOR.selector()).children().exists());
        assertFalse(itemRow.find(ITEM_RIGHT_SPAN_INDICATOR.selector()).children().exists());
        click(morePopup.find(POPUP_CLOSE_ICON.selector()));

    }

    private void itemOverPreviousNextDay(JQuery moreLinks) {
        click(moreLinks.eq(2));
        waitResponse();
        JQuery morePopup = jq(MORE_POPUP.selector());
        JQuery itemRow = morePopup.find("tr").eq(0);
        assertTrue(itemRow.find(ITEM_LEFT_SPAN_INDICATOR.selector()).children().exists());
        assertTrue(itemRow.find(ITEM_RIGHT_SPAN_INDICATOR.selector()).children().exists());
        click(morePopup.find(POPUP_CLOSE_ICON.selector()));
    }

    private void itemOverNextDay(JQuery moreLinks) {
        click(moreLinks.eq(1));
        waitResponse();
        JQuery morePopup = jq(MORE_POPUP.selector());
        JQuery itemRow = morePopup.find("tr").eq(0);
        assertFalse(itemRow.find(ITEM_LEFT_SPAN_INDICATOR.selector()).children().exists());
        assertTrue(itemRow.find(ITEM_RIGHT_SPAN_INDICATOR.selector()).children().exists());
        click(morePopup.find(POPUP_CLOSE_ICON.selector()));
    }

    private void oneDayItemHasNoSpanIndicator(JQuery moreLinks){
        click(moreLinks.eq(0));
        waitResponse();
        JQuery morePopup = jq(MORE_POPUP.selector());
        JQuery itemRow = morePopup.find("tr").eq(0);
        assertFalse(itemRow.find(ITEM_LEFT_SPAN_INDICATOR.selector()).children().exists());
        assertFalse(itemRow.find(ITEM_RIGHT_SPAN_INDICATOR.selector()).children().exists());

        click(morePopup.find(POPUP_CLOSE_ICON.selector()));
    }

    private void shrinkCalendarHeight() {
        click(jq("$height350px"));
        waitResponse();
    }

    /**
     * format:
     * time, title
     */
   @Test //ZKCAL-94
   public void shortItemContentText() {
       JQuery shortItem = jq(".end-after-12");
       JQuery content = shortItem.find(CssClassNames.ITEM_CONTENT.selector());
       JQuery header = shortItem.find(CssClassNames.ITEM_HEADER.selector());

       assertEquals("11:00 end after 12:00", header.text());
   }

   @Test //ZKCAL-94
   public void dayLongItemContentText() {
       JQuery dayLongItem = jq(".span3");
       JQuery content = dayLongItem.find(ITEM_HEADER.selector());

       assertEquals("00:00 span 3d", content.text());
   }

    public Object getEvalObject(String script) {
        return ((JavascriptExecutor) driver).executeScript("return " + script);
    }

    @Test //ZKCAL-94
    public void colorItems() {
        JQuery shortItem = jq(".color-short");
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, shortItem.height());
        assertEquals("rgb(0, 100, 0)", shortItem.find(ITEM_HEADER.selector()).css("background-color")); // DarkGreen

        JQuery spanItem = jq(".color-long");
        assertEquals(ITEM_HEIGHT_MONTH_MOLD, spanItem.height());
        assertEquals("rgb(0, 0, 139)", spanItem.find(ITEM_HEADER.selector()).css("background-color")); // DarkBlue
    }

    @Test //ZKCAL-94
    public void changeItem(){
        click(jq("$changeItem"));
        waitResponse();
        JQuery shortItem = jq(".for-change");
        assertEquals("00:00 changed", shortItem.find(ITEM_HEADER.selector()).text());
    }

}
