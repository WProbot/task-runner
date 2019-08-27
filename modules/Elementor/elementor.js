/*  Elementor Module Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.modules.elementor = {};
WDTasker.registerModule("elementor", ["installTemplate"]);

// Create Elementor Page
WDTasker.modules.elementor.installTemplate = {};
WDTasker.modules.elementor.installTemplate.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_elementor_install_template', options);    
}
WDTasker.modules.elementor.installTemplate.get = function(){
    return ['plugin_id'];
}