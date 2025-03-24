package test;

import org.junit.jupiter.api.Test;
import org.zkoss.calendar.impl.DefaultCalendarItem;

import java.time.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

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

        // Verify both items are equal
        assertEquals(original, copy);
        assertEquals(original.hashCode(), copy.hashCode());
    }
}