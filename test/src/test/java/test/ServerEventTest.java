package test;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.json.*;
import org.zkoss.zk.au.AuRequest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;

public class ServerEventTest {

    public static final String FAKE_ID = "fake_id";

    /** for any reason a client sends an event with a non-existed item, don't cause a runtime error. */
    @Test //ZKCAL-86
    public void nullOnItemTooltipEvent() {
        Calendars calendars = new Calendars();
        AuRequest request = mockOnItemTooltipAuRequest(calendars);

        assertDoesNotThrow(() -> {
            calendars.service(request, false);
        });
    }

    @Test
    public void nullOnItemEditEvent() {
        Calendars calendars = new Calendars();
        AuRequest request = mockItemEditAuRequest(calendars);

        assertDoesNotThrow(() -> {
            calendars.service(request, false);
        });
    }

    @Test
    public void nullOnItemUpdateEvent() {
        Calendars calendars = new Calendars();
        AuRequest request = mockItemUpdateAuRequest(calendars);

        assertDoesNotThrow(() -> {
            calendars.service(request, false);
        });
    }

    AuRequest createBaseMockRequest(Calendars calendars, String command, JSONArray dataArray) {
        AuRequest request = Mockito.mock(AuRequest.class);
        JSONObject data = new JSONObject();
        data.put("data", dataArray);

        when(request.getCommand()).thenReturn(command);
        when(request.getData()).thenReturn((Map)data);
        when(request.getComponent()).thenReturn(calendars);

        return request;
    }

    JSONArray createBaseDataArray() {
        JSONArray dataArray = new JSONArray();
        dataArray.add(FAKE_ID);
        for (int i = 1; i <= 4; i++) {
            dataArray.add(i);
        }
        return dataArray;
    }

    AuRequest mockOnItemTooltipAuRequest(Calendars calendars) {
        return createBaseMockRequest(calendars, CalendarsEvent.ON_ITEM_TOOLTIP, createBaseDataArray());
    }

    AuRequest mockItemEditAuRequest(Calendars calendars) {
        return createBaseMockRequest(calendars, CalendarsEvent.ON_ITEM_EDIT, createBaseDataArray());
    }

    AuRequest mockItemUpdateAuRequest(Calendars calendars) {
        JSONArray dataArray = createBaseDataArray();
        dataArray.add(System.currentTimeMillis());
        dataArray.add(System.currentTimeMillis());
        return createBaseMockRequest(calendars, CalendarsEvent.ON_ITEM_UPDATE, dataArray);
    }
}