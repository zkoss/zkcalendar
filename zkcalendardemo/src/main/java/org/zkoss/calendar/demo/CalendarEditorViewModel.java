package org.zkoss.calendar.demo;

import org.zkoss.bind.*;
import org.zkoss.bind.annotation.*;
import org.zkoss.bind.validator.AbstractValidator;
import org.zkoss.calendar.api.CalendarItem;
import org.zkoss.calendar.impl.*;
import org.zkoss.util.TimeZones;
import org.zkoss.zk.ui.event.EventListener;

import java.util.*;

public class CalendarEditorViewModel {
	
	private SimpleCalendarItem calendarItem;
	
	private boolean visible = false;

	public SimpleCalendarItem getCalendarItem() {
		return calendarItem;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}

	@Init
	public void init() {
		//subscribe a queue, listen to other controller
		QueueUtil.lookupQueue().subscribe(new QueueListener());
	}

	private void startEditing(SimpleCalendarItem calendarEventData) {
		this.calendarItem = calendarEventData;
		visible = true;
		
		//reload entire view-model data when going to edit
		BindUtils.postNotifyChange(null, null, this, "*");
	}


	public boolean isAllDay(Date beginDate, Date endDate) {
		final int MINUTE_IN_DAY = 1000 * 60 * 60 * 24;
		boolean allDay = false;

		if (beginDate != null && endDate != null) {
			long between = endDate.getTime() - beginDate.getTime();
			allDay = between > MINUTE_IN_DAY;
		}
		return allDay;
	}
	
	public Validator getDateValidator() {
		return new AbstractValidator() {
			@Override
			public void validate(ValidationContext ctx) {
				Map<String, Property> formData = ctx.getProperties(ctx.getProperty().getValue());
				Date beginDate = (Date) formData.get("beginDate").getValue();
				Date endDate = (Date) formData.get("endDate").getValue();
				if (beginDate == null) {
					addInvalidMessage(ctx, "beginDate", "Begin date is empty");
				}
				if (endDate == null) {
					addInvalidMessage(ctx, "endDate", "End date is empty");
				}
				if (beginDate != null && endDate != null && beginDate.compareTo(endDate) >= 0) {
					addInvalidMessage(ctx, "endDate", "End date is before begin date");
				}
			}
		};
	}

	@Command
	@NotifyChange("visible")
	public void cancel() {
		QueueMessage message = new QueueMessage(QueueMessage.Type.CANCEL);
		QueueUtil.lookupQueue().publish(message);
		this.visible = false;
	}

	@Command
	@NotifyChange("visible")
	public void delete() {
		QueueMessage message = new QueueMessage(QueueMessage.Type.DELETE, calendarItem);
		QueueUtil.lookupQueue().publish(message);
		this.visible = false;
	}

	@Command
	@NotifyChange("visible")
	public void ok() {
		QueueMessage message = new QueueMessage(QueueMessage.Type.OK, calendarItem);
		QueueUtil.lookupQueue().publish(message);
		this.visible = false;
	}

	private class QueueListener implements EventListener<QueueMessage> {
		@Override
		public void onEvent(QueueMessage message)
				throws Exception {
			if (QueueMessage.Type.EDIT.equals(message.getType())) {
				CalendarEditorViewModel.this.startEditing((SimpleCalendarItem) message.getData());
			}
		}
	}
}
