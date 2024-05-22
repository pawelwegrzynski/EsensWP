<?php
//about theme info
add_action( 'admin_menu', 'pwprogramming_dance_studio_gettingstarted' );
function pwprogramming_dance_studio_gettingstarted() {    	
	add_theme_page( esc_html__('About Theme', 'pwprogramming-dance-studio'), esc_html__('About Theme',
        'pwprogramming-dance-studio'), 'edit_theme_options', 'pwprogramming_dance_studio_guide',
        'pwprogramming_dance_studio_mostrar_guide');
}

// Add a Custom CSS file to WP Admin Area
function pwprogramming_dance_studio_admin_theme_style() {
   wp_enqueue_style('custom-admin-style', get_template_directory_uri() . 'inc/getting-started/getting-started.css');
}
add_action('admin_enqueue_scripts', 'pwprogramming_dance_studio_admin_theme_style');

//guidline for about theme
function pwprogramming_dance_studio_mostrar_guide() { 
	//custom function about theme customizer
	$return = add_query_arg( array()) ;
	$theme = wp_get_theme( 'pwprogramming-dance-studio' );

?>

<div class="wrapper-info">
	<div class="col-left">
		<div class="intro">
			<h3><?php esc_html_e( 'Welcome to PW-PROGRAMMING Dance Studio Dance Studio WordPress Theme', 'pwprogramming-dance-studio' ); ?>
                <span>Version: <?php echo esc_html($theme['Version']);?></span></h3>
		</div>
		<div class="started">
			<hr>
			<div class="free-doc">
				<div class="lz-4">
					<h4><?php esc_html_e( 'Start Customizing', 'pwprogramming-dance-studio' ); ?></h4>
					<ul>
						<span><?php esc_html_e( 'Go to', 'pwprogramming-dance-studio' ); ?>
                            <a target="_blank" href="<?php echo esc_url( admin_url('customize.php') ); ?>">
                                <?php esc_html_e( 'Customizer', 'pwprogramming-dance-studio' ); ?> </a>
                            <?php esc_html_e( 'and start customizing your website', 'pwprogramming-dance-studio' );
                            ?></span>
					</ul>
				</div>
				<div class="lz-4">
				</div>
			</div>
			<p><?php esc_html_e( 'PW-PROGRAMMING Dance Studio is a bold, powerful, visually impressive and stylish 
			WordPress dance theme for dance clubs and studios, dance classes, martial art training classes, zumba classes, 
			aerobics classes, yoga centres and other physical training institutes. It is a fantastic theme with so much 
			potential to satisfy visitors with unending possibilities of designing. This theme is fully responsive 
			looking gorgeous on varying screen sizes without breaking. It is cross-browser compatible, translation ready, 
			SEO friendly and supports RTL writing. You can do profound customization through theme customizer to change 
			its colour, background, logo, menu, images etc. Large size sliders and banners will help you give the 
			website an attractive look. It has a beautifully designed gallery to show your talented work. The theme is 
			feathery light and loads with a lightning fast speed. It is rigorously tested with different plugins to 
			ensure its smooth compatibility with third party plugins. Social media icons will ease the process of 
			sharing your content on different networking platforms.', 'pwprogramming-dance-studio')?></p>
			<hr>			
			<div class="col-left-inner">
				<h3><?php esc_html_e( 'Get started with PW-PROGRAMMING Dance Studio Theme',
                        'pwprogramming-dance-studio' );
				?></h3>
				<img src="<?php echo esc_url(get_template_directory_uri()); ?>/inc/getting-started/images/customizer-image.png" alt="" />
			</div>
		</div>
	</div>
</div>
<?php } ?>