/**
 * for ZKCAL-71
 * make the calendar pop up in the center of the page
 * based on zk calendar 2.1.4
 */
zk.afterLoad('calendar', function() {
    var exWidget = {};
    zk.override(calendar.CalendarsMonth.prototype, exWidget, {
        onMoreClick: function(event) {
            exWidget.onMoreClick.apply(this, arguments);
            var widget = zk.Widget.$(event.target);
            var $calendarPopup = jq('#'+widget.uuid+'-pp');
            $calendarPopup.css('left', '50%');
            $calendarPopup.css('top', '50%');
            $calendarPopup.css('margin-left', -$calendarPopup.outerWidth()/2+'px');
            $calendarPopup.css('margin-top', -$calendarPopup.outerHeight()/2+'px');
        },
    });
});
       
