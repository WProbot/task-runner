<?php
/**
 * Task Runner template: Settings
 *
 * This template is for the main admin area settings and controls
 *
 * @since  1.0.0
 * 
 */


if(isset($_FILES['tasker_uploads'])){ Web_Disrupt_Task_Runner\editor::import_all_tasker(); }

?>

<div class="wdtr-library-actions">
    <div class="wdtr-library-title"> <img src="<?php echo $logo; ?>" /> Task Runner Library </div>
    <button id="wdtr-create-new" class="wdtr-btn"> Create </button>
    <input  id="wdtr-create-new-name" style="display:none" type="text" placeholder="Name" /> 
    <button  id="wdtr-create-new-cancel" style="display:none" class="wdtr-btn black"> X </button> 
    <button id="wdtr-multiple-import-tasks" class="wdtr-btn"> Import </button>
    <button  id="wdtr-multiple-import-cancel" style="display:none" class="wdtr-btn black"> X </button>
    <form id="wdtr-submit-tasker-upload-form" method="post" action="#" style="display:none" enctype="multipart/form-data">
	<input type="file" name="tasker_uploads[]" id="wdtr-tasker-upload-files" multiple="yes"  accept=".txt,.zip" />
	<?php wp_nonce_field( 'tasker_upload', 'tasker_upload_nonce' ); ?>
	<input id="wdtr-submit-tasker-upload" name="submit_tasker_upload" type="submit" value="Upload" />
    </form>
    <button id="wdtr-multiple-export-tasks" class="wdtr-btn"> Export </button>
</div>

<div id="wdtr-library-container"> </div>

<div id="wdtr-editor-modal-container" style="display:none">
    <div id="wdtr-editor-container">
        <div class="wdtr-console-window" style="display:none;"> <div class="splash-title">Runner Console</div></div>
        <div id="wdtr-editor-window">
        <pre id="task-runner-commands-textarea"> </pre>
        <div class="splash-title">Task Editor</div>
        </div>
        <div id="wdtr-editor-action-bar">
            <div id="wdtr-details-pane">
                <div class="wdtr-progress-bar"><div class="wdtr-progress-percentage"> </div></div>
            </div>
            <button id="wdtr-editor-cancel" class="wdtr-btn wdtr-cancel"> Close </button>
            <button id="wdtr-editor-run-tasks" class="wdtr-btn wdtr-run"> Run Tasks </button>
        </div>
    </div>
    <div id="wdtr-editor-side-menu">
        <div id="wdtr-editor-main-menu">
            <button id="wdtr-editor-view-console" class="wdtr-btn"> Console </button>
            <button id="wdtr-editor-view-editor" class="wdtr-btn" style="display:none"> Editor </button>
            <button id="wdtr-editor-task-builder" class="wdtr-btn"> Task Builder </button>
            <button id="wdtr-editor-delete-tasks-confirm-fire" class="wdtr-btn"> Delete </button>
            <div id="wdtr-editor-delete-tasks-confirm" style="display:none;">
                <div style="padding:20px;background: #911;"> Are you sure you want to delete this task?</div>
                <div style="display:flex">
                    <button id="wdtr-editor-delete-tasks" class="wdtr-btn"> Ok </button>
                    <button id="wdtr-editor-delete-tasks-confirm-close" class="wdtr-btn"> Cancel </button>
                </div>
            </div>
            <button id="wdtr-editor-save-tasks" class="wdtr-btn"> Save </button>
            <button id="wdtr-editor-export-tasks" class="wdtr-btn"> Export </button>
        </div>
        <div id="wdtr-editor-task-builder-menu"  style="display:none">
            <button id="wdtr-editor-task-builder-back" class="wdtr-btn"> Back </button>
            <div class="wdtr-editor-side-menu-header">
                Task Builder
            </div>
            <label>Library</label>
            <select id="wdtr-select2-modules" class="wdtr-select2"></select>
            <label>Function</label>
            <select  id="wdtr-select2-task" class="wdtr-select2"></select>
            <label>Properties</label>
            <div id="wdtr-load-custom-properties">
                <input class="wdtr-tb-property" type="text" />
            </div>
            <button id="wdtr-fire-task-builder"> Add Command </button>
        </div>
    </div>
</div>

<script>

