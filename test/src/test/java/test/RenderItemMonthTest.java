package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.WebDriverTestCase;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.Assert.assertEquals;

public class RenderItemMonthTest extends WebDriverTestCase {

    public static final String TEST_ZUL = "renderItemMonth.zul";

    static {
        System.setProperty("zkWebdriverContextPath", "/test/");
    }

    /**
     */
    @Test //ZKCAL-114
    public void instantItemCauseNoError() {
        connect(TEST_ZUL);
        //fail to finish loading for a js error
        assertEquals(0 , jq(".z-loading").length());
        JQuery sameBeginEndTimeItem = jq(".z-calendars-day-of-month-body").eq(3).find("tr").eq(1).find(".z-calitem");
        assertEquals(1, sameBeginEndTimeItem.length());
        assertEquals("00:00",  sameBeginEndTimeItem.find(".z-calitem-header").get(0).get("textContent"));
    }

}
