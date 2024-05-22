<?php get_header(); ?>

<main id="site-content" role="main">

	<div class="single-team-member-wrapper">

		<?php if (have_posts()) :

				while (have_posts()) :
				
					the_post();			

					$data = get_post_meta( get_the_ID(), 'teammember', true );
	?>
					<h1><?php the_title(); ?></h1>
					<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
						<div class="page-content">
							<?php the_post_thumbnail( 'medium' ); ?>
							<?php the_content(); ?>
						</div>
					</article>
					<div class="clear">
					</div>
					<ul class="teammember-social-icons">
						<?php if ( !empty($data['facebook_url']) ) : ?>
								<li>
									<a href="<?php echo esc_url( $data['facebook_url'] ); ?>" class="facebook"
										title="<?php _e( 'Follow on Facebook', 'showcase-your-team' ); ?>">
										<i class="fa fa-facebook" aria-hidden="true"></i>
									</a>
								</li>
						<?php endif; ?>
						<?php if ( !empty($data['twitter_url']) ) : ?>
								<li>
									<a href="<?php echo esc_url( $data['twitter_url'] ); ?>" class="twitter"
										title="<?php _e( 'Follow on Twitter', 'showcase-your-team' ); ?>">
										<i class="fa fa-twitter" aria-hidden="true"></i>
									</a>
								</li>
						<?php endif; ?>
						<?php if ( !empty($data['pinterest_url']) ) : ?>
								<li>
									<a href="<?php echo esc_url( $data['pinterest_url'] ); ?>" class="pinterest"
										title="<?php _e( 'Follow on Pinterest', 'showcase-your-team' ); ?>">
										<i class="fa fa-pinterest" aria-hidden="true"></i>
									</a>
								</li>
						<?php endif; ?>
					</ul>
					<?php edit_post_link( __( 'Edit', 'showcase-your-team' ), '<span class="edit-icon">', '</span>' ); ?>
			<?php				
					endwhile;
		?>
		<?php endif; ?>
		<h2><?php _e('Meet the Team', 'showcase-your-team') ?></h2>
    </div>
</main>

<?php get_footer(); ?>