/*  Base Editor Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.editor = {};

/* Editor */
// Tasker Builder
WDTasker.editor.taskerBuilderLoad = function(){
    
    // Build Initial module list
    jQuery("#wdtr-select2-modules").select2({data : WDTasker.getModules()});
    jQuery("#wdtr-select2-modules").val('plugin').change();
    jQuery("#wdtr-select2-task").select2({ data : WDTasker.getModuleTasks('plugin')});
    jQuery("#wdtr-select2-task").val('').change();

    // Fully Refreshes Action List
    jQuery("#wdtr-select2-modules").change(function(){
        jQuery("#wdtr-select2-task").replaceWith('<select  id="wdtr-select2-task" class="wdtr-select2"></select>');
        jQuery("#wdtr-select2-task").select2({ data : WDTasker.getModuleTasks(jQuery("#wdtr-select2-modules").val())});
        jQuery("#wdtr-select2-task + .select2-container").attr("style", "");
        jQuery("#wdtr-select2-task").val('').change();
        jQuery("#wdtr-select2-task").change(function(){ // Rebuilds Properties View
            jQuery("#wdtr-load-custom-properties").html(WDTasker.modules.drawTaskBuilderProperties(WDTasker.modules[jQuery("#wdtr-select2-modules").val().replace(/-/g, "_")][jQuery("#wdtr-select2-task").val().replace(/-/g, "_")].get()));
        });
    });

    // Build Initial property view
    jQuery("#wdtr-load-custom-properties").html(WDTasker.modules.drawTaskBuilderProperties(['plugin_id']));
}

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
            WDTasker.editor.instance.setValue(jQuery(this).parent().parent().attr('data-tasks').replace(/\\"/g, '"'));
            WDTasker.editor.instance.clearSelection();
            WDTasker.setTasks(WDTasker.editor.instance.getValue());
            WDTasker.runTasks();        
        });    
        jQuery(".wdtr-library-action-edit").click(function(){ // Edit
            jQuery("#wdtr-editor-modal-container, #wdtr-editor-window, #wdtr-editor-view-console").show();
            jQuery(".wdtr-console-window, #wdtr-editor-view-editor").hide();
            WDTasker.editor.instance.setValue(jQuery(this).parent().parent().attr('data-tasks').replace(/\\"/g, '"'));
            WDTasker.editor.instance.clearSelection(); 
        });  
    });
}