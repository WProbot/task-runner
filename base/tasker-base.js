/* Web Disrupt Tasker base properties */
var WDTasker = {};
WDTasker.modules = {};
WDTasker.modulesList = [];
WDTasker.taskBuilderProperties = [];
WDTasker.moduleActionList = {};

// Register new module functins
WDTasker.registerModule = function(moduleName, tasks){
    WDTasker.modulesList.push(moduleName);
    WDTasker.moduleActionList[moduleName] = tasks;
}

// Get modules names only
WDTasker.getModules = function(){
   return WDTasker.modulesList;
}

// Get modules names only
WDTasker.getModuleHighlightedText = function(){
    let highlightedList = "";
    let highlightedArray = WDTasker.modulesList;
    let highlightedTotal = highlightedArray.length;
    // Loop through actions and add to the modules array 
    for (let i = 0; i < highlightedTotal; i++) {
        highlightedArray = jQuery.merge(highlightedArray, WDTasker.moduleActionList[highlightedArray[i]]);
    }
    for (let i = 0; i < highlightedArray.length; i++) {
        highlightedList += highlightedArray[i];
        if(i != (highlightedArray.length - 1)) { highlightedList += "|"; }
    }
    return highlightedList;
 }

// Get modules names only
WDTasker.getModuleTasks = function(moduleName){
   return WDTasker.moduleActionList[moduleName.replace(/-/g, "_")];
}
// Add module Property type
WDTasker.modules.addTaskBuilderProperty = function(propId, propObject){
    WDTasker.taskBuilderProperties[propId] = propObject;
}

WDTasker.modules.drawTaskBuilderProperties = function(properties){
    let propHtml = "";
    for (let i = 0; i < properties.length; i++) {
        let prop = WDTasker.taskBuilderProperties[properties[i]];
        propHtml += "<div>"+prop.label+"</div>"+
        "<input type='text' class='wdtr-tb-property' placeholder='"+prop.placeholder+"' />"+
        "<div class='wdtr-desc'>" + prop.description + "</div>";
    }
    return propHtml;
}

/* Import a single or list of commands and decypher them into a task list */
WDTasker.setTasks = function(tasks){

    WDTasker.tasksSource = tasks.trim().split("---");
    WDTasker.tasksHeader = ((WDTasker.tasksSource[1].split(":"))[1]).replace("Version", "").trim();
    WDTasker.tasksSource = WDTasker.tasksSource[WDTasker.tasksSource.length - 1].trim();
    WDTasker.tasks = [];
    WDTasker.currentTask = 0;
    WDTasker.totalTasks = 0;
    WDTasker.isSplit = false;

    /* Split mutiline commands into multiple tasks */
    if(WDTasker.tasksSource.indexOf("\r\n") != -1 && WDTasker.isSplit == false){
        WDTasker.tasks = WDTasker.tasksSource.split("\r\n");
        WDTasker.isSplit = true;
    }
    if(WDTasker.tasksSource.indexOf("\n") != -1 && WDTasker.isSplit == false){
        WDTasker.tasks = WDTasker.tasksSource.split("\n");
        WDTasker.isSplit = true;
    }
    if(WDTasker.isSplit == false){
        WDTasker.tasks.push(WDTasker.tasksSource.trim());
    }
    // Remove extra spaces around a task
    if(WDTasker.tasks.length > 1){
        for (let i = 0; i < WDTasker.tasks.length; i++) {
            if(WDTasker.tasks[i].substring(0,2) == "\t"){ 
                // If in block
                WDTasker.tasks[i] = WDTasker.tasks[i].trimEnd(); 
            } else { 
                // if not in block
                WDTasker.tasks[i] = WDTasker.tasks[i].trim();                
            }
        }
    }

    WDTasker.totalTasks = WDTasker.tasks.length;
}

/* Start Task Runner */
WDTasker.runTasks = function(){
    jQuery("#wdtr-editor-window, #wdtr-editor-view-console").hide();
    jQuery(".wdtr-console-window, #wdtr-editor-view-editor").show();
    WDTasker.console.success("Tasks Started " + WDTasker.tasksHeader + " --------------------- ");
    WDTasker.currentTask = 0;
    WDTasker.updateProgressBar();
    WDTasker.runTask();      
}

/* Run Previous Task */
WDTasker.previousTask = function(){
    WDTasker.currentTask -= 1;
    WDTasker.updateProgressBar();
    WDTasker.runTask();      
}

/* Start running next task */
WDTasker.nextTask = function(){
    WDTasker.currentTask += 1;
    WDTasker.updateProgressBar();
    WDTasker.runTask();  
    if(WDTasker.currentTask == WDTasker.totalTasks) {
        WDTasker.console.success("Tasks Completed " + WDTasker.tasksHeader + " --------------------- ");
        WDTasker.currentTask = 0;
    }  
}

