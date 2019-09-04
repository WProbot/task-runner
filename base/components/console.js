/*  Base Console Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/


// Init Console
WDTasker.console = {};

// Create Loading
WDTasker.console.loading = function(){
    return WDTasker.console.writeLog("log", '<svg id="wdtr-console-loader" version="1.1" x="0" y="0" width="150px" height="150px" viewBox="-10 -10 120 120" enable-background="new 0 0 200 200" xml:space="preserve"> <path class="circle" d="M0,50 A50,50,0 1 1 100,50 A50,50,0 1 1 0,50" /></svg>');
}

// Create Standard Log
WDTasker.console.log = function(message){
    return WDTasker.console.writeLog("log", message);
}

// Create Standard Log comment
WDTasker.console.comment = function(message){
    return WDTasker.console.writeLog("comment", message);
}

// Create Error Log
WDTasker.console.error = function(message){
    return WDTasker.console.writeLog("error", message);
}

// Create Success Log
WDTasker.console.success = function(message){
    return WDTasker.console.writeLog("success", message);
}

// Replace Log with new value
WDTasker.console.replace = function(guid, message){
    if(message.indexOf("ERROR:") !== -1){ // Detect if error is thrown and change type
        jQuery("#"+guid).removeClass("wdtr-log").addClass('wdtr-error');
    }
    jQuery("#"+guid).html(message);
}

// Replace Log with new value
WDTasker.console.delete = function(guid){
    jQuery("#"+guid).replaceWith("");
}

// Write log based om type
WDTasker.console.writeLog = function(logType, message){
    let guid = WDTasker.helpers.guid();
    jQuery(".wdtr-console-window").append("<div id='"+guid+"' class='wdtr-"+logType+"'>"+message+"</div>");
    return guid;
}