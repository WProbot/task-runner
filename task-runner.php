<?php
/**
 * Plugin Name: Task Runner
 * Description: Powerful task automator that can be used to make repeatable tasks and build processes inside WordPress.
 * Plugin URI: https://www.webdisrupt.com/task-runner/
 * Version: 1.0.0
 * Author: Web Disrupt
 * Author URI: https://webdisrupt.com
 * Text Domain: task-runner
 * License: GNU General Public License v3.0
 * 
*/

namespace Web_Disrupt_Task_Runner;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

if ( ! class_exists('Web_Disrupt_Task_Runner\Core')) {

class Core {
   
    /**
	 * Creates a single Instance of self
	 *
	 * @var Static data - Define menu main menu name
	 * @since 1.0.0
	 */
	private static $_instance = null;
	
	public static $plugin_data = null;


	/**
	 * Creates and returns the main object for this plugin
	 *
	 *
	 * @since  1.0.0
	 * @return Web_Disrupt_Funnelmentals
	 */
	static public function init() {
        
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;

    }

    /**
	 * Throw error on object clone
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object therefore, we don't want the object to be cloned.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'elementor-pro' ), '1.0.0' );
	}

	/**
	 * Disable unserializing of the class
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'elementor-pro' ), '1.0.0' );
    }
    
    /**
	 * Main Constructor that sets up all static data associated with this plugin.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	private function __construct() {

        // Setup static plugin_data
		self::$plugin_data = array(
            "name"            => "Task Runner",
            "slug"            => "task-runner",
            "version"         => "1.0.0",
            "author"          => "Web Disrupt",
            "description"     => "Powerful task automator that can be used to make repeatable tasks and build processes inside WordPress.",
            "logo"            => plugins_url( 'images/task-runner-logo.svg', __FILE__ ),
			"style"           => plugins_url( 'templates/style.css', __FILE__  ),
			"images"          => plugins_url( 'assets/images/', __FILE__ ),
			"resources"       => plugins_url( 'assets/resources/', __FILE__ ),
			"save-dir"        => ( wp_upload_dir() )['basedir'] .'/'. "custom-taskers",
			"save-root"        => ( wp_upload_dir() )['baseurl'] .'/'. "custom-taskers",
            "url-author"      => "https://www.webdisrupt.com/",
            "this-root"       => plugins_url( '', __FILE__ )."/",
			"this-dir"        => plugin_dir_path( __FILE__ ),
			"this-file"       =>  __FILE__,
			"settings-id"     => "automate-everything-settings-data",
			);

			// Create storage folder
			if ( ! empty( ( wp_upload_dir() )['basedir'] ) ) {
					if ( ! file_exists( self::$plugin_data["save-dir"] ) ) {
					wp_mkdir_p( self::$plugin_data["save-dir"] );
				}
			}

			/* Add Admin Section */
			add_action('admin_menu' , [$this, "init_admin_menu_and_page"]);
			add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
			require_once(self::$plugin_data['this-dir'] . 'base/tasker-base.php');
			foreach( glob( self::$plugin_data['this-dir'] . 'modules/*/*.php' ) as $file ) {
				require_once($file);
			}

	} // ctor

	/* Attach Automate Everything Menu Option to WP Dashboard
	 *
	 * @since 1.0.0
	 * 
	 */
	public function init_admin_menu_and_page() {

		$icon_url = plugins_url('images/task-runner-icon.svg', __FILE__);
		add_menu_page(self::$plugin_data['name'], self::$plugin_data['name'], 'administrator', self::$plugin_data['slug'], array($this, 'init_admin_page'), $icon_url);
	
	}


	/**
	 * enqueue all the javascript into the runner admin page
	 *
	 * @since 1.0.0
	 */  
	function enqueue_scripts($hook){

		if('task-runner' != $hook && 'toplevel_page_'.self::$plugin_data['slug'] != $hook) { return; }

		// Tasker Core system files
		wp_enqueue_style( "web-disrupt-task-runner-base-styles", self::$plugin_data['this-root'] .'base/tasker-base.css');
		wp_enqueue_script( "web-disrupt-task-runner-base", self::$plugin_data['this-root'] .'base/tasker-base.js');

		// Core Components
		foreach( glob( self::$plugin_data['this-dir'] . 'base/components/*.js' ) as $file ) {
			wp_enqueue_script( $file, str_replace(self::$plugin_data['this-dir'], self::$plugin_data['this-root'], $file), ['web-disrupt-task-runner-base']);
		}

		// Extension Modules (Actions)
		foreach( glob( self::$plugin_data['this-dir'] . 'modules/*/*.js' ) as $file ) {
			wp_enqueue_script( $file, str_replace(self::$plugin_data['this-dir'], self::$plugin_data['this-root'], $file), ['web-disrupt-task-runner-base']);
		}

		// Ace Editor configuration
		wp_enqueue_script( "web-disrupt-version-of-ace-editor", self::$plugin_data['this-root'] .'base/3pl/ace-editor/ace.js');
		wp_enqueue_script( "web-disrupt-version-of-ace-editor-tomorrow-night", self::$plugin_data['this-root'] .'base/3pl/ace-editor/ace-tomorrow-night.js', ["web-disrupt-version-of-ace-editor"]);
		wp_enqueue_style( "web-disrupt-version-of-ace-editor-tomorrow-night-styles", self::$plugin_data['this-root'] .'base/3pl/ace-editor/ace-tomorrow-night.css');
		//wp_enqueue_script( "web-disrupt-version-of-ace-editor-ext-language-tools", self::$plugin_data['this-root'] .'base/3pl/ace-editor/ext-language-tools.js');

		// Select-2
		wp_enqueue_style( "web-disrupt-select-2-styles", self::$plugin_data['this-root'] .'base/3pl/select-2/select-2.min.css');
		wp_enqueue_script( "web-disrupt-select-2-js", self::$plugin_data['this-root'] .'base/3pl/select-2/select-2.min.js');

	}

	/**
	 * Render the layout and setup data for settings page
	 *
	 * @since 1.0.0
	 */  		
	public function init_admin_page() {

		$data = array(
			"name" => self::$plugin_data["name"],
			"version" => self::$plugin_data["version"],
			"desc" => self::$plugin_data["description"],
			"author" => self::$plugin_data["author"],
			"root" => self::$plugin_data['this-root'],
			"dir" => self::$plugin_data['this-dir'],
			"logo" => self::$plugin_data["logo"],
			"library" => $this->load_library_tasks()
		);

		$this->load_template( self::$plugin_data["this-dir"].'templates/settings', $data );

	}

	/**
	* Loads all Built-in Library Tasks
	*
	* @since  1.0.0
	*/
	public function load_library_tasks(){
		$library = [];
		ob_start();
		foreach( glob( self::$plugin_data['this-dir'] . 'library/*.txt' ) as $file ) {
          	array_push($library, file_get_contents($file));
		}
		ob_flush();
		return $library;		
	}



	/**
	* Loads a PHP Rendered Template
	*
	* The filename is the full path Directory path without the ".php"
	* Use the $data parameter to pass data into each template as needed
	*
	* @since  1.0.0
	* @param  string $name is the template name.
	* @param  array  $data extracted into variables & passed into the template. Must be key value pairs!
	*/
	public function load_template($filename, $data = array()){
		if(isset($filename)){
			extract($data);
			require $filename.".php";
		}
	}



    } // Core

    // Initialize the Web Disrupt Funnelmentals settings page
    Core::init();

}