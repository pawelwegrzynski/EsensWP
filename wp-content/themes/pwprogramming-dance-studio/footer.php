<?php
/**
 * The template for displaying the footer
 * @package WordPress
 * @subpackage pwprogramming-dance-studio
 * @since 1.0
 * @version 1.0
 */

echo do_shortcode("[dnace_new_course]");
echo do_shortcode("[dance_categories]");?>
	<footer id="colophon" class="site-footer" role="contentinfo">
        <div class="footer-top-color"></div>
		<div class="container">
			<?php get_template_part( 'template-parts/footer/footer', 'widgets' ); ?>
		</div>

		<div class="clearfix"></div>
		<div class="copyright"> 
			<div class="container">
				<?php get_template_part( 'template-parts/footer/site', 'info' ); ?>
			</div>
		</div>
	</footer>
		
<?php wp_footer(); ?>
</body>
</html>