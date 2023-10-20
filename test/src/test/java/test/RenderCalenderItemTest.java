package test;

import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.WebDriverTestCase;
import org.zkoss.test.webdriver.ztl.JQuery;

public class RenderCalenderItemTest extends WebDriverTestCase {

    public static final String TEST_ZUL = "renderItem.zul";

    static{
        System.setProperty("zkWebdriverContextPath", "/test/");
    }

    /** non-overlapping item has 100% width, no shifting */
    @Test
    public void nonOverlapping(){
        connect(TEST_ZUL);
        String width = jq(".z-calitem").get(0).get("style.width");
        Assert.assertEquals("100%", width);
        String left = jq(".z-calitem").get(0).get("style.left");
        Assert.assertEquals("0%", left);
    }

    /**
     */
    @Test
    public void continuousItemsNotOverlapping() {
        connect(TEST_ZUL);
        JQuery continuousItems = jq(".continuous");
        Assert.assertEquals(3, continuousItems.length());
        for (int i = 0 ; i< continuousItems.length() ; i++){
            Assert.assertEquals("100%", continuousItems.get(0).get("style.width"));
        }
    }
}
