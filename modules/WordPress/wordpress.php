<?php
namespace Web_Disrupt_Task_Runner;

class modules_WordPress{

  /**
	 * Main Constructor that sets up all static data associated with this plugin.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function __construct() {

    // Settings & options
    add_action("wp_ajax_task_runner_wordpress_setting_set_option", [$this, "wp_setting_set_option"]);
    add_action("wp_ajax_task_runner_wordpress_setting_get_option", [$this, "wp_setting_get_option"]);
    // Plugins
    add_action("wp_ajax_task_runner_wordpress_install_plugin", [$this, "install_plugin"]);
    add_action("wp_ajax_task_runner_wordpress_activate_plugin", [$this, "activate_plugin"]);
    add_action("wp_ajax_task_runner_wordpress_deactivate_plugin", [$this, "deactivate_plugin"]);
    add_action("wp_ajax_task_runner_wordpress_delete_plugin", [$this, "delete_plugin"]);
    add_action("wp_ajax_task_runner_wordpress_plugin_status", [$this, "plugin_status"]);
    add_action("wp_ajax_task_runner_wordpress_plugins_status", [$this, "plugins_status"]);
    // Themes
    add_action("wp_ajax_task_runner_wordpress_install_theme", [$this, "install_theme"]);
    add_action("wp_ajax_task_runner_wordpress_activate_theme", [$this, "activate_theme"]);
    add_action("wp_ajax_task_runner_wordpress_delete_theme", [$this, "delete_theme"]);
    add_action("wp_ajax_task_runner_wordpress_get_current_theme", [$this, "get_current_theme"]);
    // Posts
    add_action("wp_ajax_task_runner_wordpress_create_post", [$this, "create_post"]);
    add_action("wp_ajax_task_runner_wordpress_update_post", [$this, "update_post"]);
    add_action("wp_ajax_task_runner_wordpress_create_post_meta", [$this, "create_post_meta"]);
    add_action("wp_ajax_task_runner_wordpress_update_post_meta", [$this, "update_post_meta"]);
    add_action("wp_ajax_task_runner_wordpress_get_post_meta", [$this, "get_post_meta"]);

  }

  /**
	 *  Returns the plugin install stirng
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function install_plugin(){
    $pluginSlug = explode("/", sanitize_file_name($_POST['options'][0]));
    $pluginSlug = $pluginSlug[0];
    echo admin_url('update.php?action=install-plugin&plugin='.$pluginSlug.'&_wpnonce='.wp_create_nonce("install-plugin_".$pluginSlug));
    wp_die();
  }

  /**
	 * Returns the plugin activation stirng
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function activate_plugin(){
    $pluginFullName = sanitize_file_name($_POST['options'][0]);
    echo admin_url('plugins.php?action=activate&plugin='.$pluginFullName.'&_wpnonce='.wp_create_nonce("activate-plugin_".$pluginFullName));
    wp_die();
  }

  /**
	 * Returns the plugin deactivation stirng
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function deactivate_plugin(){
    $pluginFullName = sanitize_file_name($_POST['options'][0]);
    echo admin_url('plugins.php?action=deactivate&plugin='.$pluginFullName.'&_wpnonce='.wp_create_nonce("deactivate-plugin_".$pluginFullName));
    wp_die();
  }

  /**
	 * Returns the plugin delete stirng
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function delete_plugin(){
    if ( current_user_can('delete_plugins') ){ 
      $pluginFullName = sanitize_text_field($_POST['options'][0]);
      $pluginData = get_plugin_data( WP_PLUGIN_DIR . '/' . $pluginFullName );
      $plugins = array_filter($pluginData, 'is_plugin_inactive'); // Do not allow to delete Activated plugins.
      if ( ! empty( $plugins ) ) {
        if (file_exists(WP_PLUGIN_DIR."/".$pluginFullName)) {
            require_once(ABSPATH.'wp-admin/includes/plugin.php');
            require_once(ABSPATH.'wp-admin/includes/file.php');
            delete_plugins(array($pluginFullName));
            $this->return_value($pluginFullName . " has been Successfully Deleted.", true);  
        }
      } else {
        $this->return_value("ERROR: " . $pluginFullName . " is currently active or does not exist. Therfore it cannot be deleted.", false);   
      }
    } else {
      $this->return_value("ERROR: You do not have the correct permissions to delete plugins.", false);
    }
    wp_die();
  }

  /**
	 * Returns an array in string format
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function plugin_status(){
    $_plugins_details = get_plugins();
    $_post_id = sanitize_text_field($_POST['options'][0]);
    if(isset($_plugins_details[$_post_id]) ){ // If it exists
      $_message = $_plugins_details[$_post_id]['Name'] . " is ";
      if(is_plugin_active($_post_id)) { $_message .= "<span style='color:#228822'>Enabled</span>"; $_value = true; } else { $_message .= "Disabled"; $_value = false; }
    } else { // If it doesn't exists
      $_message = $_post_id." does not exist.";
      $_value = false;
    }
    $this->return_value($_message, $_value);
    wp_die();
  }


  /**
	 * Returns an array in string format
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function plugins_status(){
    $_plugins = array_keys(get_plugins());
    $_plugins_details = get_plugins();
    $_message = "";
    for ($i=0; $i < count($_plugins); $i++) { 
      $_message .= ($i+1).") ".$_plugins_details[$_plugins[$i]]['Name'] . " is ";
      if(is_plugin_active($_plugins[$i])) { $_message .= "<span style='color:#228822'>Enabled</span>"; } else { $_message .= "Disabled"; }
      if($i != count($_plugins) - 1){ $_message .= "<br />"; }
    }
    $this->return_value($_message, $_plugins_details);  
    wp_die();
  }

  /**
	 *  Returns the theme install from Local if two stirng or from repo if one string
   *  One Param setup is name of stylesheet.
   *  Overload : Two Param setup is local source folder and destination folder
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function install_theme(){
    if ( current_user_can('install_themes') ){ 
      if(isset($_POST['options'][1])){ // Install theme local
        $themeSrc = $this->filter_directory_keywords(sanitize_file_name($_POST['options'][0]));
        $themeDest = get_theme_root()."/".sanitize_file_name($_POST['options'][1]);
        editor::copy_recursive($themeSrc, $themeDest);
        echo "Theme ". end(explode("/", $themeDest))." installed successfully.";
      } else { // Install theme
        $themeSlug = sanitize_file_name($_POST['options'][0]);
        echo admin_url("update.php?action=install-theme&theme=".$themeSlug."&_wpnonce=".wp_create_nonce("install-theme_".$themeSlug));
      }
    } else {
      $this->return_value("ERROR: You do not have the correct permissions to install themes.", false);    
    }
    wp_die();
  }

  /**
	 * Returns the theme activation stirng
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function activate_theme(){
    if ( current_user_can('switch_themes') ){ 
      $themeFullName = sanitize_file_name($_POST['options'][0]);
      echo admin_url("themes.php?action=activate&stylesheet=".$themeFullName."&_wpnonce=".wp_create_nonce("switch-theme_".$themeFullName));
    } else {
      $this->return_value("ERROR: You do not have the correct permissions to switch themes.", false);    
    }
    wp_die();
  }

  /**
	 * Returns the theme delete url
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function delete_theme(){
    if ( current_user_can('delete_themes') ){ 
      $themeFullName = sanitize_file_name($_POST['options'][0]);
      echo admin_url("themes.php?action=delete&stylesheet=".$themeFullName."&_wpnonce=".wp_create_nonce("delete-theme_".$themeFullName));
    } else {
      $this->return_value("ERROR: You do not have the correct permissions to delete themes.", false);    
    }
    wp_die();
  }

  /**
	 * Returns the current theme
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function get_current_theme(){
    $current_theme = wp_get_theme();
    $current_theme_name = $current_theme->get("TextDomain");
    $this->return_value("The current theme is "+$current_theme_name, $current_theme_name );
    wp_die();
  }

  /**
	 * Helper that filters for WordPress native Paths
	 *
	 * @since  1.0.0
   * @param string  String to be filetered for keywords 
	 * @return string
	 */
  private function filter_directory_keywords($path){
    $keywords_value = ["[plugin-dir]" => WP_PLUGIN_DIR. "/", "[theme-dir]" => get_theme_root()."/", "[upload-dir]" => wp_get_upload_dir( )."/"];
    $keywords_key = ["[plugin-dir]", "[theme-dir]", "[upload-dir]"];
    for ($i=0; $i < count($keywords_key); $i++) { 
      if (strpos($path, $keywords_key[$i]) !== false) {
        $path = str_replace($keywords_key[$i], $keywords_value[$keywords_key[$i]], $path);
      }
    }
    return $path;
  }

