package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.*;
import static test.CssClassNames.*;

public class ComponentAttributeTest extends CalendarTestBase{
    static {
            TEST_ZUL = "attribute.zul";
    }

    /**
     * drag ghost doesn't appear when read only is true
     */
    @Test //ZKCAL-126
    public void readOnly() {
        JQuery jan1WholeDayArea = jq(DAYLONG_EVT.selector()).eq(0);
        clickAt(jan1WholeDayArea,0, jan1WholeDayArea.height());//click at the first time slot
        waitResponse();
        assertTrue(jq(ITEM_GHOST.selector()).exists());
        reloadPage();
        click(jq("$readOnlyButton"));
        clickAt(jan1WholeDayArea,0, jan1WholeDayArea.height());//click at the first time slot
        waitResponse();
        assertFalse(jq(ITEM_GHOST.selector()).exists());
    }

    @Test //ZKCAL-131
    public void heightPixel(){
        click(jq("$height500px"));
        waitResponse();
        assertEquals(500, jq(BODY.selector()).height()); //check actual inner height, not the css value
        reloadPage();
    }

    /**
     * change currentDateTime, beginning date and end date should be updated to the week of the current date
     */
    @Test //ZKCAL-84
    public void currentDateTimeTest() {
        JQuery day1st = firstDay();
        assertEquals("12/29", day1st.text()); //beginning date
        JQuery day7th = day7th();
        assertEquals("1/4", day7th.text()); //end date

        click(jq("$change"));
        waitResponse();
        assertEquals("6/1", day1st.text()); //beginning date
        assertEquals("6/7", day7th.text()); //end date
        reloadPage();
    }

    private JQuery day7th() {
        return jq(DAY_OF_WEEK_FORMAT.selector()).eq(6);
    }

    private JQuery firstDay() {
        return jq(DAY_OF_WEEK_FORMAT.selector()).eq(0);
    }

    @Test //ZKCAL-106
    public void changePeriod(){
        click(jq("$next"));
        waitResponse();
        JQuery day1st = firstDay();
        assertEquals("1/5", day1st.text()); //beginning date
        JQuery dayLast = day7th();
        assertEquals("1/11", dayLast.text()); //end date

        click(jq("$previous"));
        waitResponse();
        assertEquals("12/29", day1st.text()); //beginning date
        assertEquals("1/4", dayLast.text()); //end date
    }

    @Test //ZKCAL-106
    public void changePeriod5DaysWeek() {
        click(jq("$5days"));
        waitResponse();
        click(jq("$next"));
        waitResponse();
        JQuery day1st = firstDay();
        assertEquals("1/8", day1st.text()); //beginning date
        JQuery day5th = jq(DAY_OF_WEEK_FORMAT.selector()).eq(4);
        assertEquals("1/12", day5th.text()); //end date

        click(jq("$previous"));
        waitResponse();
        assertEquals("1/1", day1st.text()); //beginning date
        assertEquals("1/5", day5th.text()); //end date

        reloadPage();
    }

}
