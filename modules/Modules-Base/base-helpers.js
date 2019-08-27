/*  Helper Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/
WDTasker.modules.base = {};

// Natively like a user opens iframe. This allows you to use WordPress Native functions
WDTasker.modules.base.ajaxCallIframe = function(actionName, logSuccess, options){
    var thisLog = WDTasker.console.loading();
    jQuery.post(ajaxurl, { action : actionName, options: options}, function(data) {
        var iFrameObj = document.createElement('IFRAME');
        jQuery(iFrameObj).css("display", "none");
        iFrameObj.id = "wdtr-modules-wordpress";
        iFrameObj.src = data;
        jQuery('body').append(iFrameObj);
        jQuery(iFrameObj).load( function () {
            jQuery("#wdtr-modules-wordpress").replaceWith("");
            WDTasker.console.replace(thisLog, logSuccess);
            WDTasker.nextTask(); 
        });
    });
}

// Fire a Generic Ajax Call that returns custom console text
WDTasker.modules.base.ajaxCall = function(actionName, options){
    var thisLog = WDTasker.console.loading();
    jQuery.post(ajaxurl, { action : actionName, options: options}, function(data) {
        data = JSON.parse(data);
        console.log(data);
        WDTasker.console.replace(thisLog, data.message);
        WDTasker.taskVar.current.setValue(WDTasker.taskVar.current.key, data.returnData);
        WDTasker.nextTask(); 
    });
}
