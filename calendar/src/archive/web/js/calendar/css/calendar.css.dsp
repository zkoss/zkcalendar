<%@ page contentType="text/css;charset=UTF-8" %>
<%@ taglib uri="http://www.zkoss.org/dsp/web/core" prefix="c" %>
<%@ taglib uri="http://www.zkoss.org/dsp/zk/core" prefix="z" %>
${z:setCWRCacheControl()}

<c:set var="val" value="${c:property('org.zkoss.zul.theme.fontSizeM')}"/>
<c:set var="fontSizeM" value="${val}" scope="request" unless="${empty val}"/>
<c:set var="val" value="${c:property('org.zkoss.zul.theme.fontSizeMS')}"/>
<c:set var="fontSizeMS" value="${val}" scope="request" unless="${empty val}"/>
<c:set var="val" value="${c:property('org.zkoss.zul.theme.fontSizeS')}"/>
<c:set var="fontSizeS" value="${val}" scope="request" unless="${empty val}"/>
<c:set var="val" value="${c:property('org.zkoss.zul.theme.fontSizeXS')}"/>
<c:set var="fontSizeXS" value="${val}" scope="request" unless="${empty val}"/>
<c:set var="val" value="${c:property('org.zkoss.zul.theme.fontFamilyT')}"/>
<c:set var="fontFamilyT" value="${val}" scope="request" unless="${empty val}"/>
<c:set var="val" value="${c:property('org.zkoss.zul.theme.fontFamilyC')}"/>
<c:set var="fontFamilyC" value="${val}" scope="request" unless="${empty val}"/>

<c:set var="fontSizeM" value="12px" scope="request" if="${empty fontSizeM}"/>
<c:set var="fontSizeMS" value="11px" scope="request" if="${empty fontSizeMS}"/>
<c:set var="fontSizeS" value="11px" scope="request" if="${empty fontSizeS}"/>
<c:set var="fontSizeXS" value="10px" scope="request" if="${empty fontSizeXS}"/>

<c:set var="fontFamilyT" value="Tahoma, Verdana, Arial, Helvetica, sans-serif"
	scope="request" if="${empty fontFamilyT}"/><%-- title --%>
<c:set var="fontFamilyC" value="Verdana, Tahoma, Arial, Helvetica, sans-serif"
	scope="request" if="${empty fontFamilyC}"/><%-- content --%>
	
<c:set var="mainColor" value="#CCE5F4"/>
<c:set var="mainBorderColor" value="#7EAAC6"/>
<c:set var="contentColor" value="#E2EEF5"/>
<c:set var="bodyColor" value="#EEF7FC"/>
<c:set var="separatorColor" value="#C9CBCC"/>
<c:set var="fontColor" value="#0F3B82"/>
<c:set var="todayColor" value="#E9E9B7"/>
<c:set var="todayContentColor" value="#F9F9C6"/>
<c:set var="dateFontColor" value="#44523F"/>

<c:set var="eventColor" value="#ACD5EE"/>
<c:set var="eventBorderColor" value="#7EAAC6"/>
.z-calendars {
	height: 100%;
}
.z-calendars-fl {
	background: transparent no-repeat 0 bottom;
	background-image: url(${c:encodeURL('~./img/shdlf.gif')});
	padding-left: 6px;
	zoom: 1;
}
.z-calendars-fr {
	background: transparent no-repeat right bottom;
	background-image: url(${c:encodeURL('~./img/shdrg.gif')});
	padding-right: 6px;
	zoom: 1;
}
.z-calendars-fm {
	background: transparent repeat-x 0 0;
	background-image: url(${c:encodeURL('~./img/shdmd.gif')});
	height: 6px;
	font-size: 0;
	line-height: 0;
	zoom: 1;
}

