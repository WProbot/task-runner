/*  WordPress Theme Module 
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.registerModule("theme", ["install", "install-local", "activate", "delete"]);
WDTasker.modules.theme = {};

// Install WordPress Theme
WDTasker.modules.theme.install = {};
WDTasker.modules.theme.install.run = function(options){
        WDTasker.modules.wordpress._fireIframeAction('task_runner_wordpress_install_theme', "Theme "+options[0]+" installed successfully.", options);
}
WDTasker.modules.theme.install.get = function(){
    return ['theme_id'];
}

// Install Locally Stored WordPress Theme
WDTasker.modules.theme.install_local = {};
WDTasker.modules.theme.install_local.run = function(options){
WDTasker.modules.wordpress._fireGenericAction('task_runner_wordpress_install_theme', options);
}
WDTasker.modules.theme.install_local.get = function(){
    return ['folder_src', 'theme_dest'];
}

// Activate WordPress Theme
WDTasker.modules.theme.activate = {};
WDTasker.modules.theme.activate.run = function(options){
    WDTasker.modules.wordpress._fireIframeAction('task_runner_wordpress_activate_theme', "Theme "+options[0]+" activated successfully.", options);    
}
WDTasker.modules.theme.activate.get = function(){
    return ['theme_id'];
}

// Delete WordPress Theme
WDTasker.modules.theme.delete = {};
WDTasker.modules.theme.delete.run = function(options){
    WDTasker.modules.wordpress._fireIframeAction('task_runner_wordpress_delete_theme', "Theme "+options[0]+" deleted successfully.", options);    
}
WDTasker.modules.theme.delete.get = function(){
    return ['theme_id'];
}
