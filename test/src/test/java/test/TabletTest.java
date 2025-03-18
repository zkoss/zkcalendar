package test;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.chrome.ChromeOptions;
import org.zkoss.web.servlet.Servlets;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class TabletTest extends CalendarTestBase{

    static {
        TEST_ZUL = "tablet.zul";
    }

    @Override
    protected ChromeOptions getWebDriverOptions() {
        return super.getWebDriverOptions()
                .addArguments("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15");
    }

    @Test //ZKCAL-122
    public void renderCalendar(){
        //TODO we can verify more upon DOM structure
        assertTrue(jq(CssClassNames.CALENDAR.selector()).exists());
    }

    void printZk() {
        JavascriptExecutor executor = (JavascriptExecutor) this.driver;
        Object zkObj = executor.executeScript("return Object.entries(zk).map(([k,v]) => k + ': ' + v).join('\\n')");
        System.out.println("zk: " + zkObj);
    }


}
