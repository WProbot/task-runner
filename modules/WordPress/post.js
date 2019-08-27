/*  WP Posts Module Functions
*   Written By Web Disrupt (Kyle Gundersen)
*   https://webdisrupt.com
*/

WDTasker.modules.post = {};
WDTasker.registerModule("post", ["create", "update"]);

// Create WordPress post
WDTasker.modules.post.create = {};
WDTasker.modules.post.create.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_wordpress_create_post', options);    
}
WDTasker.modules.post.create.get = function(){
    return ['post_type', 'post_title', 'post_content'];
}

// Update WordPress post
WDTasker.modules.post.update = {};
WDTasker.modules.post.update.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_wordpress_update_post', options);    
}
WDTasker.modules.post.update.get = function(){
    return ['post_id', 'post_type', 'post_title', 'post_content'];
}

// Add WordPress post meta
WDTasker.modules.post.addMeta = {};
WDTasker.modules.post.addMeta.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_wordpress_create_post_meta', options);    
}
WDTasker.modules.post.addMeta.get = function(){
    return ['post_id', 'post_type', 'post_title', 'post_content'];
}

// Update WordPress post meta
WDTasker.modules.post.updateMeta = {};
WDTasker.modules.post.updateMeta.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_wordpress_update_post_meta', options);    
}
WDTasker.modules.post.updateMeta.get = function(){
    return ['post_id', 'post_type', 'post_title', 'post_content'];
}

// Get WordPress post meta
WDTasker.modules.post.getMeta = {};
WDTasker.modules.post.getMeta.run = function(options){
    WDTasker.modules.base.ajaxCall('task_runner_wordpress_get_post_meta', options);    
}
WDTasker.modules.post.getMeta.get = function(){
    return ['post_id', 'post_type', 'post_title', 'post_content'];
}