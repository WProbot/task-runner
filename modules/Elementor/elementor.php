<?php
namespace Web_Disrupt_Task_Runner;

class modules_Elementor{

  /**
	 * Main Constructor that sets up all static data associated with this plugin.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function __construct() {

    // Settings
    add_action("wp_ajax_task_runner_elementor_install_template", [$this, "install_template"]);

  }

  /**
	 * Create an Elementor post page and assign all metadata needed
	 *
	 * @since  1.0.0
	 * @return void
	 */
    public function install_template(){

        // Prepare Post data
        $post_title = $_POST['options'][0];
        $post_content = $_POST['options'][1];
        $elementorPlugin = get_plugin_data( "elementor/elementor.php", false, false);
        $post_body = array(
            'post_title'   => $post_title,
            'post_content' => $post_content,
        );
        $meta_data = [
            "_elementor_edit_mode" => "builder",
            "_elementor_template_type" => "post",
            "_wp_page_template" => 	"default",
            "_elementor_data" => $post_content,
            "_elementor_version" => $elementorPlugin['Version']
        ];

        // Save post and meta data
        $post_id = wp_insert_post( $post_body );

        foreach($meta_data as $key=>$value) 
        { 
            update_post_meta($post_id, $key, $value);
        }

        return "Template Installed successfully";

        wp_die();
        
    }

}

new modules_Elementor();