.z-calendars-header .z-toolbar {
	background: none;
	border: 0;
}
.z-calendars-body {
	background: ${mainBorderColor};
	zoom:1;
}
.z-calendars-inner {
	background: ${mainColor};
	padding-bottom: 5px;
	padding-left: 5px;
	margin: 0 1px;
	border-left: 1px solid white;
	border-right: 1px solid white;
}
.z-calendars-t1,
.z-calendars-t2,
.z-calendars-t3 {		
	background:${mainBorderColor};
	font-size: 0;
	line-height: 0;
	margin: 0 2px;
	height: 1px;
	padding: 0;
	overflow: hidden;
}
.z-calendars-t2 {
	margin: 0 1px;
}
.z-calendars-t3 {
	background: white;
	height:1px; margin: 0 1px;
}
.z-calendars-b1,
.z-calendars-b2,
.z-calendars-b3 {		
	background: ${mainBorderColor};
	font-size: 0;
	line-height: 0;
	margin: 0 2px;
	height: 1px;
	padding: 0;
	overflow: hidden;
}
.z-calendars-b2 {
	margin: 0 1px;
}
.z-calendars-b3 {
	background: white;
	height: 1px;
	margin: 0 1px;
}
<%-- Calchildren --%>
.z-calendars-week {
	position: relative;
	overflow: hidden;
	height: 300px;
}
.z-calendars-week-header {
	font-size: ${fontSizeMS};
	font-family: ${fontFamilyT};
}
.z-calendars-week-header-cnt {
	table-layout: fixed;
	width: 100%;
	overflow: hidden;
	line-height: 14px;
}
.z-calendars-day-of-week-inner {
	color: ${fontColor};
	margin-left: 4px;
	padding: 3px 2px 2px 3px;
	white-space: nowrap;
}
.z-calendars-day-of-week-end {
	width: 18px;
	padding: 0;
	margin: 0;
}
.z-calendars-daylong-body {
	background-color: ${contentColor};
	border-color: ${mainBorderColor} white white ${mainBorderColor};
	border-style: solid;
	border-width: 1px;
}
.z-calendars-daylong-cnt {
	position: relative;
	table-layout: fixed;
	width: 100%;
}
.z-calendars-daylong-evt {
	border-left: 3px solid ${separatorColor};
	padding: 1px 0 0 2px;
	vertical-align: top;
}
.z-calendars-daylong-end {
	height: 5px;
	font-size: 0;
	line-height: 0;
}
.z-calendars-daylong-more {
	padding-bottom: 2px;
}
.z-calendars-daylong-faker-more,
.z-calendars-evt-faker-more {
	text-decoration: underline;
	color: white;
	text-align: center;
	font-size: ${fontSizeMS};
	font-family: ${fontFamilyC};
	cursor: pointer;
	background: #61A0C9;
}
.z-calendars-evt-faker-more {
	color: #0F3B82;
	background: transparent;
}
.z-calendars-evt-faker-nomore {
	color: white;
}
.z-calendars-daylong-faker-nomore,
.z-calendars-evt-faker-nomore {
	background: none;
	cursor: default;
}
.ie .z-calendars-daylong-faker-nomore {
	color: #E2EEF5;
}
.z-calendars-week-body {
	border-color: white;
	border-style: solid;
	border-width: 1px;
	position: relative;
	overflow-x: hidden;
	overflow-y: scroll;
	padding: 0;
	margin: 0;	
	
}
.z-calendars-week-cnt {
	height: 1104px;
	padding: 0;
	margin: 0;
	background-color: ${bodyColor};
	table-layout: fixed;
	width: 100%;
}
.ie .z-calendars-week-cnt {
	margin-right: -17px;
}
.ie6 .z-calevent-inner dl {
	width: 100%;
}
.z-calendars-hour {
	position: relative;
	top: 1px;
	height: 1px;
}
.z-calendars-hour-inner {
	position: absolute;
	width: 100%;
}
.z-calendars-hour-sep {
	height: 22px;
	border-bottom: 1px dotted ${separatorColor};
	border-top: 1px solid ${separatorColor};
	line-height: 22px;
	margin-bottom: 22px;
	font-size: 22px;
}
.z-calendars-hour-of-day {
	height: 45px;
	padding-right: 2px;
	border-bottom: 1px solid ${separatorColor};
	color: ${fontColor};
	text-align: right;	
	font-size: ${fontSizeMS};
	font-family: ${fontFamilyC};
}
.z-calendars-day-of-week-inner.z-calendars-week-today {
	background-color: ${todayColor};
	border-color: #AAAA58 #F3F3C9 #F3F3C9 #AAAA58;
	border-style: solid;
	border-width: 1px;
	font-weight: bold;
	padding-top: 2px;
	padding-bottom: 1px;
	color: ${fontColor};
}
.z-calendars-week-day.z-calendars-week-today {
	background-color: ${todayContentColor};
}
.z-calendars-week-day {	
	border-left: 3px solid ${separatorColor};
	overflow: hidden;
	vertical-align: top;
}
.z-calendars-week-day-cnt {
	height: 1104px;
	margin-bottom: -1104px;
	margin-right: 12px;
	position: relative;
}
<%-- Calchildren Month View --%>
.z-calendars-day-over, z-calendars-month-day-over {
	cursor: pointer;	
	text-decoration: underline;
}
.z-calendars-month .z-calendars-inner {
	padding-right: 5px;
}
.z-calendars-month-cnt {
	overflow: hidden;
	height: 300px;
}
.z-calendars-month-cnt-inner {
	height: 100%;
	position: relative;
	white-space: nowrap;
}
.z-calendars-month-header {
	color: ${fontColor};
	position: absolute;
	top: 0;
	left: 0;
	table-layout: fixed;
	width: 100%;
	background-color: ${mainColor};
	line-height: 15px;
}
.z-calendars-month-header .z-calendars-day-of-week {
	color: ${fontColor};
	padding: 1px;
	font-size: ${fontSizeMS};
	font-family: ${fontFamilyT};
}
.z-calendars-month-body {
	overflow: hidden;
	position: absolute;
	top: 17px; <%-- according to .z-calendars-month-header's line-height --%>
	width: 100%;
	bottom: 0;
	left: 0;
	background-color: white;
}
.z-calendars-month-week {
	left: 0;
	overflow: hidden;
	position: absolute;
	width: 100%;
}
.z-calendars-day-of-month-bg {
	height: 100%;
	width: 100%;
	left: 0;
	top: 0;
	table-layout: fixed;
	position: absolute;
}
.z-calendars-day-of-month-bg td {
	border-left: 1px solid ${separatorColor};
}
.z-calendars-day-of-month-body {
	position: relative;
	table-layout: fixed;
	width: 100%;
}
.z-calendars-month-date {
	background-color: ${contentColor};
	border-left: 1px solid ${separatorColor};
	border-top: 1px solid ${separatorColor};
	color: ${dateFontColor};
	line-height: 16px;
	overflow: hidden;
	padding-right: 2px;
	text-align: right;
	font-size: ${fontSizeMS};
	font-family: ${fontFamilyC};
}
.z-calendars-month-date-evt {
	font-family: ${fontFamilyC};
	padding: 1px 1px 0 2px;
	vertical-align: top;
	line-height: 14px;
}
.z-calendars-month-date-off {
	background-color: #D4DCE1;
}
.z-calendars-month-date.z-calendars-week-today {
	background-color: ${todayColor};
}
.z-calendars-day-of-month-bg .z-calendars-week-today {
	background-color: ${todayContentColor};

}
<%-- Calendar Timezone --%>
.z-calendars-timezone {
	color: ${fontColor};
	width: 80px;
	overflow: hidden;
}
.z-calendars-day-header .z-calendars-timezone {
	text-align: center;
	vertical-align: bottom;
	padding-bottom: 3px;
	padding-right: 2px;
	font-weight: normal;
}
.z-calendars-week-cnt .z-calendars-timezone {
	background-color: ${contentColor};
	border-right: 1px solid ${separatorColor};
	color: ${fontColor};
	overflow: hidden;
	padding: 1px 1px 0 0;
	text-align: right:
	vertical-align: top;	
}
.z-calendars-week-cnt .z-calendars-timezone-end {
	border-right: 0;
	padding-right: 2px;
}
.z-calendars-week-header-arrow {
	border-top: 5px solid #888;
	border-left: 5px solid ${mainColor};
	border-right: 5px solid ${mainColor};
	border-bottom: 0;
	height: 0;
	width: 0;
	position: absolute;
	top: 25px;
	cursor: pointer;
	font-size: 0;
	line-height: 0;
}
.z-calendars-week-header-arrow-close {
	border-left: 5px solid #888;
	border-top: 5px solid ${mainColor};
	border-bottom: 5px solid ${mainColor};
	border-right: 0;
	top: 21px;
}
<%-- Calendar Event --%>
.z-calevent {
	color: white;
	overflow: hidden;
	cursor: pointer;
}

