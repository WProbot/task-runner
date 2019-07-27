<?php get_header(); ?>
<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">
		<?php
		// Post Loop
		while ( have_posts() ) : the_post();

			/* Main Content */
            get_template_part( 'templates/content', 'standard' );
            
        endwhile;
        ?>
    </main>
</div>
<?php
get_footer();