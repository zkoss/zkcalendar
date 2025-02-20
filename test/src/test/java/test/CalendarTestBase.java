package test;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.zkoss.test.webdriver.WebDriverTestCase;

/**
 * Reuse web driver to avoid connecting a test page for each test case, reduce test case running time.
 */
public class CalendarTestBase extends WebDriverTestCase {
    static String TEST_ZUL;
    static {
        System.setProperty("zkWebdriverContextPath", "/test/");
        System.setProperty("zkWebdriverTestURLPackage", "test");
    }
    static protected WebDriver staticDriver;

    static protected String calendarSclass(String subCssClass) {
        return ".z-calendars-"+subCssClass;
    }

    protected void reloadPage() {
        driver.navigate().refresh();
    }
    @BeforeAll
    public void init(){
        connect(TEST_ZUL);
        staticDriver = this.driver;
    }

    @BeforeEach
    public void initDriver(){
        this.driver = staticDriver;
    }

    @AfterEach
    public void stop() {
        //don't quit, reuse the webdriver
        assertNoAnyError(); //each test case doesn't need to check js error
    }

    @AfterAll
    public void clean(){
        driver.quit();
    }


    /* localhost testing can have smaller time value to reduce testing time, */
    @Override
    protected int getSpeed() {
        return 50;
    }
}
