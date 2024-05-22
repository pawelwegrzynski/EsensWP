<?php
/**
 * The sidebar containing the main widget area
 * @package WordPress
 * @subpackage pwprogramming-dance-studio
 * @since 1.0
 * @version 0.1
 */

if ( ! is_active_sidebar( 'sidebar-1' ) ) {
	return;
}
?>

<aside id="sidebar" class="widget-area" role="complementary" aria-label="sidebar1">
	<?php dynamic_sidebar( 'sidebar-1' ); ?>
</aside>