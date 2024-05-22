<?php

if ( !class_exists('tishonator_sytp_TeamMembers_Widget') ) :

	/**
	 * Display team members with Widget
	 */
	class tishonator_sytp_TeamMembers_Widget extends WP_Widget {

		function __construct() {
			parent::__construct('tishonator-sytp-display-teammembers', __('Team Members', 'showcase-your-team'), 
								array( 'classname' => 'widget_tishonator_sytp_teammembers_entries',
								       'description' => __( "Display Team Member entries", 'showcase-your-team') )
							    );
			$this->alt_option_name = 'widget_tishonator_sytp_teammembers_entries';

			add_action( 'save_post', array($this, 'flush_widget_teammembers_cache') );
			add_action( 'deleted_post', array($this, 'flush_widget_teammembers_cache') );
			add_action( 'switch_theme', array($this, 'flush_widget_teammembers_cache') );
		}

		function widget($args, $instance) {
			$cache = wp_cache_get('widget_tishonator_sytp_teammembers_entries', 'widget');

			if ( !is_array($cache) )
				$cache = array();

			if ( ! isset( $args['widget_id'] ) )
				$args['widget_id'] = $this->id;

			if ( isset( $cache[ $args['widget_id'] ] ) ) {
				echo $cache[ $args['widget_id'] ];
				return;
			}

			ob_start();
			extract($args);

			$title = ( array_key_exists( 'title', $instance ) && !empty( $instance['title'] ) ) ? esc_html__($instance['title']) : __( 'Showcase Your Team', 'showcase-your-team' );
			$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );
			$number = ( ! empty( $instance['number'] ) ) ? absint( $instance['number'] ) : 6;
			if ( ! $number )
	 			$number = 6;
				
			$teammembersArgs = array( 'post_type' 		=> 'teammember',
									   'posts_per_page' => $number
									  );

			$r = new WP_Query( $teammembersArgs );
			
			if ($r->have_posts()) :
	?>
			<?php echo $before_widget; ?>
			<?php if ( $title ) echo $before_title . $title . $after_title; ?>

				<section id="teammembers-grid" class="clearfix">

				<?php while ( $r->have_posts() ) : $r->the_post();
				
						$data = get_post_meta( $r->post->ID, 'teammember', true );
	?>
						<div class="team-member-item-widget">

						<div class="teammembers-tab" data-teammemberurl="<?php echo esc_url( get_permalink() ); ?>">
			                <div class="custom-row">
			                    <div class="effect effect-seven">
			                        <?php the_post_thumbnail( 'full' ); ?>
			                        <div class="tab-text">
			                            <h2><?php the_title(); ?></h2>
			                        <div class="icons-block">
			                        <?php $socialIconIndex = 0; ?>
			                        <?php if ( !empty($data['facebook_url']) ) : ?>

			                        		<?php ++$socialIconIndex; ?>
			                        		<a href="<?php echo esc_url( $data['facebook_url'] ); ?>"
			                        		   title="<?php _e( 'Follow on Facebook', 'showcase-your-team' ); ?>"
			                        		   class="social-icon-<?php echo $socialIconIndex; ?>"
			                        		   target="_blank">
			                        		   <i class="fa fa-facebook"></i>
			                        		</a>
									<?php endif; ?>
									<?php if ( !empty($data['twitter_url']) ) : ?>
									
											<?php ++$socialIconIndex; ?>
			                        		<a href="<?php echo esc_url( $data['twitter_url'] ); ?>"
			                        		   title="<?php _e( 'Follow on Twitter', 'showcase-your-team' ); ?>"
			                        		   class="social-icon-<?php echo $socialIconIndex; ?>"
			                        		   target="_blank">
			                        		   <i class="fa fa-twitter"></i>
			                        		</a>
									<?php endif; ?>
									<?php if ( !empty($data['pinterest_url']) ) : ?>

											<?php ++$socialIconIndex; ?>
			                        		<a href="<?php echo esc_url( $data['pinterest_url'] ); ?>"
			                        		   title="<?php _e( 'Follow on Pinterest', 'showcase-your-team' ); ?>"
			                        		   class="social-icon-<?php echo $socialIconIndex; ?>"
			                        		   target="_blank">
			                        		   <i class="fa fa-pinterest"></i>
			                        		</a>
									<?php endif; ?>
			                        </div>
			                       </div>
			                    </div>      
			                </div>
			            </div>

					</div>
	<?php			 endwhile; ?>
				</section>
			<?php echo $after_widget; ?>
	<?php
			// Reset the global $the_post as this query will have stomped on it
			wp_reset_postdata();

			endif;

			$cache[$args['widget_id']] = ob_get_flush();
			wp_cache_set('widget_tishonator_sytp_teammembers_entries', $cache, 'widget');
		}

		function update( $new_instance, $old_instance ) {
			$instance = $old_instance;
			$instance['title'] = sanitize_text_field($new_instance['title']);
			$instance['number'] = absint( $new_instance['number'] );
			$this->flush_widget_teammembers_cache();

			$alloptions = wp_cache_get( 'alloptions', 'options' );
			if ( isset($alloptions['widget_tishonator_sytp_teammembers_entries_entries']) )
				delete_option('widget_tishonator_sytp_teammembers_entries_entries');

			return $instance;
		}

		function flush_widget_teammembers_cache() {
			wp_cache_delete('widget_tishonator_sytp_teammembers_entries', 'widget');
		}

		function form( $instance ) {
			$title     = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : __( 'Showcase Your Team', 'showcase-your-team' );
			$number    = isset( $instance['number'] ) ? absint( $instance['number'] ) : 6;
	?>
			<p><label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php esc_html_e( 'Title:', 'showcase-your-team' ); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>" /></p>

			<p><label for="<?php echo $this->get_field_id( 'number' ); ?>"><?php esc_html_e( 'Number of teammembers to show:', 'showcase-your-team' ); ?></label>
			<input id="<?php echo $this->get_field_id( 'number' ); ?>" name="<?php echo $this->get_field_name( 'number' ); ?>" type="number" value="<?php echo esc_attr( absint($number) ); ?>" size="3" /></p>
	<?php
		}
	}

endif; // if ( !class_exists('tishonator_sytp_TeamMembers_Widget') ) :

?>