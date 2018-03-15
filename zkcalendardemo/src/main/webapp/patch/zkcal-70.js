/**
 * for ZKCAL-70
 * based on 2.1.5
 */
zk.afterLoad('calendar', function() {
    var oldWidget = {};
    zk.override(calendar.CalendarsDefault.prototype, oldWidget, {
        /* calculate time slot index according to an calendars event beginning time
        */
        getTimeIndex: function (date) {
            var timeslots = this._timeslots,
                timeslotTime = 60 / timeslots,
                index = (date.getHours() - this._bt) * timeslots +
                         Math.floor(date.getMinutes()/timeslotTime);
             var maxAvailableTimeslotIndex = (this._et - this._bt) * timeslots - 1; //user-defined available time could be fewer than 24 hours
            return Math.min(index, maxAvailableTimeslotIndex);
        },
    });
	
});