<?php
/**
 * Custom header implementation
 */

function pwprogramming_dance_studio_custom_header_setup() {

	add_theme_support( 'custom-header', apply_filters( 'pwprogramming_dance_studio_custom_header_args', array(

		'default-text-color'     => 'fff',
		'header-text' 			 =>	false,
		'width'                  => 1200,
		'height'                 => 130,
		'wp-head-callback'       => 'pwprogramming_dance_studio_header_style',
	) ) );
}

add_action( 'after_setup_theme', 'pwprogramming_dance_studio_custom_header_setup' );

if ( ! function_exists( 'pwprogramming_dance_studio_header_style' ) ) :
/**
 * Styles the header image and text displayed on the blog
 *
 * @see pwprogramming_dance_studio_custom_header_setup().
 */
add_action( 'wp_enqueue_scripts', 'pwprogramming_dance_studio_header_style' );
function pwprogramming_dance_studio_header_style() {
	//Check if user has defined any header image.
	if ( get_header_image() ) :
	$custom_css = "
        #header,.page-template-custom-home-page #header .main-top{
			background-image:url('".esc_url(get_header_image())."');
			background-position: center top;
		}";
	   	wp_add_inline_style( 'pwprogramming-dance-studio-basic-style', $custom_css );
	endif;
}
endif; // pwprogramming_dance_studio_header_style