.z-calevent-body {
	background: ${eventBorderColor};
	zoom:1;
}
.z-calevent-inner {
	margin: 0 1px;
	border-left: 1px solid white;
	border-right: 1px solid white;
}
.z-calevent-inner dt,
.z-calevent-inner dd,
.z-calevent-inner dl {
	margin: 0;
	padding: 0;
	overflow: hidden;
	text-align: left;
}
.z-calevent-inner dl {
	background: ${eventColor};
}
.z-calevent-t1,
.z-calevent-t2,
.z-calevent-t3 {		
	background: ${eventBorderColor};
	font-size: 0;
	line-height: 0;
	margin: 0 2px;
	height: 1px;
	padding: 0;
	overflow: hidden;
}
.z-calevent-t2 {
	margin: 0 1px;
}
.z-calevent-t3 {
	background: white;
	height:1px; margin: 0 1px;
}
.z-calevent-b1,
.z-calevent-b2,
.z-calevent-b3 {		
	background: ${eventBorderColor};
	font-size: 0;
	line-height: 0;
	margin: 0 2px;
	height: 1px;
	padding: 0;
	overflow: hidden;
}
.z-calevent-b2 {
	margin: 0 1px;
}
.z-calevent-b3 {
	background: white;
	height: 1px;
	margin: 0 1px;
}
.z-calevent-header {
	background: ${eventBorderColor};
	font-size: 10px;
	font-family: ${fontFamilyT};
	font-weight: bold;
	line-height: 14px;
	color: white;
	white-space: nowrap;
}
.z-calevent-inner .z-calevent-cnt {
	background: ${eventColor};
	font-size: 11px;
	font-family: ${fontFamilyC};
	padding-left: 1px;
	padding-right: 1px;
	line-height: 14px;
	color: white;
}
.z-calevent-resizer {
	bottom: 2px;
	cursor: s-resize;
	height: 7px;
	line-height: 7px;
	position: absolute;
	width: 100%;
	left: 0;
}
.z-calevent-resizer-icon {
	border-top: 3px solid white;
	font-size: 0;
	line-height: 0;
	margin: 0 auto;
	width: 10px;	
}
.z-calendars-daylong-evt .z-calevent-inner .z-calevent-left-arrow,
.z-calevent-daylong-month .z-calevent-inner .z-calevent-left-arrow,
.z-calevent-left-more-faker .z-calevent-inner .z-calevent-left-arrow {
	padding-left: 10px;
	zoom: 1;
}
.z-calendars-daylong-evt .z-calevent-inner .z-calevent-right-arrow,
.z-calevent-daylong-month .z-calevent-inner .z-calevent-right-arrow,
.z-calevent-right-more-faker .z-calevent-inner .z-calevent-right-arrow {
	padding-right: 7px;
	zoom: 1;
}
.z-calendars-daylong-evt .z-calevent-text,
.z-calevent-daylong-month .z-calevent-text,
.z-calpp .z-calevent-text,
.z-calpp-month .z-calevent-text,
.z-calendars-evt-faker-dd .z-calevent-text {
	height: 14px;
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
}
.z-calevent-daylong-month .z-calevent-text {
	height: 13px;
}
.z-calevent-left-arrow-icon,
.z-calevent-right-arrow-icon {
	border-bottom: 4px solid ${eventColor};
	border-top: 4px solid ${eventColor};
	font-size: 0;
	height: 0;
	line-height: 0;
	margin-bottom: -8px;
	position: relative;
	top: 2px;
	width: 0;
}
.z-calevent-left-arrow-icon {
	border-right: 4px solid white;
	margin-left: -7px;
	margin-right: auto;
}
.z-calevent-right-arrow-icon {
	border-left: 4px solid white;
	margin-right: -5px;
	margin-left: auto;
}
.z-calendars-week-day-cnt .z-calevent {
	width: 100%;
	position: absolute;
}
.z-calendars-daylong-evt .z-calevent-cnt,
.z-calevent-daylong-month .z-calevent-cnt {
	padding: 1px 1px 1px 3px;
	white-space: nowrap;
	cursor: pointer;
	overflow: hidden;
}
.z-calevent-daylong-month .z-calevent-cnt {
	padding: 0 1px;
}

