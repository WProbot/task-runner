/*  Elementor Module Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.modules.elementor = {};


// Fire Generic Action that display custom console text and perfoms action faster
WDTasker.modules.elementor._fireGenericAction = function(actionName, options){
    var thisLog = WDTasker.console.loading();
    jQuery.post(ajaxurl, { action : actionName, options: options}, function(data) {
        WDTasker.console.replace(thisLog, data);
        WDTasker.nextTask(); 
    });
}


// Delete WordPress Plugin
WDTasker.modules.elementor.install_template = {};
WDTasker.modules.elementor.install_template.run = function(options){
    WDTasker.modules.elementor._fireGenericAction('task_runner_elementor_install_template', options);    
}
WDTasker.modules.elementor.install_template.get = function(){
    return ['plugin_id'];
}