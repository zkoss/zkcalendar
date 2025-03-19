package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.*;
import static test.CssClassNames.*;


/**
 * verifying the month mold's DOM structure.
 */
public class MonthMoldTest extends CalendarTestBase{

    static {
        TEST_ZUL = "mold.zul?mold=month";
    }

    @Test
    public void monthHeaderText() {
        JQuery monthHeader = jq(MONTH_HEADER.selector());
        assertEquals(7, monthHeader.find("th").length(), "There should be 7 day headers");

        String[] expectedDays = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
        for (int i = 0; i < expectedDays.length; i++) {
            assertEquals(expectedDays[i], monthHeader.find("th").eq(i).text(), "Day header text should match");
        }
    }

    @Test
    public void weekStructure() {
        JQuery weeks = jq(MONTH_WEEK.selector());
        assertEquals(5, weeks.length(), "There should be 5 weeks in the month view");

        for (int i = 0; i < weeks.length(); i++) {
            JQuery week = weeks.eq(i);
            //verify with style.top which matches what we specify value in LESS file, css() returns a calculated result
            int top = 20 * i;
            assertEquals(top+"%", week.get(0).get("style.top"), "Week " + (i + 1) + " should have correct top position");
            assertEquals("20%", week.get(0).get("style.height"), "Week " + (i + 1) + " should have correct height");
            assertEquals(7, week.find(MONTH_DATE.selector()).length(), "Each week should have 7 days");
        }
    }

    @Test
    public void monthDateCountAndText() {
        JQuery monthDates = jq(".z-calendars-month-date");
        assertEquals(35, monthDates.length());

        //test Jan
        for (int i = 0; i < 31; i++) {
            String dayText = (i + 1) + "";
            if (i == 0){
                assertEquals("Jan " + dayText, monthDates.eq(i).text());
            }else {
                assertEquals(dayText, monthDates.eq(i).text());
            }
        }
        //check Feb
        for (int i = 31; i< monthDates.length() ; i++){
            String dayText = (i + 1 - 31) + "";
            if (i == 31){
                assertEquals("Feb " + dayText, monthDates.eq(i).text());
            }else{
                assertEquals(dayText, monthDates.eq(i).text());
            }
        }
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

    @Test
    public void outmostBorder(){
        JQuery $week = jq(CssClassNames.MONTH_CONTENT.selector());
        assertEquals("1px solid rgb(217, 217, 217)", $week.css("border"));
    }

}
