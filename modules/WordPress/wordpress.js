/*  WordPress Base Module Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.modules.wordpress = {};

// Natively like a user opens iframe and manipulates WordPress as a user would
WDTasker.modules.wordpress._fireIframeAction = function(actionName, logSuccess, options){
    var thisLog = WDTasker.console.loading();
    jQuery.post(ajaxurl, { action : actionName, options: options}, function(data) {
        console.log(data);
        var iFrameObj = document.createElement('IFRAME');
        jQuery(iFrameObj).css("display", "none");
        iFrameObj.id = "wdtr-modules-wordpress";
        iFrameObj.src = data;
        jQuery('body').append(iFrameObj);
        jQuery(iFrameObj).load( function () {
            jQuery("#wdtr-modules-wordpress").replaceWith("");
            WDTasker.console.replace(thisLog, logSuccess);
            WDTasker.nextTask(); 
        });
    });
}

// Fire Generic Action that display custom console text and perfoms action faster
WDTasker.modules.wordpress._fireGenericAction = function(actionName, options){
    var thisLog = WDTasker.console.loading();
    jQuery.post(ajaxurl, { action : actionName, options: options}, function(data) {
        WDTasker.console.replace(thisLog, data);
        WDTasker.nextTask(); 
    });
}

/*** Add Wordpress Task Builder Options ***/
// Add Plugin ID to Properties List
WDTasker.modules.addTaskBuilderProperty('plugin_id',
    { 
        label : "Plugin ID",
        type : "input",
        placeholder : "plugin_folder/main_plugin_file.php",
        description : "The plugins folder and startup file located inside the wp-content/plugins folder." +
        " To find this hover over the activate button after the plugin is installed and you should" +
        " see it as part of the links parameters in the bottom left hand corner. Example: woocommerce/woocommerce.php"
    }
);

// Add Theme ID to Properties List
WDTasker.modules.addTaskBuilderProperty('theme_id',
    { 
        label : "Theme ID",
        type : "input",
        placeholder : "theme-name",
        description : "The theme name seperated with hyphons is all you need." +
        " To find this hover over the install button when adding a new theme. To " +
        " see it as part of the links parameters in the bottom left hand corner. Example: atra"
    }
);

// Add Theme local source location
WDTasker.modules.addTaskBuilderProperty('folder_src',
{ 
    label : "Source",
    type : "input",
    placeholder : "[plugin-dir]path/to/yourFolder",
    description : "Use [plugin-dir], [theme-dir], or [upload-dir] to point to a local folder." +
    " You can also point to a zip folder you uploaded by putting the path to that zip folder."    
}
);

// Add Theme local destination
WDTasker.modules.addTaskBuilderProperty('theme_dest',
{ 
    label : "Destination",
    type : "input",
    placeholder : "plugin-name",
    description : "Input the final theme folder name."
}
);

// Add option key to the database
WDTasker.modules.addTaskBuilderProperty('option_key',
{ 
    label : "Option Key",
    type : "input",
    placeholder : "database_key",
    description : "Database key value."    
}
);

// Add Value to database
WDTasker.modules.addTaskBuilderProperty('option_value',
{ 
    label : "Option Value",
    type : "input",
    placeholder : "Some value",
    description : "Assigns a new value to database key, make sure that it is the same type."
}
);