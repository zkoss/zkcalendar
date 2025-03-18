package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.*;


/**
 * verifying the month mold's DOM structure.
 */
public class MonthMoldTest extends CalendarTestBase{

    static {
        TEST_ZUL = "mold.zul?mold=month";
    }

    /**
     * ZKCAL-95.
     */
    @Test
    public void weekend(){
        JQuery weekend = jq(CssClassNames.WEEK_WEEKEND.selector());
        assertEquals(22, weekend.length());
        click(jq("$nextButton"));
        waitResponse();
        assertEquals(22, weekend.length());
    }


}
