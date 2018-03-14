<%@ taglib uri="http://www.zkoss.org/dsp/web/core" prefix="c" %>
<%@ taglib uri="http://www.zkoss.org/dsp/zk/core" prefix="z" %>
${z:setCSSCacheControl()}
.z-calendars-header .z-toolbar {
	padding: 4px 4px 3px 0;
}
.z-toolbar-start {
	width: 100%;
}
.float-left {
	float: left;
}
.float-right {
	float: right;
	padding-right: 10px;
	position: relative;
	top: 3px;
}
.refresh,
.refresh .z-toolbarbutton-content {
	background: none !important;
	text-decoration: underline !important;
	border: 0 !important;
	color: blue !important;
}
.z-combobox-input {
	font-weight: bold;
}
.default .z-combobox-input {
	color: #D96666;
}
.red .z-combobox-input {
	color: #D96666;
}
.blue .z-combobox-input {
	color: #668CD9;
}
.green .z-combobox-input {
	color: #4CB052;
}
.khaki .z-combobox-input {
	color: #BFBF4D;
}
.purple .z-combobox-input {
	color: #B373B3;
}
.red.z-comboitem,
.blue.z-comboitem,
.green.z-comboitem,
.khaki.z-comboitem,
.purple.z-comboitem {
	color: #FFFFFF;
}
.red.z-comboitem {
	background: #D96666!important;
}
.blue.z-comboitem {
	background: #668CD9!important;
}
.green.z-comboitem {
	background: #4CB052!important;
}
.khaki.z-comboitem {
	background: #BFBF4D!important;
}
.purple.z-comboitem {
	background: #B373B3!important;
}
.intro {
	font-family: verdana,arial,helvetica,sans-serif;
	color: #0F3B82;
	font-size: 18px;
	margin: auto;
	padding: 5px;
	line-height: normal;
}
.arrowbutton {
	background: #CCE5F4;
	border: 1px solid #7EAAC6;
	color: #0F3B82;
}
.viewbutton {
	border: 1px solid #7EAAC6;
	border-bottom: none;
	border-radius: 4px 4px 0 0;
	color: #0F3B82;
	font-weight: bold;
	line-height: normal;
	background: -ms-linear-gradient(top, #f1fcff 0%,#f1fcff 30%, #B5D5E9 31%, #B5D5E9 39%, #c3e0f2 40%, #c3e0f2 100%); /* IE10+ */
	background: linear-gradient(to bottom, #f1fcff 0%,#f1fcff 30%, #B5D5E9 31%, #B5D5E9 39%, #c3e0f2 40%, #c3e0f2 100%); /* W3C */
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f1fcff', endColorstr='#c3e0f2', GradientType=0); /* IE6-9 */
}