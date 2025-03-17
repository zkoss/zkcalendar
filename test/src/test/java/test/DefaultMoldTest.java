package test;

import org.junit.jupiter.api.Test;
import org.zkoss.test.webdriver.ztl.JQuery;

import static org.junit.jupiter.api.Assertions.*;


/**
 * verifying the default mold's DOM structure.
 */
public class DefaultMoldTest extends CalendarTestBase{

    static {
        TEST_ZUL = "mold.zul";
    }

    /**
     * Checks that the week content has 7 elements and their inner text matches the expected days of the week.
     */
    @Test
    public void header(){
        JQuery weekContent = jq(CssClassNames.DAY_OF_WEEK_CONTENT.selector());
        assertEquals(7, weekContent.length());
        // for each content check its inner text is Sun, Mon, Tue, Wed, Thu, Fri, Sat
        for (int i = 0; i < 7; i++) {
            assertEquals("Sun 1/1,Mon 1/2,Tue 1/3,Wed 1/4,Thu 1/5,Fri 1/6,Sat 1/7"
                    .split(",")[i], weekContent.eq(i).text());
        }
    }

    /**
     * verify the existence of the timezone element
     */
    @Test
    public void timezone(){
        assertTrue(jq(CssClassNames.TIMEZONE.selector()).exists());
    }

    /**
     *  Checks left headers: 24 elements and their text matches the expected hour format (e.g., 00:00, 01:00, etc.).
     */
    @Test
    public void hourOfDayHeader(){
        JQuery hourOfDay = jq(CssClassNames.HOUR_OF_DAY.selector());
        assertEquals(24, hourOfDay.length());
        for (int i = 0; i < 24; i++) {
            assertEquals(String.format("%02d:00", i), hourOfDay.eq(i).text());
        }
        assertEquals("61px", hourOfDay.css("height"));
        assertEquals("center", hourOfDay.css("text-align"));
        assertEquals("-7px", hourOfDay.css("top"));
    }

    /**
     * Checks that there are 7 week day elements and 2 weekend day elements.
     */
    @Test
    public void weekDay(){
        JQuery weekDay = jq(CssClassNames.WEEK_DAY.selector());
        assertEquals(7, weekDay.length());
        JQuery weekendDay = jq(CssClassNames.WEEK_DAY.selector()+CssClassNames.WEEK_WEEKEND.selector());
        assertEquals(2, weekendDay.length());
    }

    /**
     * verify whole day calendar item area
     */
    @Test
    public void dayLong(){
        JQuery dayLongBlocks = jq(CssClassNames.DAYLONG_EVT.selector());
        assertEquals(7, dayLongBlocks.length());
        JQuery dayLong = dayLongBlocks.eq(0);
        assertEquals("top", dayLong.css("vertical-align"));
        assertEquals("1px solid rgb(217, 217, 217)", dayLong.css("border-left"));
        double height = Double.parseDouble(dayLong.css("height").replace("px", ""));
        //different environment (local/jenkins), different browsers
        assertTrue(height >= 23 && height < 25, "Height should be between 23 and 25px, but was " + height);
    }

    /**
     * verify 24 hour separator for the whole week
     */
    @Test
    public void hourSeparator(){
        JQuery hourSeparators = jq(CssClassNames.HOUR_SEPARATOR.selector());

        assertEquals(24, hourSeparators.length());
        assertEquals("30px", hourSeparators.css("height"));
        assertEquals("30px", hourSeparators.css("margin-bottom"));
        assertEquals("1px dashed rgb(217, 217, 217)", hourSeparators.css("border-bottom"));
        JQuery firstSeparator = hourSeparators.eq(0);
        assertEquals("0px none rgb(0, 0, 0)", firstSeparator.css("border-top"));
        JQuery secondSeparator = hourSeparators.eq(1);
        assertEquals("1px solid rgb(217, 217, 217)", secondSeparator.css("border-top"));
    }

    /**
     * ZKCAL-110. verify day of week header DOM structure after days change.
     */
    @Test
    public void dayOfWeekHeaderDaysChange(){
        click(jq("$to1DayButton"));
        waitResponse();
        click(jq("$to5DaysButton"));
        waitResponse();
        JQuery dayWeekContents = jq(CssClassNames.DAY_OF_WEEK_CONTENT.selector());
        assertEquals(5, dayWeekContents.length());
        for (int i = 0; i < 5; i++) {
            JQuery content = dayWeekContents.eq(i);
            assertEquals("div", toElement(content.get(0)).getTagName());
            assertEquals(CssClassNames.DAY_OF_WEEK_CONTENT.className(), content.attr("class"));

            // Check inner structure
            assertTrue(content.text().matches("^\\w{3}\\s\\d{1,2}/\\d{1,2}$")); // Matches pattern like "Sun 1/1"

            // Verify inner div format element
            JQuery formatDiv = content.children("div");
            assertEquals(1, formatDiv.length());
            assertEquals("div", toElement(content.get(0)).getTagName());
            assertEquals(CssClassNames.DAY_OF_WEEK_FORMAT.className(), formatDiv.attr("class"));
        }
        reloadPage();
    }

}