  /**
	 * Set a WordPress settings option to a new value
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function wp_setting_set_option(){
    if(current_user_can('manage_options')){
      update_option(sanitize_text_field($_POST['options'][0]), sanitize_text_field($_POST['options'][1]));
      $this->return_value("Successfully changed ".sanitize_text_field($_POST['options'][0]). " to equal ".sanitize_text_field($_POST['options'][1]), true );
    } else {
      $this->return_value("ERROR: You don't have the proper permissions.", false );
    }
    wp_die();
  }

  /**
	 * Get a WordPress settings option
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function wp_setting_get_option(){
    if(current_user_can('manage_options')){
      $value = get_option(sanitize_text_field($_POST['options'][0]), sanitize_text_field($_POST['options'][1]));
      if(isset($value)){
        $this->return_value("" , $value);
      } else {
        $this->return_value("ERROR: The setting option you are looking for does not exists.", false);
      }
    } else {
      $this->return_value("ERROR: You don't have the proper permissions.", false );     
    }
    wp_die();
  }

  /**
	 * Create a post
	 *
	 * @since  1.0.0
	 * @return void
	 */
  public function create_post(){
    if(sanitize_text_field($_POST['options'][0]) == "page"){ $check = current_user_can('publish_pages'); } else { $check = current_user_can('publish_posts'); }
    if($check){
      $post_body = array(
        'post_type'    => sanitize_text_field($_POST['options'][0]),
        'post_title'   => sanitize_text_field(wp_strip_all_tags($_POST['options'][1])),
        'post_content' => sanitize_textarea_field($_POST['options'][2]),
        'post_status'  => $this->set_value(sanitize_text_field($_POST['options'][3]), "draft")
      );
      $post_id = wp_insert_post( $post_body );
      $this->return_value(sanitize_text_field($_POST['options'][0])." named ".sanitize_text_field($_POST['options'][1])." created successfully",  $post_id);  
    } else {
      $this->return_value("ERROR: You don't have the proper permissions.", false );     
    }
    wp_die();
  }

