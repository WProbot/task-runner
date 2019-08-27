/*  Console Base Module Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.registerModule("console", ["success", "comment", "log", "error"]);
WDTasker.modules.console = {};

// Log
WDTasker.modules.console.log = {};
WDTasker.modules.console.log.run = function(options){
    WDTasker.console.log(options[0]);
    WDTasker.nextTask(); 
}
WDTasker.modules.console.log.get = function(){
    return ['console_log_message'];
}

// Log comment
WDTasker.modules.console.comment = {};
WDTasker.modules.console.comment.run = function(options){
    WDTasker.console.comment(options[0]);
    WDTasker.nextTask();
}
WDTasker.modules.console.comment.get = function(){
    return ['console_log_message'];
}

// Log success
WDTasker.modules.console.success = {};
WDTasker.modules.console.success.run = function(options){
    WDTasker.console.success(options[0]);
    WDTasker.nextTask(); 
}
WDTasker.modules.console.success.get = function(){
    return ['console_log_message'];
}

// Log error
WDTasker.modules.console.error = {};
WDTasker.modules.console.error.run = function(options){
    WDTasker.console.error(options[0]);
    WDTasker.nextTask(); 
}
WDTasker.modules.console.error.get = function(){
    return ['console_log_message'];
}

// Add message to the log
WDTasker.modules.addTaskBuilderProperty('console_log_message',
{ 
    label : "Log Message",
    type : "input",
    placeholder : "A personalized message to log to the console",
    description : "log messages to the console."
}
);