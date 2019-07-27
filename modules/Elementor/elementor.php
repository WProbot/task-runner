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
    add_action("wp_ajax_task_runner_elementor_create_post", [$this, "create_post"]);

  }

  /**
	 * Create an Elementor post page and assign all metadata needed
	 *
	 * @since  1.0.0
	 * @return void
	 */
    public function create_post(){

        // Prepare Post data
        $post_id = $_POST['data']['postId'];
        $post_title = $_POST['data']['title'];
        $post_content = $_POST['data']['content'];
        $elementorPlugin = get_plugin_data( "elementor/elementor.php", false, false);
        $post_body = array(
            'ID'           => $post_id,
            'post_title'   => $post_title,
            'post_content' => '',
        );
        $meta_keys = [
            "_elementor_edit_mode" => "builder",
            "_elementor_template_type" => "post",
            "_wp_page_template" => 	"default",
            "_elementor_data" => $post_content,
            "_elementor_version" => $elementorPlugin['Version']
        ];

        // Save post and meta data
        wp_update_post( $post_body );
        foreach($meta_keys as $key=>$value) 
        { 
            update_post_meta($post_id, $key, $value);
        }

    }

}

new modules_Elementor();