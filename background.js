/************************************************************************************
  Background Scope:
  Runs once in the browser's background and persists as long as the browser is running 
  
  Purpose:
  Manage background tasks such as handling browser buttons, context menus, tabs etc.

*************************************************************************************/
appAPI.ready(function() {
    
    var popupDims = {
		CH: {height: 65, width: 120}, // Chrome
		FF: {height: 65, width: 120}, // Firefox
		IE: {height: 70, width: 120}, // Internet Explorer
		SF: {height: 65, width: 120}  // Safari
	};
	
    // Sets the icon
    appAPI.browserAction.setResourceIcon('icon.png');
	
	if ("CHFFIESF".indexOf(appAPI.platform) !== -1) {
		appAPI.browserAction.setPopup({
			resourcePath:'popup.html',
			height:popupDims[appAPI.platform].height,
			width:popupDims[appAPI.platform].width
		});
	}
	else {
		alert('This extension is not supported on your browser');
	}

});
