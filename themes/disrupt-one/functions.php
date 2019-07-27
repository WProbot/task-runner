<?php 
/* Set out CSS */
function disrupt_one_enqueue_styles() {

    wp_enqueue_style( 'web-disrupt-one-style', get_stylesheet_directory_uri() . '/style.css', false, false);

}

/* Hooks into the WordPress Enqueue */
add_action( 'wp_enqueue_scripts', 'disrupt_one_enqueue_styles' );

/* Remove WP EMOJI - Not useful to anyone */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );