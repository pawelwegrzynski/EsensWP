<?php
/*
Plugin Name: Dance Schedule
Description: Wyśwwietla starą wersję planu.
Author: PWPROGRAMMING
Author URI: https://pwprogramming.pl/
Version: 1.0.0
*/

if ( ! class_exists('DanceSchedulePlugin' ) ) {
    class DanceSchedulePlugin
    {
        private $shortcodeName = 'esens_plan';

        public function Register()
        {

            add_action('wp_head', array(&$this, 'wp_head'));
            add_action('wp_footer', array(&$this, 'wp_footer'));
            add_shortcode($this->shortcodeName, [$this, 'Shortcode']);
        }

        function wp_head()
        {
            echo '<script src="/wp-content/plugins/danece-schedule/js/esens-plan.min.js"></script>';
            echo '<script src="/wp-content/plugins/danece-schedule/js/Rozklad.js"></script>';
            echo '<script src="/wp-content/plugins/danece-schedule/js/tree.js"></script>';
            echo '<link rel="stylesheet" href="/wp-content/plugins/danece-schedule/css/rozklad_strona.css" />';
        }

        function wp_footer()
        {

        }

        public function Shortcode($atts = [], $content = null, $tag = '')
        {
            // normalize attribute keys, lowercase
            $atts = array_change_key_case((array)$atts, CASE_LOWER);
            $filtry = $atts[2];
            //Build String
            $linkprzedzmina = $filtry;
            $test = str_split($linkprzedzmina);

            $licznik = count($test);

            $dousuniecia = $licznik-6;
            foreach($test as $key => $val){
                if($key >=$dousuniecia){
                    unset($test[$key]);
                }
            }

            $new_link = implode($test);
            $new_link = str_replace("amp;","",$new_link);

            $link='https://plan.esens.com.pl/EsensPlan/getPlan.php?'.$new_link.'';
            $s = file_get_contents($link);
            $str = '<div id="plan_esens">'.$s.'</div>';
                //Return to display
            return $str;
        }
    }

    (new DanceSchedulePlugin())->Register();
}