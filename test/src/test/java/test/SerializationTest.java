package test;

import org.junit.jupiter.api.Test;
import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.impl.*;

import java.io.*;
import java.util.Calendar;

public class SerializationTest {

    @Test //ZKCAL-104
    public void modelItem() {
        SimpleCalendarModel calendarModel = new SimpleCalendarModel();
        SimpleCalendarItem item = new SimpleCalendarItem();
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 9);
        calendar.set(Calendar.MINUTE, 30);
        item.setBeginDate(calendar.getTime());
        calendar.set(Calendar.HOUR_OF_DAY, 11);
        calendar.set(Calendar.MINUTE, 30);
        item.setEndDate(calendar.getTime());
        item.setContent("event old Date: " + item.getBeginDate().toString());
        item.setSclass("custom myclass");
        calendarModel.add(item);

        ByteArrayOutputStream serializedData = new ByteArrayOutputStream();
        ObjectOutputStream serializedObject = null;
        try {
            serializedObject = new ObjectOutputStream(serializedData);
            serializedObject.writeObject(calendarModel);
            serializedObject.close();
            serializedData.close();

            ByteArrayInputStream deserializedData = new ByteArrayInputStream(serializedData.toByteArray());
            ObjectInputStream deserializedObject = new ObjectInputStream(deserializedData);
            SimpleCalendarModel deserializedModel = (SimpleCalendarModel) deserializedObject.readObject();

            if (!(deserializedModel.size() == calendarModel.size())) {
                throw new RuntimeException("model was deserialized incorrectly");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void calendar() {
        Calendars calendars = new Calendars();
        ByteArrayOutputStream serializedData = new ByteArrayOutputStream();
        ObjectOutputStream serializedObject = null;
        try {
            serializedObject = new ObjectOutputStream(serializedData);
            serializedObject.writeObject(calendars);
            serializedObject.close();
            serializedData.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}