/* Web Disrupt Tasker base properties */
var WDTasker = {};
WDTasker.modules = {};
WDTasker.modulesList = [];
WDTasker.modulePlusActionList = [];
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
    let moduleNameList = "";
    for (let i = 0; i < WDTasker.modulesList.length; i++) {
        moduleNameList += WDTasker.modulesList[i];
        if(i != (WDTasker.modulesList.length - 1)) { moduleNameList += "|"; }
    }
    return moduleNameList;
 }

// Get action names only
WDTasker.getActionHighlightedText = function(){
        let highlightedList = "";
        let highlightedArray = [];
        let highlightedTotal = WDTasker.modulesList.length;
        // Loop through actions and add to the modules array 
        for (let i = 0; i < highlightedTotal; i++) {
           if(typeof WDTasker.moduleActionList[WDTasker.modulesList[i]] !== 'undefined'){
            let actionsList = WDTasker.moduleActionList[WDTasker.modulesList[i]];
            for (let x = 0; x < actionsList.length; x++) {
                highlightedArray.push(WDTasker.modulesList[i] + " " + actionsList[x]);      
            }
           }
        }
        highlightedArray = highlightedArray.sort(function(a, b) {
            return b.length - a.length ||
                   b.localeCompare(a);  
        });
        WDTasker.modulePlusActionList = highlightedArray;
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
    WDTasker.tasksSource = tasks.replace("---"+WDTasker.tasksSource[1]+"---", "").trim();
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
            // if not in block
            WDTasker.tasks[i] = WDTasker.tasks[i].trim();
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

        // *** #2 Replace variables with value    
        let variables = Object.keys(WDTasker.taskVar.data);
        for (let i = 0; i < variables.length; i++) {  
            let regEx = new RegExp('{{'+variables[i]+'}}', 'g')         
            thisTask = thisTask.replace(regEx, WDTasker.taskVar.data[variables[i]]);
        }

        // *** #3 Check if variables assigned
        if(thisTask.substring(0, 4) == "var "){
            thisTask = thisTask.replace("var ", "");
            let thisValue = thisTask.substring(thisTask.indexOf('=')+1).trim();
            if(thisValue.substring(0, 1) === '"' || thisValue.substring(0, 1) === "'" || thisValue.substring(0, 1) === '`'){
                thisValue = thisValue.substring(1, thisValue.length-1).trim();
            }
            let thisKey = thisTask.substring(thisTask.indexOf('=')-1, 0).replace( "=", "").trim();
            WDTasker.taskVar.current.setValue(thisKey, thisValue);
            // If module and function don't exist then you can skip to next task because var value has been assigned
            isNotFunction = true;
            for (let i = 0; i < WDTasker.modulePlusActionList.length; i++) {
                if(thisValue.indexOf(WDTasker.modulePlusActionList[i]) != -1){
                    isNotFunction = false;
                } 
            }
            // Only fire if not a function
            if(isNotFunction){
                WDTasker.taskVar.current.clearValue();
                WDTasker.nextTask();
                return;
            }
            thisTask = thisValue.trim(); // Remove variable assignment and proceed with nomal task operations
        }

        // *** #4 => if conditional statement or conditional block active
        if(thisTask.substring(0, 2) === "if" || thisTask.substring(0, 7) === "else if"){

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

        // *** #5 => check else block
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

        // *** #6 => endif which ends all
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

        // *** #8 => execution block and Run Task as normal as long as coditional skip is false
        if (WDTasker.logicEngine.inConditionalSkipBlock == false){
            WDTasker.executeTask(thisTask);
            return;
        }
    
    }   
} 

WDTasker.executeTask = function(thisTask){

    thisTask = thisTask.split(" ");
    let moduleName = thisTask[0];
    let moduleAction = thisTask[1];
    let moduleProperties = [];
    for (let x = 2; x < thisTask.length; x++) { // loop through properties
        let prop = "";

        // Check for string building options
        if(WDTasker.helpers.filterCheckString(thisTask[x], '"')){
            let propObject = WDTasker.helpers.filterBuildString(thisTask, x, '"');
            prop = propObject.prop;
            x = propObject.newIndex;
        } else if (WDTasker.helpers.filterCheckString(thisTask[x], "'")){
            let propObject = WDTasker.helpers.filterBuildString(thisTask, x, "'");
            prop = propObject.prop;
            x = propObject.newIndex;
        } else if (WDTasker.helpers.filterCheckString(thisTask[x], '`')){
            let propObject = WDTasker.helpers.filterBuildString(thisTask, x, '`');
            prop = propObject.prop;
            x = propObject.newIndex;
        } else { // If not a string
            prop = thisTask[x];
        }

        moduleProperties.push(prop);   
    }

    /* Call module function which executes task */
    if(moduleName.length && moduleAction.length){
        WDTasker.modules[moduleName][moduleAction].run(moduleProperties);
    }

}