/* Resize Progress bar */ 
WDTasker.updateProgressBar = function(){                      
    WDTasker.ProgressBar = jQuery('.wdtr-progress-percentage');
    WDTasker.ProgressBar.width((WDTasker.ProgressBar.parent().width() * WDTasker.getProgress()) + "px" );
}

/* Returns the current progress */
WDTasker.getProgress = function(){
    return (WDTasker.currentTask) / WDTasker.tasks.length;
}

/* Run Task - Call the correct module function and pass parameters */
WDTasker.runTask = function(){
    // Check if task exists
    if(WDTasker.currentTask < WDTasker.totalTasks && WDTasker.currentTask >= 0 ) {

        let thisTask = WDTasker.tasks[WDTasker.currentTask].trim();

        // *** #1 => Bypass task if it is a comment or empty
        if(thisTask.substring(0, 1) == "#" || thisTask.length === 0){
            WDTasker.nextTask();
            return;
        } 

        // *** #2 => if conditional statement or conditional block active
        if(thisTask.substring(0, 2) === "if"  || thisTask.substring(0, 7) === "else if"){

            // Reset conditionals
            let inConditionalExecuteBlock = false;
            WDTasker.logicEngine.inConditionalSkipBlock = false;

            conditions = thisTask.replace("if ", "").replace("else if ", "").replace("else ", "");
            conditions = conditions.split("or");
            for(i=0; i < conditions.length; i++){  // Loop through OR opperator - only one set must be true
                let currentConditions = conditions[i].split("and");
                let condtionsCorrect = 0;
                for (let x = 0; x < currentConditions.length; x++) { // Loop through and opperator - All must be true
                    if(WDTasker.logicEngine.evaluate(currentConditions[x].trim())){
                        condtionsCorrect += 1;
                    }
                    if(i == (currentConditions.length - 1)){
                        if(condtionsCorrect == currentConditions.length){
                            inConditionalExecuteBlock = true;
                        }
                    }
                }
            }
            // If execute block is false then it must be a skip block
            if(inConditionalExecuteBlock == false){
                WDTasker.logicEngine.inConditionalSkipBlock = true;
                WDTasker.logicEngine.conditionalTracker.push(false);
            } else {
                WDTasker.logicEngine.conditionalTracker.push(true);
            }
            WDTasker.nextTask();
            return;
        }

        // *** #4 => endif which ends all
        if (thisTask.substring(0, 4) === "else"){
            let isTrue = false;
            // Loop through existing conditionals and make sure there arent any true statements
            for (let i = 0; i < WDTasker.logicEngine.conditionalTracker.length; i++) {
                if(WDTasker.logicEngine.conditionalTracker[i] == true){
                    isTrue = true;
                }   
            }
            // If any block has executed true
            if(isTrue == true){
                WDTasker.logicEngine.inConditionalSkipBlock = true;
            } else {
                WDTasker.logicEngine.inConditionalSkipBlock = false;
            }
            WDTasker.nextTask();
            return;
        }

        // *** #5 => endif which ends all
        if(thisTask.substring(0, 5) === "endif"){
            WDTasker.logicEngine.inConditionalSkipBlock = false;
            WDTasker.logicEngine.conditionalTracker = [];
            WDTasker.nextTask();
            return;
        }

        // *** #7 => If skip block move to next task
        if (WDTasker.logicEngine.inConditionalSkipBlock == true) {
            WDTasker.nextTask();
            return;
        }

        // *** #6 => execution block and Run Task as normal as long as coditional skip is false
        if (WDTasker.logicEngine.inConditionalSkipBlock == false){
            WDTasker.executeTask(thisTask);
            return;
        }
    
    }   
} 

WDTasker.executeTask = function(thisTask){

    thisTask = thisTask.split(" ");
    let moduleName = thisTask[0].replace(/-/g, "_");
    let moduleAction = thisTask[1].replace(/-/g, "_");
    let moduleProperties = [];
    for (let x = 2; x < thisTask.length; x++) { // loop through properties
        let prop = "";
        if(thisTask[x].indexOf('"') != -1){ // Check for Strings
            prop += thisTask[x]+" ";
            let foundStringEnd = false;
            for (let y = x+1; y < thisTask.length; y++) { // loop and concat any strings
                if(!foundStringEnd){ prop += thisTask[y] + " "; }
                if(!foundStringEnd && thisTask[y].indexOf('"') != -1){
                    foundStringEnd = true;
                    x = y;
                }
            }
            prop = prop.replace( /"/g, "").trim();
        } else { // If not a string
            prop += thisTask[x];
        }
        moduleProperties.push(prop);   
    }

    /* Call module function which executes task */
    WDTasker.modules[moduleName][moduleAction].run(moduleProperties);

}
