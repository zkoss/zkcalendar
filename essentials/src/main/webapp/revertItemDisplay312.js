/**
 * Purpose: this js reverts the item display back to the format in 3.1.2 because 3.2.0 changes the item display format.
 * See https://tracker.zkoss.org/browse/ZKCAL-94
 * Based on version: 3.2.0
 */
zk.afterLoad('calendar', function() {
    let exDayItem = {};
    zk.override(calendar.DayItem.prototype, exDayItem, {
		getHeader: function(){
            var bd = this.item.zoneBd,
                ed = this.item.zoneEd;
            return this.item.title ? this.item.title : (ed - bd < (7200000 / this.parent._timeslots)) ?
                (zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + this.item.content) :
                (zk.fmt.Date.formatDate(bd,'HH:mm') + ' - ' + zk.fmt.Date.formatDate(ed,'HH:mm'));
		},
    });

    let exLongItem = {};
    zk.override(calendar.LongItem.prototype, exLongItem, {
        getHeader: function(){
            return this.item.content;
        },
    });

    let exDaylongOfMonthItem = {};
    zk.override(calendar.DaylongOfMonthItem.prototype, exDaylongOfMonthItem, {
        getHeader: function(){
            return this.item.content;
        },
    });

    let exDayOfMonthItem = {};
    zk.override(calendar.DayOfMonthItem.prototype, exDayOfMonthItem, {
        getHeader: function(){
            return `${this.item.title} - ${zk.fmt.Date.formatDate(this.item.zoneBd,'HH:mm')} ${this.item.content}`;
        },
    });
});