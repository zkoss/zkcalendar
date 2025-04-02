package org.zkoss.calendar.essentials;

    import org.zkoss.calendar.Calendars;
    import org.zkoss.calendar.impl.*;
    import org.zkoss.zk.ui.Component;
    import org.zkoss.zk.ui.select.SelectorComposer;
    import org.zkoss.zk.ui.select.annotation.Wire;

    import java.time.LocalDateTime;

    public class Upgrade320Composer extends SelectorComposer {
        @Wire("calendars")
        private Calendars calendars;

        private SimpleCalendarModel model;
        LocalDateTime day1 = LocalDateTime.of(2025, 1, 1, 0, 0);

        @Override
        public void doAfterCompose(Component comp) throws Exception {
            super.doAfterCompose(comp);
            calendars.setCurrentDateTime(day1);
            initModel();
            calendars.setModel(model);
        }

        private void initModel() {
            model = new SimpleCalendarModel();

            DefaultCalendarItem halfHourItem = new DefaultCalendarItem.Builder()
                    .withTitle("Half Hour Meeting")
                    .withContent("Short meeting for 30 minutes")
                    .withBegin(day1.plusHours(3).withMinute(0).withSecond(0))
                    .withEnd(day1.plusHours(3).withMinute(30).withSecond(0))
                    .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                    .build();
            model.add(halfHourItem);

            DefaultCalendarItem halfHourItemNoTitle = new DefaultCalendarItem.Builder()
                    .withContent(".5h no title")
                    .withBegin(day1.plusDays(1).plusHours(3).withMinute(0).withSecond(0))
                    .withEnd(day1.plusDays(1).plusHours(3).withMinute(30).withSecond(0))
                    .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                    .build();
            model.add(halfHourItemNoTitle);

            DefaultCalendarItem twoHourItem = new DefaultCalendarItem.Builder()
                    .withTitle("Two Hour Meeting")
                    .withContent("Meeting content for 2 hours")
                    .withBegin(day1.withMinute(0).withSecond(0))
                    .withEnd(day1.withMinute(0).withSecond(0).plusHours(2))
                    .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                    .build();
            model.add(twoHourItem);

          DefaultCalendarItem twoHourItemNoTitle = new DefaultCalendarItem.Builder()
                    .withContent("2h no title")
                    .withBegin(day1.plusDays(1))
                    .withEnd(day1.plusDays(1).plusHours(2))
                    .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                    .build();
            model.add(twoHourItemNoTitle);

            DefaultCalendarItem twoDayItem = new DefaultCalendarItem.Builder()
                    .withTitle("Two Day Event")
                    .withContent("Event spanning 2 days")
                    .withBegin(day1.plusDays(1).withHour(5).withMinute(0).withSecond(0))
                    .withEnd(day1.plusDays(2).withHour(7).withMinute(0).withSecond(0))
                    .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                    .build();
            model.add(twoDayItem);
        }
    }