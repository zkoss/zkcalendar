package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.*;
import static test.CssClassNames.*;

/**
 * supported events in month mold
 */
public class EventMonthTest extends CalendarTestBase{

    public static final int DRAG_GHOST_WIDTH = 273;
    public static final int DRAG_GHOST_HEIGHT = 163;

    static {
            TEST_ZUL = "event.zul?mold=month";
    }

    /**
     * clicking at the empty space of a date, the component should render a dragging ghost element at that date
     */
    @Test //ZKCAL-134
    public void clickEmptySpaceShowRope() {
        JQuery jan2 = getJan2();
        clickAt(jan2, 0 , ITEM_HEIGHT_MONTH_MOLD);
        waitResponse();
        JQuery dragGhost = jq(MONTH_DRAG_DROP.child(MONTH_DRAG_DROP_ROPE).selector());
        assertTrue(dragGhost.exists());

        assertEquals(50, parseInt(dragGhost.css("top")), 1);
        assertEquals(279, parseInt(dragGhost.css("left")) ,1);
        assertEquals(DRAG_GHOST_WIDTH,dragGhost.width(), 1);
        assertEquals(DRAG_GHOST_HEIGHT,dragGhost.height(), 1);
        reloadPage();
    }

    @Test
    public void clickDragShowBiggerRope(){
        JQuery jan2 = getJan2();
        int dateWidth = jan2.width();
        //drag over 2 days
        getActions().clickAndHold(toElement(jan2))
                .moveByOffset(dateWidth/2, ITEM_HEIGHT_MONTH_MOLD)
                .moveByOffset(dateWidth, 0).release().perform();
        waitResponse();
        JQuery dragGhost = jq(MONTH_DRAG_DROP.child(MONTH_DRAG_DROP_ROPE).selector());
        assertTrue(dragGhost.exists());
        assertEquals(50, parseInt(dragGhost.css("top")), 1);
        assertEquals(279, parseInt(dragGhost.css("left")) ,1);
        assertEquals(DRAG_GHOST_WIDTH * 2,dragGhost.width(), 1); //
        assertEquals(DRAG_GHOST_HEIGHT,dragGhost.height(), 1);
        reloadPage();
    }

    /**
     * clicking at the empty space of a date, the component should fire onItemCreate event
     */
    @Test
    public void itemCreateEvent(){
        JQuery jan2 = getJan2();
        assertEquals("2", jan2.find(MONTH_DATE_CONTENT.selector()).text());
        clickAt(jan2, 0 , ITEM_HEIGHT_MONTH_MOLD);
        waitResponse();
        JQuery firedEventLabel = jq(".firedEvent");
        assertEquals("onItemCreate  Mon Jan 02 00:00:00 CST 2023 Tue Jan 03 00:00:00 CST 2023", firedEventLabel.text());
        reloadPage();
    }

    @Test
    public void itemEditEvent(){
        JQuery item = jq(".separate");
        click(item);
        waitResponse();
        JQuery firedEventLabel = jq(".firedEvent");
        assertEquals("onItemEdit non overlapped null null", firedEventLabel.text());
    }

    private JQuery getJan2() {
        return jq(MONTH_WEEK.selector()).eq(0).find(MONTH_DATE.selector()).eq(1);
    }
}
