package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.*;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

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
        reloadPage(); //revert the page back to initial state, so other tests don't need to reload
    }

    @Test
    public void dayHoverEffect(){
        JQuery jan1 = jq(".z-calendars-day-of-week-inner").eq(0);
        getActions().moveToElement(toElement(jan1)).pause(20).perform();
        JQuery jan1Content = jq(".z-calendars-day-of-week-inner .z-calendars-day-of-week-fmt").eq(0);
        assertEquals(true, jan1Content.hasClass("z-calendars-day-over"));
    }

    @Test
    public void createItemEvent() {
        JQuery item = jq(".separate.z-calitem").eq(0);
        clickAt(item, item.width(), -(item.height()/2));
        waitResponse();
        JQuery firedEventLabel = jq(".firedEvent").eq(0);
        assertEquals("onItemCreate  Mon Jan 02 00:00:00 CST 2023 Mon Jan 02 01:00:00 CST 2023", firedEventLabel.text());
    }

    /**
     * click on the empty space in week-body, renders a item ghost for dragging
     */
    @Test
    public void createNewItemGhost(){
        JQuery item = jq(".separate.z-calitem").eq(0);
        clickAt(item, item.width(), -(item.height()/2));

        JQuery itemGhost = jq(ITEM_GHOST.selector());
        assertTrue(itemGhost.exists());
        assertEquals(Size.HOUR_HEIGHT.value() * 2, itemGhost.height());

        JQuery itemHeader = itemGhost.find(ITEM_HEADER.selector());
        System.out.println(itemHeader.html());
        assertEquals("00:00 - 01:00", itemHeader.text());
    }
    @Test
    public void editItemEvent(){
        JQuery item = jq(".separate.z-calitem").eq(0);
        click(item);
        JQuery firedEventLabel = jq(".firedEvent").eq(0);
        waitResponse();
        assertEquals("onItemEdit non overlapped null null", firedEventLabel.text());
    }

    //dragdropTo() doesn't work on calendar item, but overlapped window works
    public void updateItem(){
        JQuery item = jq(".separate.z-calitem").eq(0);
        assertTrue(item.exists());
        dragdropTo(item,0 ,0, item.width(), -(item.height()/2)); //drag right to the next day
        waitResponse();
        JQuery firedEventLabel = jq(".firedEvent").eq(0);
        assertEquals("onItemUpdate non overlapped Mon Jan 02 00:00:00 CST 2023 Mon Jan 02 01:00:00 CST 2023", firedEventLabel.text());
    }

}
