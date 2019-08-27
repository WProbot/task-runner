/*  WordPress Settings Module 
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.registerModule("settings", ["setOption", "getOption"]);
WDTasker.modules.settings = {};

// Change WordPress settings option
WDTasker.modules.settings.setOption = {};
WDTasker.modules.settings.setOption.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_wordpress_setting_set_option', options);
}
WDTasker.modules.settings.setOption.get = function(){
    return ['option_key', 'option_value'];
}

// Get WordPress settings option
WDTasker.modules.settings.getOption = {};
WDTasker.modules.settings.getOption.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_wordpress_setting_get_option', options);
}
WDTasker.modules.settings.getOption.get = function(){
    return ['option_key'];
}