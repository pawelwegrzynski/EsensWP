<?php
/**
 * Template Name: Page Full
 */

get_header(); ?>

    <main id="content" class="site-main" role="main">
        <?php if( get_theme_mod('nataraj_dance_studio_our_services_title') != '' ||get_theme_mod('nataraj_dance_studio_category_setting') != ''){ ?>
            <section id="our-services">
                <div class="container">
                    <div class="service-box">
                        <div class="service-title">
                            <?php if( get_theme_mod('nataraj_dance_studio_our_services_title') != ''){ ?>
                                <h3><?php echo esc_html(get_theme_mod('nataraj_dance_studio_our_services_title','')); ?></h3>
                            <?php }?>
                        </div>
                        <div class="row">
                            <?php $page_query = new WP_Query(array( 'category_name' => get_theme_mod('nataraj_dance_studio_category_setting','pwprogramming-dance-studio')));?>
                            <?php while( $page_query->have_posts() ) : $page_query->the_post(); ?>
                                <div class="col-lg-4 col-md-4 p-0">
                                    <div class="service-section">
                                        <div class="service-img">
                                            <?php the_post_thumbnail(); ?>
                                        </div>
                                        <div class="content">
                                            <h4><a href="<?php echo esc_url( get_permalink() );?>"><?php the_title();?></a></h4>
                                            <p><?php $excerpt = get_the_excerpt(); echo esc_html( nataraj_dance_studio_string_limit_words( $excerpt,10 ) ); ?></p>
                                        </div>
                                    </div>
                                </div>
                            <?php endwhile;
                            wp_reset_postdata();
                            ?>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </section>
        <?php }?>

        <?php do_action('nataraj_dance_studio_below_our_service_section'); ?>
        <div class="container">
            <?php echo do_shortcode("[URIS id=48]"); ?>

            <?php while ( have_posts() ) : the_post(); ?>
                <?php the_content(); ?>
            <?php endwhile; // end of the loop. ?>
        </div>
    </main>

<?php get_footer(); ?>