jQuery('document').ready(function($){

    var editor = ace.edit('task-runner-commands-textarea', 
    {selectionStyle: "line",
    mode : "ace/mode/taskrunner",
    theme : "ace/theme/tomorrow_night",
    wrapBehavioursEnabled: true,
    indentedSoftWrap: false, 
    behavioursEnabled: false,
    highlightActiveLine: true
    });
    editor.getSession().setUseWrapMode(true);

    // Load library
    WDTasker.editor.instance = editor;
    WDTasker.editor.drawLibrary("");

    // Library
    // Create a new tasker
    $("#wdtr-create-new").click(function(){
        if($("#wdtr-create-new-name").val().length <= 1){
            $("#wdtr-create-new-name, #wdtr-create-new-cancel").show();
            $("#wdtr-create-new").addClass("ready");
        } else {
            WDTasker.editor.createTasker($("#wdtr-create-new-name").val());
            $("#wdtr-create-new").removeClass("ready");
            $("#wdtr-create-new-name").val(""); 
            $("#wdtr-create-new-name, #wdtr-create-new-cancel").hide();
        }
    });

    // Cancel create new
    $("#wdtr-create-new-cancel").click(function(){
        $("#wdtr-create-new").removeClass("ready");
        $("#wdtr-create-new-name").val(""); 
        $("#wdtr-create-new-name, #wdtr-create-new-cancel").hide();
    });

    // Import all files in a zip
    $("#wdtr-multiple-import-tasks").click(function(){
        $("#wdtr-submit-tasker-upload-form, #wdtr-multiple-import-cancel").show();
    });

    // Cancel import menu
    $("#wdtr-multiple-import-cancel").click(function(){
        $("#wdtr-submit-tasker-upload-form, #wdtr-multiple-import-cancel").hide();       
    });

    // Export all files in a zip
    $("#wdtr-multiple-export-tasks").click(function(){
        jQuery.post(ajaxurl, { action : 'task_runner_editor_export_all_tasker'}, function(data) { 
            let element = document.createElement('a');
            let filename = data.split("/");
            element.setAttribute('href', data);
            element.setAttribute('download', filename[filename.length - 1] );
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element); 
        });  
    });


    
    // Editor
    // Show Confirm
    $("#wdtr-editor-delete-tasks-confirm-fire").click(function(){
        $("#wdtr-editor-delete-tasks-confirm").show();
    });
    // Hide Confirm
    $("#wdtr-editor-delete-tasks-confirm-close").click(function(){
        $("#wdtr-editor-delete-tasks-confirm").hide();
    });
    // Close editor modal
    $("#wdtr-editor-cancel").click(function(){
        $("#wdtr-editor-modal-container").hide();
        WDTasker.editor.drawLibrary("");
    });
    // Run Tasks in Editor
    $('#wdtr-editor-run-tasks').click(function(){      
        WDTasker.setTasks(editor.getValue());
        WDTasker.runTasks();        
    });
    // Editor Side Menu
    // Delete task
    $("#wdtr-editor-delete-tasks").click(function(){
        WDTasker.editor.deleteTasker(editor.getValue());
        $("#wdtr-editor-delete-tasks-confirm").hide();   
    });
    // Save tasker
    $("#wdtr-editor-save-tasks").click(function(){
        WDTasker.editor.saveTasker(editor.getValue());
    });
    // Open Console View
    $("#wdtr-editor-view-console").click(function(){
        $("#wdtr-editor-window").hide();
        $(".wdtr-console-window, #wdtr-editor-view-editor").show();
        $(this).hide();   
    });
     // Open Task Editor Videw
     $("#wdtr-editor-view-editor").click(function(){
        $("#wdtr-editor-view-console, #wdtr-editor-window").show();
        $(".wdtr-console-window").hide();
        $(this).hide();   
    });   
    // Add tasks using wizard
    $("#wdtr-editor-task-builder").click(function(){
        WDTasker.editor.taskerBuilderLoad();
        $("#wdtr-editor-task-builder-menu").show();  
        $("#wdtr-editor-main-menu").hide();
    });
    // Return to menu from wizard
    $("#wdtr-editor-task-builder-back").click(function(){
        $("#wdtr-editor-main-menu").show();
        $("#wdtr-editor-task-builder-menu").hide();     
    });
    // Task builder Add command to editor
    $("#wdtr-fire-task-builder").click(function(){
        var commandBuilder = $("#wdtr-select2-modules").val() + " " + $("#wdtr-select2-task").val();
        $(".wdtr-tb-property").each( function(){ 
            commandBuilder += " " + $(this).val();
        });
        editor.session.insert(editor.getCursorPosition(), commandBuilder + "\n");
        WDTasker.editor.instance.clearSelection();
    });
    // Export all files in a zip
    $("#wdtr-editor-export-tasks").click(function(){
        let text = editor.getValue();
        let filename = WDTasker.helpers.getName(editor.getValue())+".txt"; 
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);  
    });

});

</script>