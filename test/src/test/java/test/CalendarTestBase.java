package test;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.zkoss.test.webdriver.WebDriverTestCase;

import java.util.concurrent.TimeUnit;

/**
 * Reuse web driver to avoid connecting a test page for each test case, reduce test case running time.
 */
public class CalendarTestBase extends WebDriverTestCase {
    public static final int ITEM_HEIGHT_MONTH_MOLD = 20;
    static String TEST_ZUL;
    static {
        System.setProperty("zkWebdriverContextPath", "/test/");
        System.setProperty("zkWebdriverTestURLPackage", "test");
    }
    static protected WebDriver staticDriver;

    static protected String calendarSclass(String subCssClass) {
        return ".z-calendars-"+subCssClass;
    }
    public enum Size{
        HALF_HOUR_HEIGHT(30),
        BORDER(1);
        private final int value;

        Size(int value) {
            this.value = value;
        }

        public int value() {
            return value;
        }
        /** full item height contains top + bottom border */
        static public int itemHeight(int nHour){
            return nHour * 2 * HALF_HOUR_HEIGHT.value
                    + BORDER.value * 2 ;
        }
    }

    protected void reloadPage() {
        driver.navigate().refresh();
    }

    @BeforeEach
    public void initDriver(){
        if (this.driver == null){ //reuse the webdriver
            connect(TEST_ZUL);
            driver.manage().timeouts().setScriptTimeout(3000, TimeUnit.SECONDS);
        }
    }

    @AfterEach
    public void stop() {
        //don't quit, reuse the webdriver
        assertNoAnyError(); //each test case doesn't need to check js error
    }


    /* localhost testing can have smaller time value to reduce testing time, */
    @Override
    protected int getSpeed() {
        return 50;
    }

    /* remove comment for debug*/
//    @Override
//    protected boolean isHeadless() {
//        return false;
//    }
}
