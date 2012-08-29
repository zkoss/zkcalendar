/* calendars-touch.js

	Purpose:
		
	Description:
		
	History:
		Tue, August 28, 2012 10:25:27 AM, Created by jimmy shiau

Copyright (C) 2012 Potix Corporation. All Rights Reserved.
*/
(function () {
	var _xCalendars = {};
	zk.override(calendar.Calendars.prototype, _xCalendars, {
		setMold: function(mold) {
			this._mold = mold;
		}
	});
})();