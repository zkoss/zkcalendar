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
    }
    static protected WebDriver staticDriver;

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
    }

    @AfterAll
    public void clean(){
        driver.quit();
    }
}