.z-calevent-daylong-month .z-calevent-t3,
.z-calevent-daylong-month .z-calevent-b3,
.z-calpp-month-evt-cnt .z-calevent-t3,
.z-calpp-month-evt-cnt .z-calevent-b3 {
	background: ${eventColor};
}

.z-calevent-daylong-month .z-calevent-inner,
.z-calpp-month-evt-cnt .z-calevent-inner {
	border-left-color: ${eventColor};
	border-right-color: ${eventColor};
}
.z-calevent-month {
	white-space: nowrap;
	zoom: 1;
	padding: 1px;
	line-height: 14px;
}
.z-calevent-month .z-calevent-header {
	background: transparent;
	color: ${eventBorderColor};
	font-size: ${fontSizeXS};
	font-family: ${fontFamilyT};
	white-space: nowrap;
}
.z-calevent-month .z-calevent-cnt {
	background: transparent;
	color: ${eventBorderColor};
	font-size: ${fontSizeMS};
	font-family: ${fontFamilyC};
	white-space: nowrap;
}
<%-- Calendar Popup --%>
.z-calpp,
.z-calpp-month {
	visibility: hidden;
	position: absolute;
	z-index: 28;<%-- less than zkau.initZIndex --%>
}

.z-calpp-body,
.z-calpp-month-body {
	background: #7f9db9;
	zoom:1;
}
.z-calpp-inner,
.z-calpp-month-inner {
	background: #e3f8fe;
	padding: 5px;
	margin: 0 1px;
	border-left: 1px solid #dae7f6;
	border-right: 1px solid #dae7f6;
}
.z-calpp-t1,
.z-calpp-t2,
.z-calpp-t3,
.z-calpp-month-t1,
.z-calpp-month-t2,
.z-calpp-month-t3 {		
	background: #7f9db9;
	font-size: 0;
	line-height: 0;
	margin: 0 2px;
	height: 1px;
	padding: 0;
	overflow: hidden;
}
.z-calpp-t2,
.z-calpp-month-t2 {
	margin: 0 1px;
}
.z-calpp-t3,
.z-calpp-month-t3 {
	background: #dae7f6;
	height:1px; margin: 0 1px;
}
.z-calpp-b1,
.z-calpp-b2,
.z-calpp-b3,
.z-calpp-month-b1,
.z-calpp-month-b2,
.z-calpp-month-b3 {		
	background: #7f9db9;
	font-size: 0;
	line-height: 0;
	margin: 0 2px;
	height: 1px;
	padding: 0;
	overflow: hidden;
}
.z-calpp-b2,
.z-calpp-month-b2 {
	margin: 0 1px;
}
.z-calpp-b3,
.z-calpp-month-b3 {
	background: #dae7f6;
	height: 1px;
	margin: 0 1px;
}
.z-calpp-evt-l,
.z-calpp-evt-r,
.z-calpp-month-evt-l,
.z-calpp-month-evt-r {
	padding-top: 1px;
	width: 20%;
	vertical-align: top;
}
.z-calpp-evt-m,
.z-calpp-month-evt-m {
	vertical-align: top;
	padding: 1px 2px 0;
}
.z-calpp-evt-cnt,
.z-calpp-month-evt-cnt {
	position: relative;
	table-layout: fixed;
	width: 100%;
}
.z-calpp-evt-faker,
.z-calpp-month-evt-faker,
.z-calevent-left-more-faker,
.z-calevent-right-more-faker {
	cursor: pointer;
}
.z-calpp-evt-faker .z-calevent-left-arrow-icon,
.z-calpp-evt-faker .z-calevent-right-arrow-icon,
.z-calpp-month-evt-faker .z-calevent-left-arrow-icon,
.z-calpp-month-evt-faker .z-calevent-right-arrow-icon {
	display: none;
}
.z-calpp-evt-faker .z-calevent-inner .z-calevent-left-arrow,
.z-calpp-evt-faker .z-calevent-inner .z-calevent-right-arrow,
.z-calpp-month-evt-faker .z-calevent-inner .z-calevent-left-arrow,
.z-calpp-month-evt-faker .z-calevent-inner .z-calevent-right-arrow {
	padding: 0 1px;
}
.z-calevent-left-more-faker .z-calevent-text {
	text-align: right;
}
.z-calevent-right-more-faker .z-calevent-text {
	text-align: left;
}
.z-calpp-month-header {
	line-height: 14px;
	overflow: hidden;
	padding: 1px;
	text-align: center;
}
.z-calpp-month-header-cnt {
	color: ${fontColor};
	padding: 1px;
	font-size: ${fontSizeMS};
	font-family: ${fontFamilyT};
	font-weight: bold;
	white-space: nowrap;
}
.z-calpp-month-cnt {
	border: 1px solid #5EA0DD;
	background: white;
	padding: 2px;
}
.z-calpp-month-close {
	background-repeat: no-repeat;
	background-image: url(${c:encodeURL('~./calendar/img/close-off.gif')});
	cursor: pointer;
	width: 17px;
	height: 16px;
	position: absolute;
	right: 10px;
	top: 5px;
	z-index: 15;
	opacity: .6;
	filter: alpha(opacity=60);
}

