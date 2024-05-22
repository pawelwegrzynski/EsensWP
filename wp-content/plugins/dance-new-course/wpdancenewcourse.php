<?php
/*
Plugin Name: Nowe kursy startują
Description: Wyśwwietla kawelki nowe kursy starują.
Author: PWPROGRAMMING
Author URI: https://pwprogramming.pl/
Version: 1.0.0
*/

if ( ! class_exists('DanceNewCoursePlugin' ) ) {
    class DanceNewCoursePlugin
    {
        private $shortcodeName = 'dnace_new_course';

        public function Register()
        {

            add_action('wp_head', array(&$this, 'wp_head'));
            add_action('wp_footer', array(&$this, 'wp_footer'));
            add_shortcode($this->shortcodeName, [$this, 'Shortcode']);
        }

        function wp_head()
        {
            echo '<link rel="stylesheet" href="/wp-content/plugins/dance-new-course/css/style.css" />';
        }

        function wp_footer()
        {

        }

        public function Shortcode()
        {
            $str = '
            <div class="kafelki_center">
              <h2>Nowe kursy, starują!</h2> 
              <a href="index.php/aktualnosci-na-stronie-glownej/533-nowe-kursy-dla-dzieci" class="dziecko"></a> 
              <a href="index.php/aktualnosci-na-stronie-glownej/532-nowe-kursy-dla-mlodziezy" class="mlodziez"></a>
              <a href="index.php/aktualnosci-na-stronie-glownej/531-nowe-kursy-dla-par" class="pary"></a>
              <a href="index.php/aktualnosci-na-stronie-glownej/530-nowe-kursy-solo-lub-bez-wspolpartnera" class="solo">
              </a>
            </div>';
            //Return to display
            return $str;
        }
    }

    (new DanceNewCoursePlugin())->Register();
}