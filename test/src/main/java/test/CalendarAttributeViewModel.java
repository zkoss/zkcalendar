package test;

public class CalendarAttributeViewModel {

    private boolean readOnly = true;

    public boolean isReadOnly() {
        return readOnly;
    }
    //ZKCAL-126
    public void setReadOnly(boolean readOnly) {
        this.readOnly = readOnly;
    }
}
