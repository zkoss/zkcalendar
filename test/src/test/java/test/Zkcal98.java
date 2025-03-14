package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static test.CssClassNames.*;

public class Zkcal98 extends CalendarTestBase {
    static {
            TEST_ZUL = "zkcal-98.zul";
    }

    /**
     * ZKCAL-98 after switching to month mold and back to default mold, renders the date off correctly
     */
    @Test
    public void switchMold(){
        click(jq("$next"));
        waitResponse();
        click(jq("$defaultMold"));
        waitResponse();
        click(jq("$monthMold"));
        waitResponse();
        JQuery weeks = jq(MONTH_WEEK.selector());
        assertEquals(12, weeks.eq(0).find(MONTH_DATE_OFF.selector()).length());
        assertEquals(0, weeks.eq(1).find(MONTH_DATE_OFF.selector()).length());
        assertEquals(0, weeks.eq(2).find(MONTH_DATE_OFF.selector()).length());
        assertEquals(0, weeks.eq(3).find(MONTH_DATE_OFF.selector()).length());
        assertEquals(2, weeks.eq(4).find(MONTH_DATE_OFF.selector()).length());
    }
}
