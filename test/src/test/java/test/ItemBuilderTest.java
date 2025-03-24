package test;

import org.junit.jupiter.api.Test;
import org.zkoss.calendar.impl.DefaultCalendarItem;

import java.time.*;

import static org.junit.jupiter.api.Assertions.*;

public class ItemBuilderTest {

    @Test //ZKCAL-129
    public void fromExistingItem() {
        // Create initial item with all fields set
        LocalDateTime begin = LocalDateTime.of(2023, 1, 1, 9, 0);
        LocalDateTime end = LocalDateTime.of(2023, 1, 1, 10, 30);
        ZoneId zoneId = ZoneId.of("America/New_York");

        DefaultCalendarItem original = new DefaultCalendarItem.Builder()
                .withBegin(begin)
                .withEnd(end)
                .withZoneId(zoneId)
                .withTitle("Meeting")
                .withContent("Team Sync")
                .withHeaderStyle("background-color: #FF0000")
                .withContentStyle("background-color: #FFFFFF")
                .withSclass("important-meeting")
                .withLocked(true)
                .build();

        // Create new item using Builder.from()
        DefaultCalendarItem copy = DefaultCalendarItem.Builder.from(original).build();

        assertTrue(areItemsEqual(original, copy));
    }

    private boolean areItemsEqual(DefaultCalendarItem item1, DefaultCalendarItem item2) {
        if (item1 == item2) return true;
        if (item1 == null || item2 == null) return false;

        return item1.getTitle().equals(item2.getTitle()) &&
               item1.getContent().equals(item2.getContent()) &&
               item1.getHeaderStyle().equals(item2.getHeaderStyle()) &&
               item1.getContentStyle().equals(item2.getContentStyle()) &&
               item1.getSclass().equals(item2.getSclass()) &&
               item1.isLocked() == item2.isLocked() &&
               item1.getBegin().equals(item2.getBegin()) &&
               item1.getEnd().equals(item2.getEnd()) &&
               item1.getZoneId().equals(item2.getZoneId());
    }
}