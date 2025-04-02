package org.zkoss.calendar.essentials;

import org.zkoss.calendar.Calendars;
import org.zkoss.calendar.event.CalendarsEvent;
import org.zkoss.calendar.impl.*;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.*;
import org.zkoss.zul.*;

import java.time.*;

public class CalendarCrudComposer extends SelectorComposer {

    @Wire
    private Datebox beginBox;
    @Wire
    private Datebox endBox;
    @Wire
    private Textbox titleBox;
    @Wire
    private Textbox contentBox;
    @Wire
    private Calendars calendars;
    @Wire
    private Popup creationBox;
    @Wire
    private Button create;
    @Wire
    private Button update;
    @Wire
    private Button delete;

    final private SimpleCalendarModel model = new SimpleCalendarModel();
    private DefaultCalendarItem selectedItem;

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        calendars.setModel(model);
    }

    @Listen(CalendarsEvent.ON_ITEM_CREATE + " = #calendars")
    public void showCreationBox(CalendarsEvent event) {
        //initialize datebox with the user-clicked date/time
        beginBox.setValue(event.getBeginDate());
        endBox.setValue(event.getEndDate());
        //reset previous values
        titleBox.setValue("");
        contentBox.setValue("");
        //put focus for user convenience
        titleBox.setFocus(true);

        toCreateMode();
        creationBox.open(calendars, "middle_center");
    }

    @Listen(CalendarsEvent.ON_ITEM_EDIT + " = #calendars")
    public void edit(CalendarsEvent event) {
        selectedItem = (DefaultCalendarItem) event.getCalendarItem();
        beginBox.setValueInLocalDateTime(LocalDateTime.ofInstant(selectedItem.getBegin(), calendars.getDefaultTimeZone().toZoneId()));
        endBox.setValueInLocalDateTime(LocalDateTime.ofInstant(selectedItem.getEnd(), calendars.getDefaultTimeZone().toZoneId()));
        titleBox.setValue(selectedItem.getTitle());
        contentBox.setValue(selectedItem.getContent());
        toEditMode();
        creationBox.open(calendars, "middle_center");
    }

    /**
     * Since {@link DefaultCalendarItem} is immutable, so we need to delete the old one and add the newly-created one.
     * @param event
     */
    @Listen(CalendarsEvent.ON_ITEM_UPDATE + " = #calendars")
    public void move(CalendarsEvent event) {
        selectedItem = (DefaultCalendarItem) event.getCalendarItem();
        model.remove(selectedItem);

        DefaultCalendarItem movedItem = DefaultCalendarItem.Builder.from(selectedItem)
                .withBegin(event.getBeginDate().toInstant().atZone(calendars.getDefaultTimeZone().toZoneId()).toLocalDateTime())
                .withEnd(event.getEndDate().toInstant().atZone(calendars.getDefaultTimeZone().toZoneId()).toLocalDateTime())
                .build();
        model.add(movedItem);
    }

    // show buttons for editing
    private void toEditMode() {
        update.setVisible(true);
        delete.setVisible(true);
        create.setVisible(false);
    }

    // show buttons for creation only
    private void toCreateMode() {
        update.setVisible(false);
        delete.setVisible(false);
        create.setVisible(true);
    }

    @Listen(Events.ON_CLICK + " = button[label='Cancel']")
    public void closeCreationBox() {
        creationBox.close();
    }

    @Listen(Events.ON_CLICK + " = button[label='Create']")
    public void create() {
        DefaultCalendarItem item = new DefaultCalendarItem.Builder()
                .withZoneId(calendars.getDefaultTimeZone().toZoneId())
                .withBegin(beginBox.getValueInLocalDateTime())
                .withEnd(endBox.getValueInLocalDateTime())
                .withTitle(titleBox.getValue())
                .withContent(contentBox.getValue())
                .build();

        model.add(item);
        closeCreationBox();
    }

    @Listen(Events.ON_CLICK + " = button[label='Update']")
    public void update() {
        model.remove(selectedItem);

        DefaultCalendarItem newItem = DefaultCalendarItem.Builder.from(selectedItem)
                .withBegin(beginBox.getValueInLocalDateTime())
                .withEnd(endBox.getValueInLocalDateTime())
                .withTitle(titleBox.getValue())
                .withContent(contentBox.getValue()).build();
        model.add(newItem);
        closeCreationBox();
    }

    @Listen(Events.ON_CLICK + " = button[label='Delete']")
    public void delete() {
        model.remove(selectedItem);
        closeCreationBox();
    }
}
