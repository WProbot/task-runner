/*  Helper Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

// Helper Library
WDTasker.helpers = {};
WDTasker.helpers.guid =  function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
WDTasker.helpers.getName = function(file){
    return ((((file.split("Name:"))[1]).split(/\r?\n/))[0]).trim().replace(/ /g, "-");
}