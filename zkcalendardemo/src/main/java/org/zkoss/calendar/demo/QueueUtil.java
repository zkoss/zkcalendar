package org.zkoss.calendar.demo;

import org.zkoss.zk.ui.event.*;

public class QueueUtil {
	public static final String QUEUE_NAME = "calendarEvent";
	
	//look up the desktop queue to communicate with another ui controller
	public static EventQueue<QueueMessage> lookupQueue(){
		EventQueue<QueueMessage> queue = 
				EventQueues.lookup(QUEUE_NAME, EventQueues.DESKTOP, true);
		return queue;
	}
}
