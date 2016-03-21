/************************************************************************************
  This is your background code.
  For more information please visit our wiki site:
  http://docs.crossrider.com/#!/guide/scopes_background
*************************************************************************************/

appAPI.ready(function() {
    // Add the icon from the Resources folder
    // See the note following this code.
    appAPI.browserAction.setResourceIcon('icon.png');

    // Add a semi-transparent badge
    //
    // NOTE: Call the setBadgeUpdate method again to update the badge
    // appAPI.browserAction.setBadgeText('extn', [255,0,0,125]);

    // Add a tooltip
    appAPI.browserAction.setTitle('More about Form-Matic');

    // And most importantly, add the click action
    appAPI.browserAction.onClick(function() {
        //e.g. Open a page in a new tab
        appAPI.openURL("http://glasnost.itcarlow.ie/~jen/", "tab");
    });
});
