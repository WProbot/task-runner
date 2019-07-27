/* Web Disrupt Tasker base properties */
var WDTasker = {};
WDTasker.modules = {};
WDTasker.modulesList = [];
WDTasker.taskBuilderProperties = [];
WDTasker.moduleActionList = {};
WDTasker.editor = {};

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
WDTasker.getModuleTasks = function(moduleName){
   return WDTasker.moduleActionList[moduleName];
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

/* Editor */
// Tasker Builder
WDTasker.editor.taskerBuilderLoad = function(){
    //console.log(WDTasker.getModules(), WDTasker.getModuleTasks('plugin'));
    let data = WDTasker.getModules();
    jQuery("#wdtr-select2-modules").select2({data : data});
    jQuery("#wdtr-select2-task").select2({ data : WDTasker.getModuleTasks('plugin')});
    jQuery("#wdtr-select2-modules").change(function(){ // Refreshes Action List
        jQuery("#wdtr-select2-task").select2({ data : WDTasker.getModuleTasks(jQuery("#wdtr-select2-modules").val())});
    });
    jQuery("#wdtr-select2-task").change(function(){ // Rebuilds Properties View
        jQuery("#wdtr-load-custom-properties").html(WDTasker.modules.drawTaskBuilderProperties(WDTasker.modules[jQuery("#wdtr-select2-modules").val()][jQuery("#wdtr-select2-task").val()].get()));
    });
    // Build Initial property view
    jQuery("#wdtr-load-custom-properties").html(WDTasker.modules.drawTaskBuilderProperties(['plugin_id']));
}

// Get WDTasker Modules propeties

WDTasker.modules.getTaskBuilderProperty

// Create New Tasker
WDTasker.editor.createTasker = function(value){
    let data = {};
    data.name = value.trim().replace(/ /g, "-");
    data.file = "---\r\nName: "+value+"\r\nVersion: 1.0.0\r\nDescription: What is the end result.\r\n---";
    jQuery.post(ajaxurl, { action : 'task_runner_editor_save_tasker', data: data}, function(data) {
        WDTasker.editor.drawLibrary("");
    });
}
// Save Tasker
WDTasker.editor.saveTasker = function(file){
    let data = {};
    data.name = WDTasker.helpers.getName(file);
    data.file = file;
    jQuery.post(ajaxurl, { action : 'task_runner_editor_save_tasker', data: data}, function(data) {
        WDTasker.editor.drawLibrary("");
    });
}
// Delete Tasker
WDTasker.editor.deleteTasker = function(file){
   jQuery.post(ajaxurl, { action : 'task_runner_editor_delete_tasker', name: WDTasker.helpers.getName(file)}, function(data) {
        WDTasker.editor.drawLibrary("");
        jQuery("#wdtr-editor-modal-container").hide();
   });
}
// Draw Library tiles
WDTasker.editor.drawLibrary = function(filter){
    jQuery.post(ajaxurl, { action : 'task_runner_editor_load_library', data: filter}, function(data) {
        data = JSON.parse(data);
        let libraryHtml = "";
        for (i=0; i < data.length; i++) {
            let libraryData = ((data[i].split("---"))[1]).trim().replace(/\r?\n/g, ":").split(":");          
            let item = [];
            for (x=0; x < libraryData.length; x+=2) { 
                item[libraryData[x].trim().toLowerCase()] = libraryData[x+1];
            }
                libraryHtml += "<div data-tasks='"+data[i]+"' class='wdtr-library-item'>";
                libraryHtml += "<h2>"+item.name+"</h2>";
                libraryHtml += "<div class='wdtr-library-version'>"+item.version+"</div>";
                libraryHtml += "<div class='wdtr-library-description'>" + item.description + "</div>";
                libraryHtml += "<div class='wdtr-library-action-bar'>";
                libraryHtml += "<button class='wdtr-library-action-run'> Run </button>";
                libraryHtml += "<button class='wdtr-library-action-edit'> Edit </button>";
                libraryHtml += "</div>";
                libraryHtml += "</div>";
        }
        // Draw Library
        jQuery("#wdtr-library-container").html(libraryHtml);
        // Add actions
        jQuery(".wdtr-library-action-run").click(function(){ // Run
            jQuery("#wdtr-editor-modal-container").show(); 
            WDTasker.editor.instance.setValue(jQuery(this).parent().parent().attr('data-tasks'));
            WDTasker.editor.instance.clearSelection();
            WDTasker.setTasks(WDTasker.editor.instance.getValue());
            WDTasker.runTasks();        
        });    
        jQuery(".wdtr-library-action-edit").click(function(){ // Edit
            jQuery("#wdtr-editor-modal-container").show(); 
            WDTasker.editor.instance.setValue(jQuery(this).parent().parent().attr('data-tasks'));
            WDTasker.editor.instance.clearSelection(); 
        });  
    });
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
    if(WDTasker.currentTask < WDTasker.totalTasks && WDTasker.currentTask >= 0 ) { // Check if task exists
        if(WDTasker.tasks[WDTasker.currentTask].trim().substring(0, 1) == "#" || WDTasker.tasks[WDTasker.currentTask].length < 5){ // Bypass task if its a comment
            setTimeout(() => {
                WDTasker.console.comment(WDTasker.tasks[WDTasker.currentTask]);
                WDTasker.nextTask();
                return;              
            }, 500);
        } else {
            let thisTask = WDTasker.tasks[WDTasker.currentTask].split(" ");
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
    } 
}


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

// Write log based om type
WDTasker.console.writeLog = function(logType, message){
    let guid = WDTasker.helpers.guid();
    jQuery(".wdtr-console-window").append("<div id='"+guid+"' class='wdtr-"+logType+"'>"+message+"</div>");
    return guid;
}

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