  /**
	 * Update an existing post
	 *
	 * @since  1.0.0
	 * @return void
	 */
  public function update_post(){
    if($_POST['options'][1] == "page"){ $check = current_user_can('edit_pages'); } else { $check = current_user_can('edit_posts'); }
    if($check){ 
      $post_body = array(
        'ID'  => sanitize_text_field($_POST['options'][0]),
        'post_type'   => sanitize_text_field($_POST['options'][1]),
        'post_title'   => sanitize_text_field($_POST['options'][2]),
        'post_content' => sanitize_textarea_field($_POST['options'][3]),
        'post_status' =>  $this->set_value(sanitize_text_field($_POST['options'][4]), "draft")
      );
      $post_id = wp_update_post( $post_body );
      $this->return_value(sanitize_text_field($_POST['options'][1])." named ".sanitize_text_field($_POST['options'][2])." updated successfully", $post_id);  
    } else {
      $this->return_value("ERROR: You don't have the proper permissions.", false );     
    }
    wp_die();
  }

  /**
	 * Create meta data associated with a post
	 *
	 * @since  1.0.0
	 * @return void
	 */
  public function create_post_meta(){
    if(current_user_can('manage_options')){
      $_post_id = sanitize_text_field( $_POST['options'][0] );
      $_key = sanitize_key( $_POST['options'][1] );
      $_content = sanitize_textarea_field( $_POST['options'][2] );
      if(!get_post_meta($_post_id, $_key)){
        update_post_meta($_post_id, $_key, $_content);
        $this->return_value("Post ID " . $_post_id . " key [".$_key."] has been created successfully", true);
      } else {
        $this->return_value("Post " . $_post_id . " key [".$_key."] already exists.", false);
      }
    } else {
      $this->return_value("ERROR: You don't have the proper permissions.", "" );     
    }
    wp_die();
  }

  /**
	 * Update meta data associated with a post
	 *
	 * @since  1.0.0
	 * @return void
	 */
  public function update_post_meta(){
    if(current_user_can('manage_options')){
      $_post_id = sanitize_text_field( $_POST['options'][0] );
      $_key = sanitize_key( $_POST['options'][1] );
      $_content = sanitize_textarea_field( $_POST['options'][2] );
      update_post_meta($_post_id , $_key, $_content);
      $this->return_value("Post ID " . $_post_id . " key [".$_key."] has been updated successfully", true);
    }  else {
      $this->return_value("ERROR: You don't have the proper permissions.", "" );     
    }
    wp_die();
  }

  /**
	 * Get meta data associated with a post
	 *
	 * @since  1.0.0
	 * @return void
	 */
  public function get_post_meta(){
    if(current_user_can('manage_options')){
      $_post_id = sanitize_text_field( $_POST['options'][0] );
      $_key = sanitize_key( $_POST['options'][1] );
      if(get_post_meta($_post_id, $_key)){
        $this->return_value("", get_post_meta($_post_id, $_key));
      } else {
        $this->return_value("", "");
      }
    } else {
      $this->return_value("ERROR: You don't have the proper permissions.", "" );     
    }
    wp_die();
  }

  /**
	 * A helper that returns a value if it exist otherwise a default
	 *
	 * @since  1.0.0
	 * @return string
	 */
  private function set_value($value, $default){
    if(isset($value)){  
      return $value; 
     } else{
      return $default;
     }
  }

  /**
	 * A helper that builds ajax return json object
	 *
	 * @since  1.0.0
	 * @return string
	 */
  private function return_value($message, $returnData){
    echo json_encode(["message" => $message, "returnData" => $returnData ]);
  }


}

new modules_WordPress();