/*  Variables Module Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.taskVar = {};

// All variables that are availble during the running of a task block
WDTasker.taskVar.data = {};
// Adds new variables to taskVar.data object - Key may contain no spaces or dashes
WDTasker.taskVar.AddValue = function(key, value){
    WDTasker.taskVar.data[key] = value;
}
// Current Var that is assigned to capture this tasks return value
WDTasker.taskVar.current = {};
// Bind value back to persistent data - Key may contain no spaces or dashes
WDTasker.taskVar.current.setValue = function(key, value){
    WDTasker.taskVar.current.key = key;
    WDTasker.taskVar.current.value = value;
    WDTasker.taskVar.data[key] = value;
}
// Clear current taskVar to prevent spillover into other tasks
WDTasker.taskVar.current.clearValue = function(){
    WDTasker.taskVar.current.key = "";
    WDTasker.taskVar.current.value = "";
}