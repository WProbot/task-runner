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
// Check to build string
WDTasker.helpers.filterCheckString =  function (thisTask, filterParam) {
  if(thisTask.indexOf(filterParam) != -1){ // Check for Strings
    return true;
  } else { return false; }
}
// Build String
WDTasker.helpers.filterBuildString =  function (theseTasks, x, filterParam) {
  let prop = "";
  // If single word
  if(theseTasks[x].match(new RegExp(filterParam,"gi")).length == 2){
    prop = theseTasks[x];
    let foundStringEnd = true;
  // else multi word
  } else {
    prop = theseTasks[x]+" ";
    let foundStringEnd = false;
    for (let y = x+1; y < theseTasks.length; y++) { // loop and concat any strings
      if(!foundStringEnd){ prop += theseTasks[y] + " "; }
      if(!foundStringEnd && theseTasks[y].indexOf(filterParam) != -1){
          foundStringEnd = true;
          x = y;
      }
    } 
  }
  let regEx = new RegExp(filterParam, "g");
  return { newIndex : x, prop : prop.replace(regEx, "").trim() };
}




