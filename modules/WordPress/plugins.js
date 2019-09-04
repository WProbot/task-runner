/*  WordPress Plugin Module 
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.registerModule("plugins", ["status"]);
WDTasker.modules.plugins = {};

// Display All WordPress Plugin Activity
WDTasker.modules.plugins.status = {};
WDTasker.modules.plugins.status.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_wordpress_plugins_status', options);    
}
WDTasker.modules.plugins.status.get = function(){
    return [];
}