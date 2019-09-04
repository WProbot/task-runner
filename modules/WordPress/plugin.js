/*  WordPress Plugin Module 
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.registerModule("plugin", ["install", "activate", "status", "deactivate", "delete"]);
WDTasker.modules.plugin = {};

// Install WordPress Plugin
WDTasker.modules.plugin.install = {};
WDTasker.modules.plugin.install.run = function(options){
    WDTasker.modules.base.ajaxCallIframe('task_runner_wordpress_install_plugin', "Plugin "+options[0]+" installed successfully.", options);
}
WDTasker.modules.plugin.install.get = function(){
    return ['plugin_id'];
}

// Activate WordPress Plugin
WDTasker.modules.plugin.activate = {};
WDTasker.modules.plugin.activate.run = function(options){
    WDTasker.modules.base.ajaxCallIframe('task_runner_wordpress_activate_plugin', "Plugin "+options[0]+" activated successfully.", options);    
}
WDTasker.modules.plugin.activate.get = function(){
    return ['plugin_id'];
}

// Display All WordPress Plugin status
WDTasker.modules.plugin.status = {};
WDTasker.modules.plugin.status.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_wordpress_plugin_status', options);    
}
WDTasker.modules.plugin.status.get = function(){
    return ['plugin_id'];
}

// Deactivate WordPress Plugin
WDTasker.modules.plugin.deactivate = {};
WDTasker.modules.plugin.deactivate.run = function(options){
    WDTasker.modules.base.ajaxCallIframe('task_runner_wordpress_deactivate_plugin', "Plugin "+options[0]+" deactivated successfully.", options);    
}
WDTasker.modules.plugin.deactivate.get = function(){
    return ['plugin_id'];
}

// Delete WordPress Plugin
WDTasker.modules.plugin.delete = {};
WDTasker.modules.plugin.delete.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_wordpress_delete_plugin', options);    
}
WDTasker.modules.plugin.delete.get = function(){
    return ['plugin_id'];
}