.z-calpp-month-close-over,
.z-calpp-month-close:hover {
	background-image: url(${c:encodeURL('~./calendar/img/close-on.gif')});
	opacity: 1.0;
	filter: alpha(opacity=100);
}

<%-- Drag and drop --%>
.z-calendars-month-dd {
	position: absolute;
	height: 0;
	left: 0;
	top: 0;
	left: 0;
	z-index: 28;<%-- less than zkau.initZIndex --%>
}
.z-calendars-dd-rope {
	position: absolute;
	background: #C3E7FF;
	line-height: 0;
	font-size: 0;
	opacity: 0.5;
	filter: alpha(opacity=50);
}
.z-calendars-evt-dd {
	opacity: 0.5;
	filter: alpha(opacity=50);
}
.ie7 .z-calendars-evt-dd .z-calevent-left-arrow-icon,
.ie7 .z-calendars-evt-dd .z-calevent-right-arrow-icon,
.opera .z-calendars-evt-dd .z-calevent-left-arrow-icon,
.opera .z-calendars-evt-dd .z-calevent-right-arrow-icon {
	border-bottom-color: transparent!important;
	border-top-color: transparent!important;
}
.z-calendars-evt-faker-dd {
	position: absolute;
	z-index: 12000;
}
.z-calendars-daylong-dd {
	position: absolute;
	height: 0;
	left: 0;
	top: 0;
	left: 0;
	z-index: 28;<%-- less than zkau.initZIndex --%>
}
.z-calendars-evt-faker-dd .z-calevent-inner .z-calevent-left-arrow {
	padding-left: 10px;
	zoom: 1;
}
.z-calendars-evt-faker-dd .z-calevent-inner .z-calevent-right-arrow {
	padding-right: 7px;
	zoom: 1;
}
.z-calendars-evt-ghost {
	opacity: 0.7;
	filter: alpha(opacity=70);
}
.z-calendars-week-of-year {
	position: absolute;
	overflow: hidden;
	width: 20px;
	top: 17px;
	left: 0;
	bottom: 0;
}
.z-calendars-week-of-year-text {
	color: ${fontColor};
	font-size: ${fontSizeMS};
	font-family: ${fontFamilyT};
	font-weight: bold;
	white-space: nowrap;
	cursor: pointer;	
	text-decoration: underline;
}