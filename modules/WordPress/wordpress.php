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

    // Settings
    add_action("wp_ajax_task_runner_wordpress_setting_set_option", [$this, "wp_setting_set_option"]);
    // Plugins
    add_action("wp_ajax_task_runner_wordpress_install_plugin", [$this, "install_plugin"]);
    add_action("wp_ajax_task_runner_wordpress_activate_plugin", [$this, "activate_plugin"]);
    add_action("wp_ajax_task_runner_wordpress_deactivate_plugin", [$this, "deactivate_plugin"]);
    add_action("wp_ajax_task_runner_wordpress_delete_plugin", [$this, "delete_plugin"]);
    // Themes
    add_action("wp_ajax_task_runner_wordpress_install_theme", [$this, "install_theme"]);
    add_action("wp_ajax_task_runner_wordpress_activate_theme", [$this, "activate_theme"]);
    add_action("wp_ajax_task_runner_wordpress_delete_theme", [$this, "delete_theme"]);

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
            echo "File has been Successfully Deleted";
        }
      } else {
        echo "ERROR: " . $pluginFullName . " is active and cannot be deleted.";   
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
      echo "Successfully changed ".$_POST['options'][0]. " to equal ".$_POST['options'][1];
    } else {
      echo "ERROR: You don't have the proper permissions.";
    }
    wp_die();
  }

}

new modules_WordPress();