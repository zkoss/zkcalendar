package test;

import org.zkoss.bind.annotation.*;

import java.time.LocalDateTime;

public class CalendarAttributeViewModel {

    private LocalDateTime currentDateTime = LocalDateTime.of(2025, 1, 1, 0, 0);
    private boolean readOnly = false;

    @Command
    @NotifyChange("currentDateTime")
    public void change() {
        currentDateTime = LocalDateTime.of(2025, 6, 1, 0, 0);
    }

    public boolean isReadOnly() {
        return readOnly;
    }
    //ZKCAL-126
    public void setReadOnly(boolean readOnly) {
        this.readOnly = readOnly;
    }

    public LocalDateTime getCurrentDateTime() {
        return currentDateTime;
    }
}
