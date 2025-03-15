package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static test.CssClassNames.*;

public class Zkcal101 extends CalendarTestBase {
    static {
            TEST_ZUL = "zkcal-101.zul";
    }

    /**
     * ZKCAL-101 100% height should not produce a vertical scrollbar
     */
    @Test
    public void fullHeightShouldNotProduceVerticalScrollbar(){
        int pageHeight = jq(".z-page").height();
        assertEquals(pageHeight, jq(CALENDAR.selector()).height());
        assertEquals(pageHeight, jq(BODY.selector()).height());
    }
}
