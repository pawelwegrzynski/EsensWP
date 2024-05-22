<?php
/**
 * Template part for displaying page content in page.php
 * @package WordPress
 * @subpackage pwprogramming-dance-studio
 * @since 1.0
 * @version 0.1
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header role="banner" class="entry-header">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
		<?php pwprogramming_dance_studio_edit_link( get_the_ID() ); ?>
	</header>
	<div class="entry-content">
		<?php the_post_thumbnail(); ?>
		<div class="text-content"><?php the_content(); ?></div>
		<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'pwprogramming-dance-studio' ),
				'after'  => '</div>',
			) );
		?>
	</div>
</article>
