package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.*;
import static test.CssClassNames.*;

/**
 * test attributes under month mold
 */
public class ComponentAttributeMonthTest extends CalendarTestBase{
    static {
            TEST_ZUL = "attribute.zul?mold=month";
    }

    /**
     * @see ComponentAttributeTest#readOnly()
     */
    @Test
    public void readOnly() {
        JQuery day1 = jq(MONTH_WEEK.child(WEEK_WEEKEND).selector()).eq(0);
        click(day1);
        waitResponse();
        assertTrue(jq(MONTH_DRAG_DROP.child(MONTH_DRAG_DROP_ROPE).selector()).exists());
        reloadPage();

        click(jq("$readOnlyButton"));
        waitResponse();
        click(day1);
        assertFalse(jq(MONTH_DRAG_DROP.child(MONTH_DRAG_DROP_ROPE).selector()).exists());
        reloadPage();
    }

    @Test
    public void heightPixel(){
        click(jq("$height500px"));
        waitResponse();
        assertEquals(500, jq(CALENDAR.selector()).height()); //check actual inner height, not the css value
        reloadPage();
    }

    /**
     * @see ComponentAttributeTest#currentDateTimeTest()
     */
    @Test
    public void currentDateTimeTest() {
        JQuery day1st = firstDay();
        assertEquals("29", day1st.text()); //beginning date
        JQuery dayLast = lastDay();
        assertEquals("Feb 1", dayLast.text()); //end date

        click(jq("$change"));
        waitResponse();
        assertEquals("Jun 1", day1st.text()); //beginning date
        assertEquals("5", dayLast.text()); //end date
        reloadPage();
    }

    private JQuery lastDay() {
        return jq(MONTH_WEEK.child(MONTH_DATE_CONTENT).selector()).last();
    }

    private JQuery firstDay() {
        return jq(MONTH_WEEK.child(MONTH_DATE_CONTENT).selector()).eq(0);
    }

    @Test //ZKCAL-106
    public void changePeriod(){
        click(jq("$next"));
        waitResponse();
        JQuery day1st = firstDay();
        assertEquals("26", day1st.text()); //beginning date
        JQuery dayLast = lastDay();
        assertEquals("Mar 1", dayLast.text()); //end date

        click(jq("$previous"));
        waitResponse();
        assertEquals("29", day1st.text()); //beginning date
        assertEquals("Feb 1", dayLast.text()); //end date
    }
}
