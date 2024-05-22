<?php
/*
Plugin Name: Showcase Your Team
Plugin URI: https://tishonator.com/plugins/showcase-your-team
Description: Add Your Team Members (Name, Photo, Bio, Social Links) from Admin Panel and Showcase Your Team with Mobile-Friendly and Responsive Grid with Fancy Hover Effect by Inserting a Widget, Shorcode or a Gutenberg Block.
Author: tishonator
Version: 1.0.1
Author URI: http://tishonator.com/
Contributors: tishonator
Text Domain: showcase-your-team
*/

require_once( 'team-members-widget.php' );

if ( !class_exists('tishonator_sytp_ShowcaseYourTeamPlugin') ) :

    /**
     * Register the plugin.
     *
     * Display the administration panel, insert JavaScript etc.
     */
    class tishonator_sytp_ShowcaseYourTeamPlugin {
        
    	/**
    	 * Instance object
    	 *
    	 * @var object
    	 * @see get_instance()
    	 */
    	protected static $instance = NULL;

        /**
         *  an array with all Slider settings
         */
        private $settings = array();

        /**
         * Constructor
         */
        public function __construct() {}

        /**
         * Setup
         */
        public function setup() {

            /**
             * Skip if PRO version is activated
             */
            if ( class_exists('tishonator_sytp_ShowcaseYourTeamProPlugin') )
                return;

            add_action( 'init', array(&$this, 'register_cpt_teammember') );

            add_action( 'save_post', array(&$this, 'save_teammember_fields') );

            add_action( 'add_meta_boxes_teammember',
                    array(&$this, 'teammember_add_custom_meta_boxes'), 10, 2 );

            add_action( 'init', array(&$this, 'register_scripts') );

            /* Filter the single_template with our custom function*/
            add_filter('single_template', array(&$this, 'load_single_cpt_teammember_template'));

            // register a shortcode to display team members
            add_action( 'init', array(&$this, 'register_shortcode') );

            // register a block to display team members
            add_action( 'init', array(&$this, 'register_block') );

            add_action( 'widgets_init', array(&$this, 'register_team_members_widget' ) );

            add_action('admin_notices', array(&$this, 'showcaseyourteam_admin_notice') );
        }

        /**
         * Register scripts used to display team members
         */
        public function register_scripts() {

            if ( !is_admin() ) {
                
                // FontAwesome
                wp_register_style('tishonator-sytp-font-awesome',
                    plugins_url('css/font-awesome.min.css', __FILE__), true);

                wp_enqueue_style( 'tishonator-sytp-font-awesome', plugins_url('css/font-awesome.min.css', __FILE__), array( ) );

                // Showcase Your Team CSS
                wp_register_style('tishonator-sytp-showcaseyourteam-css',
                    plugins_url('css/team-members.css', __FILE__), true);

                wp_enqueue_style( 'tishonator-sytp-showcaseyourteam-css', plugins_url('css/team-members.css', __FILE__), array( ) );

                // Showcase Your Team JS
                wp_register_script('tishonator-sytp-showcaseyourteam-js', plugins_url('js/team-members.js', __FILE__), array('jquery'));

                wp_enqueue_script('tishonator-sytp-showcaseyourteam-js',
                        plugins_url('js/team-members.js', __FILE__), array('jquery') );
            }
        }

        /**
         * Register Team Members custom post format
         */
        public function register_cpt_teammember() {

            $labels = array( 
                'name'               => __( 'Team Members', 'showcase-your-team' ),
                'singular_name'      => __( 'Team member', 'showcase-your-team' ),
                'add_new'            => __( 'Add New', 'showcase-your-team' ),
                'add_new_item'       => __( 'Add New Team Member', 'showcase-your-team' ),
                'edit_item'          => __( 'Edit Team Member', 'showcase-your-team' ),
                'new_item'           => __( 'New Team Member', 'showcase-your-team' ),
                'view_item'          => __( 'View Team Member', 'showcase-your-team' ),
                'search_items'       => __( 'Search Team Members', 'showcase-your-team' ),
                'not_found'          => __( 'No Team Members found', 'showcase-your-team' ),
                'not_found_in_trash' => __( 'No Team Members found in Trash', 'showcase-your-team' ),
                'parent_item_colon'  => __( 'Parent Team Member:', 'showcase-your-team' ),
                'menu_name'          => __( 'Team Members', 'showcase-your-team' ),
            );

            $args = array( 
                'labels'              => $labels,
                'hierarchical'        => false,     
                'supports'            => array( 'title',
                                                 'editor',
                                                 'excerpt',
                                                 'author',
                                                 'thumbnail',
                                                 'custom-fields',
                                                 'revisions'
                                                ),     
                'public'              => true,
                'show_ui'             => true,
                'show_in_menu'        => true,
                'show_in_nav_menus'   => true,
                'publicly_queryable'  => true,
                'exclude_from_search' => false,
                'has_archive'         => true,
                'query_var'           => true,
                'can_export'          => true,
                'rewrite'             => true,
                'capability_type'     => 'post',
                'menu_icon'           => 'dashicons-groups',
                'show_in_rest'        => true,
            );

            register_post_type( 'teammember', $args );
        }

        public function add_teammember_fields() {
            global $post;
            $data = get_post_meta($post->ID, 'teammember', true);
            ?>

            <input type="hidden" name="teammember_nonce" value="<?php echo wp_create_nonce( basename( __FILE__ ) ); ?>" />

            <table class="form-table">
                <tr valign="top">
                    <th scope="row">
                        <label for="facebook_url"><?php esc_html_e( 'Facebook URL', 'showcase-your-team' ); ?></label>
                    </th>
                    <td>
                        <div class="form-field form-required">          
                            <input type="text" name="facebook_url" value="<?php echo (isset($data[ 'facebook_url' ]) ? htmlspecialchars( esc_url( $data[ 'facebook_url' ] ) ) : ''); ?>"
                                placeholder="<?php echo esc_url('https://www.facebook.com/example'); ?>" />
                        </div>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">
                        <label for="twitter_url"><?php esc_html_e( 'Twitter URL', 'showcase-your-team' ); ?></label>
                    </th>
                    <td>
                        <div class="form-field form-required">          
                            <input type="text" name="twitter_url" value="<?php echo (isset($data[ 'twitter_url' ]) ? htmlspecialchars( esc_url( $data[ 'twitter_url' ] ) ) : ''); ?>"
                                placeholder="<?php echo esc_url('https://twitter.com/example'); ?>" />
                        </div>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">
                        <label for="pinterest_url"><?php esc_html_e( 'Pinterest URL', 'showcase-your-team' ); ?></label>
                    </th>
                    <td>
                        <div class="form-field form-required">          
                            <input type="text" name="pinterest_url" value="<?php echo (isset($data[ 'pinterest_url' ]) ? htmlspecialchars( esc_url( $data[ 'pinterest_url' ] ) ) : ''); ?>"
                                placeholder="<?php echo esc_url('https://www.pinterest.com/example'); ?>" />
                        </div>
                    </td>
                </tr>
            </table>
        <?php
        }

        function save_teammember_fields( $post_id ) {

            // only run this for courses
            if ( 'teammember' != get_post_type( $post_id ) )
                return $post_id;        

            // verify nonce
            if ( empty( $_POST['teammember_nonce'] )
                || !wp_verify_nonce( $_POST['teammember_nonce'], basename( __FILE__ ) ) )
                return $post_id;

            // check autosave
            if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
                return $post_id;

            // check permissions
            if ( !current_user_can( 'edit_post', $post_id ) )
                return $post_id;

            $data = array();

            if ( isset( $_POST[ 'facebook_url' ] ) ) {
                $data[ 'facebook_url' ] = esc_url_raw( $_POST['facebook_url'] );
            }

            if ( isset( $_POST[ 'twitter_url' ] ) ) {
                $data[ 'twitter_url' ] = esc_url_raw( $_POST['twitter_url'] );
            }

            if ( isset( $_POST[ 'pinterest_url' ] ) ) {
                $data[ 'pinterest_url' ] = esc_url_raw( $_POST['pinterest_url'] );
            }

            // save
            update_post_meta( $post_id, 'teammember', $data );
        }

        public function teammember_add_custom_meta_boxes( $post ) {

            add_meta_box( 'teammember_metabox', __('Team Member Information', 'showcase-your-team'),
                array(&$this, 'add_teammember_fields'), 'teammember' );
        }

        public function load_single_cpt_teammember_template($template) {

            global $post;
            /*
             * this is a 'teammember' post
             */
            if ( 'teammember' === $post->post_type ) {
                    /* 'single teammember template' is not found on
                     * theme or child theme directories, so load it
                     * from our plugin directory.
                     */
                if (locate_template( array( 'single-teammember.php' ) ) !== $template) {

                    return $template;
                }

                /*
                 * load template from plugin directory
                 */
                return plugin_dir_path( __FILE__ ) . 'single-teammember.php';
            }

            return $template;

        }

        public function register_shortcode() {

            add_shortcode( 'team-members', array(&$this, 'display_shortcode') );
        }


        public function display_shortcode($atts) {

            $result = '';

            $count = !empty($atts) && array_key_exists('count', $atts) && intval($atts['count']) > 0
                             ? intval($atts['count']) : '10';

            $teammembersArgs = array( 'post_type'       => 'teammember',
                                    'posts_per_page' => $count );
        
            $r = new WP_Query( $teammembersArgs );
        
            if ($r->have_posts()) :

                $result .= '<section id="teammembers-grid" class="clearfix">';

                while ( $r->have_posts() ) : $r->the_post();
            
                    $data = get_post_meta( $r->post->ID, 'teammember', true );

                    $result .= '<div class="team-member-item">';

                    $result .= '<div class="teammembers-tab" data-teammemberurl="'
                                    . esc_url( get_permalink() ) . '">';

                    $result .= '<div class="custom-row">';
                    
                    $result .= '<div class="effect effect-seven">';

                    $result .= get_the_post_thumbnail($r->post->ID, 'full');

                    $result .= '<div class="tab-text">';

                    $result .= '<h2>' . get_the_title() . '</h2>';

                    $result .= '<div class="icons-block">';

                    $socialIconIndex = 0;
                    
                    if ( !empty($data['facebook_url']) ) :

                        ++$socialIconIndex;
                        
                        $result .= '<a href="' . esc_url( $data['facebook_url'] )
                                        . '" title="' . __( 'Follow on Facebook', 'showcase-your-team' )
                                        . '" class="social-icon-' . $socialIconIndex
                                        . '" target="_blank"><i class="fa fa-facebook"></i></a>';
                    endif;

                    if ( !empty($data['twitter_url']) ) :

                        ++$socialIconIndex;
                        
                        $result .= '<a href="' . esc_url( $data['twitter_url'] )
                                        . '" title="' . __( 'Follow on Twitter', 'showcase-your-team' )
                                        . '" class="social-icon-' . $socialIconIndex
                                        . '" target="_blank"><i class="fa fa-twitter"></i></a>';
                    endif;

                    if ( !empty($data['pinterest_url']) ) :

                        ++$socialIconIndex;
                        
                        $result .= '<a href="' . esc_url( $data['pinterest_url'] )
                                        . '" title="' . __( 'Follow on Pinterest', 'showcase-your-team' )
                                        . '" class="social-icon-' . $socialIconIndex
                                        . '" target="_blank"><i class="fa fa-pinterest"></i></a>';
                    endif;

                    $result .= '</div>'; // .icons-block
                    $result .= '</div>'; // .tab-text
                    $result .= '</div>'; // .effect effect-seven
                    $result .= '</div>'; // .custom-row
                    $result .= '</div>'; // .teammembers-tab
                    $result .= '</div>'; // .team-member-item

                endwhile;

                $result .= '</section>'; // #teammembers-grid


                // Reset the global $the_post as this query will have stomped on it
                wp_reset_postdata();

            endif;

            return $result;
        }

        /*
         * Register Block
         */
        public function register_block() {
            
            // Showcase Your Team Block
            wp_register_script(
                'team-members-block',
                plugins_url('js/team-members-block.js', __FILE__),
                array( 'wp-blocks',
                       'wp-element',
                       'wp-data', )
            );

            register_block_type( 'team-members/team-members-block', array(
                'editor_script' => 'team-members-block',
                'render_callback' => array(&$this, 'team_members_callback'),
            ) );
        }
        
        public function team_members_callback( $attributes, $content ) {

            $result = '';

            $teammembersArgs = array( 'post_type' => 'teammember', 'posts_per_page' => 100);
                
            $r = new WP_Query( $teammembersArgs );
                
            if ( $r->have_posts() ) {

                $result .= '<section id="teammembers-grid" class="clearfix">';

                while ( $r->have_posts() ) : $r->the_post();
                
                        $data = get_post_meta( $r->post->ID, 'teammember', true );

                        $result .= '<div class="team-member-item"><div class="teammembers-tab" data-teammemberurl="' . esc_url( get_permalink() ) . '"><div class="custom-row">';
                        $result .= '<div class="effect effect-seven">';
                        $result .= '<img src="' . get_the_post_thumbnail_url(get_the_id(), 'full')
                                . '" alt="' . get_the_title() . '" class="anim-skip" />';
                        $result .= '<div class="tab-text"><h2>'. get_the_title() . '</h2>';

                        $result .= '<div class="icons-block">';

                        $socialIconIndex = 0;
                        
                        if ( !empty($data['facebook_url']) ) {

                            ++$socialIconIndex;
                            $result .= '<a href="' . esc_url( $data['facebook_url'] ) . '" '
                                       . 'title="' . __( 'Follow on Facebook', 'showcase-your-team' )
                                       . '" class="social-icon-' . $socialIconIndex
                                       . '" target="_blank"><i class="fa fa-facebook"></i></a>';
                        }

                        if ( !empty($data['twitter_url']) ) {

                            ++$socialIconIndex;
                            $result .= '<a href="' . esc_url( $data['twitter_url'] ) . '" '
                                       . 'title="' . __( 'Follow on Twitter', 'showcase-your-team' )
                                       . '" class="social-icon-' . $socialIconIndex
                                       . '" target="_blank"><i class="fa fa-twitter"></i></a>';
                        }

                        if ( !empty($data['pinterest_url']) ) {

                            ++$socialIconIndex;
                            $result .= '<a href="' . esc_url( $data['pinterest_url'] ) . '" '
                                       . 'title="' . __( 'Follow on Pinterest', 'showcase-your-team' )
                                       . '" class="social-icon-' . $socialIconIndex
                                       . '" target="_blank"><i class="fa fa-pinterest"></i></a>';
                        }

                        $result .= '</div></div></div></div></div></div>';

                endwhile;

                $result .= '</section>';
            }

            return $result;
        }

        /**
         * Register Showcase Your Team widget
         */
        public function register_team_members_widget() {

            register_widget( 'tishonator_sytp_TeamMembers_Widget' );
        }

        public function showcaseyourteam_admin_notice(){
            
            global $pagenow;
            
            /**
             * Display Admin Notice on 'Plugins' and 'Team Members' Pages
             */
            if ( $pagenow == 'plugins.php' || get_post_type() == 'teammember' ) { ?>

                <div class="notice notice-info is-dismissible"> 
                    <p><strong><?php _e('Thanks for using ShowcaseYourTeam Plugin. You can Upgrade to PRO version for more team members fields', 'showcase-your-team'); ?>:</strong></p>
                    <ol>
                        <li><?php _e('Position', 'showcase-your-team'); ?></li>
                        <li><?php _e('Additional Social Icons: LinkedIn, Instagram, YouTube', 'showcase-your-team'); ?></li>
                        <li><?php _e('Email and Phone', 'showcase-your-team'); ?></li>
                    </ol>
                    <a href="<?php echo esc_url('https://tishonator.com/plugins/showcase-your-team'); ?>" class="button-primary">
                        <?php _e('Upgrade to PRO', 'showcase-your-team'); ?>
                    </a>
                    <p></p>
                </div>
<?php
            }
        }

    	/**
    	 * Used to access the instance
         *
         * @return object - class instance
    	 */
    	public static function get_instance() {

    		if ( NULL === self::$instance ) {
                self::$instance = new self();
            }

    		return self::$instance;
    	}
    }

endif; // tishonator_sytp_ShowcaseYourTeamPlugin

add_action('plugins_loaded', array( tishonator_sytp_ShowcaseYourTeamPlugin::get_instance(), 'setup' ), 10);
