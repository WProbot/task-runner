/*  Logine Engine Module Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.logicEngine = {};

/* logical variables that control tasker logical conditions */
WDTasker.logicEngine.inConditionalSkipBlock = false;
WDTasker.logicEngine.conditionalTracker = [];
WDTasker.logicEngine.conditionFuntions = function(){ return "isSSL"; } // delimited by !
WDTasker.logicEngine.evaluate = function(condition){
    switch(condition){
        case "true":
            return true;
        break;
        case "false":
            return false;
        break;
        case "isSSL":
            if(location.protocol.indexOf("https:") != -1){
                return true;
            }  else { return false; }
        break;
        default:
            return false;
        break;
    }
}