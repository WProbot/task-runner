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
    // Themes
    add_action("wp_ajax_task_runner_wordpress_install_theme", [$this, "install_theme"]);
    add_action("wp_ajax_task_runner_wordpress_activate_theme", [$this, "activate_theme"]);
    add_action("wp_ajax_task_runner_wordpress_delete_theme", [$this, "delete_theme"]);
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
    $pluginSlug = explode("/", $_POST['options'][0]);
    $pluginSlug = $pluginSlug[0];
    echo site_url('/wp-admin/update.php?action=install-plugin&plugin='.$pluginSlug.'&_wpnonce='.wp_create_nonce("install-plugin_".$pluginSlug));
    wp_die();
  }

  /**
	 * Returns the plugin activation stirng
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function activate_plugin(){
    $pluginFullName = $_POST['options'][0];
    echo site_url('/wp-admin/plugins.php?action=activate&plugin='.$pluginFullName.'&_wpnonce='.wp_create_nonce("activate-plugin_".$pluginFullName));
    wp_die();
  }

  /**
	 * Returns the plugin deactivation stirng
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function deactivate_plugin(){
    $pluginFullName = $_POST['options'][0];
    echo site_url('/wp-admin/plugins.php?action=deactivate&plugin='.$pluginFullName.'&_wpnonce='.wp_create_nonce("deactivate-plugin_".$pluginFullName));
    wp_die();
  }

  /**
	 * Returns the plugin delete stirng
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function delete_plugin(){
    if ( ! current_user_can('delete_plugins') ) { 
      echo "ERROR: You do not have the correct permissions to delete plugins.";
    } else {
      $pluginFullName = $_POST['options'][0];
      $pluginData = get_plugin_data( WP_PLUGIN_DIR . '/' . $pluginFullName );
      $plugins = array_filter($$pluginData, 'is_plugin_inactive'); // Do not allow to delete Activated plugins.
      if ( ! empty( $plugins ) ) {
        if (file_exists(WP_PLUGIN_DIR."/".$pluginFullName)) {
            require_once(ABSPATH.'wp-admin/includes/plugin.php');
            require_once(ABSPATH.'wp-admin/includes/file.php');
            delete_plugins(array($pluginFullName));
            $this->return_value($pluginFullName . " has been Successfully Deleted.", true);  
        }
      } else {
        $this->return_value("ERROR: " . $pluginFullName . " is active or doesn't exist and cannot be deleted.", false);   
      }
    }
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
    if(isset($_POST['options'][1])){ // Install theme local
      $themeSrc = $this->filter_directory_keywords($_POST['options'][0]);
      $themeDest = get_theme_root()."/".$_POST['options'][1];
      editor::copy_recursive($themeSrc, $themeDest);
      echo "Theme ". end(explode("/", $themeDest))." installed successfully.";
    } else { // Install theme
      $themeSlug = $_POST['options'][0];
      echo site_url("/wp-admin/update.php?action=install-theme&theme=".$themeSlug."&_wpnonce=".wp_create_nonce("install-theme_".$themeSlug));
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
    $themeFullName = $_POST['options'][0];
    echo site_url("/wp-admin/themes.php?action=activate&stylesheet=".$themeFullName."&_wpnonce=".wp_create_nonce("switch-theme_".$themeFullName));
    wp_die();
  }

  /**
	 * Returns the theme delete url
	 *
	 * @since  1.0.0
	 * @return string
	 */
  public function delete_theme(){
    $themeFullName = $_POST['options'][0];
    echo site_url("/wp-admin/themes.php?action=delete&stylesheet=".$themeFullName."&_wpnonce=".wp_create_nonce("delete-theme_".$themeFullName));
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
      update_option($_POST['options'][0], $_POST['options'][1]);
      $this->return_value("Successfully changed ".$_POST['options'][0]. " to equal ".$_POST['options'][1], true );
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
    $value = get_option($_POST['options'][0], $_POST['options'][1]);
    if(isset($value)){
      $this->return_value("" , $value);
    } else {
      $this->return_value("ERROR: The setting option you are looking for does not exists.", false);
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
    $post_body = array(
      'post_type'    => $_POST['options'][0],
      'post_title'   => wp_strip_all_tags($_POST['options'][1]),
      'post_content' => $_POST['options'][2],
      'post_status'  => $this->set_value($_POST['options'][3], "draft")
    );
    $post_id = wp_insert_post( $post_body );
    $this->return_value($_POST['options'][0]." named ".$_POST['options'][1]." created successfully",  $post_id);  
    wp_die();
  }

  /**
	 * Update an existing post
	 *
	 * @since  1.0.0
	 * @return void
	 */
  public function update_post(){
    $post_body = array(
      'ID'  => $_POST['options'][0],
      'post_type'   => $_POST['options'][1],
      'post_title'   => $_POST['options'][2],
      'post_content' => $_POST['options'][3],
      'post_status' =>  $this->set_value($_POST['options'][4], "draft")
    );
    $post_id = wp_update_post( $post_body );
    $this->return_value($_POST['options'][1]." named ".$_POST['options'][2]." updated successfully", $post_id);  
    wp_die();
  }

  /**
	 * Create meta data associated with a post
	 *
	 * @since  1.0.0
	 * @return void
	 */
  public function create_post_meta(){
    if(get_post_meta($_POST['options'][0])){
      update_post_meta($_POST['options'][0], $_POST['options'][1], $_POST['options'][2]);
      $this->return_value("Post ID " + $_POST['options'][0] + " key ["+$_POST['options'][1]+"] has been created successfully", true);
    } else {
      $this->return_value("Post "+$_POST['options'][0]+ " key ["+$_POST['options'][1]+"] already exists.", false);
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
    update_post_meta($_POST['options'][0], $_POST['options'][1], $_POST['options'][2]);
    $this->return_value("Post ID " + $_POST['options'][0] + " key ["+$_POST['options'][1]+"] has been updated successfully", true);
    wp_die();
  }

  /**
	 * Get meta data associated with a post
	 *
	 * @since  1.0.0
	 * @return void
	 */
  public function get_post_meta(){
    if(get_post_meta($_POST['options'][0], $_POST['options'][1])){
      $this->return_value("", get_post_meta($_POST['options'][0], $_POST['options'][1]));
    } else {
      $this->return_value("", "");
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