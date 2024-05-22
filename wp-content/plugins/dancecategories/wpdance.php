<?php
/*
Plugin Name: Dance Categories
Description: Wyśwwietla kafelki z formami ruchu i stylami tanecznymi.
Author: PWPROGRAMMING
Author URI: https://pwprogramming.pl/
Version: 1.0.0
*/

if ( ! class_exists('DanceCategoriesPlugin' ) ) {
    class DanceCategoriesPlugin
    {

        private $shortcodeName = 'dance_categories';

        public function Register()
        {
            add_action('wp_head', array(&$this, 'wp_head'));
            add_action('wp_footer', array(&$this, 'wp_footer'));
            add_shortcode($this->shortcodeName, [&$this, 'Shortcode']);
        }

        function wp_head()
        {
            echo '<script src="https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.js"></script>';
            echo '<script src="https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js"></script>';
            echo '<link rel="stylesheet" href="/wp-content/plugins/dancecategories/css/kafelki.css" />';
        }

        function wp_footer()
        {

        }

        public function _no_pl($tekst)
        {
            $tabela = Array(
                //WIN
                "\xb9" => "a", "\xa5" => "A", "\xe6" => "c", "\xc6" => "C",
                "\xea" => "e", "\xca" => "E", "\xb3" => "l", "\xa3" => "L",
                "\xf3" => "o", "\xd3" => "O", "\x9c" => "s", "\x8c" => "S",
                "\x9f" => "z", "\xaf" => "Z", "\xbf" => "z", "\xac" => "Z",
                "\xf1" => "n", "\xd1" => "N",
                //UTF
                "\xc4\x85" => "a", "\xc4\x84" => "A", "\xc4\x87" => "c", "\xc4\x86" => "C",
                "\xc4\x99" => "e", "\xc4\x98" => "E", "\xc5\x82" => "l", "\xc5\x81" => "L",
                "\xc3\xb3" => "o", "\xc3\x93" => "O", "\xc5\x9b" => "s", "\xc5\x9a" => "S",
                "\xc5\xbc" => "z", "\xc5\xbb" => "Z", "\xc5\xba" => "z", "\xc5\xb9" => "Z",
                "\xc5\x84" => "n", "\xc5\x83" => "N",
                //ISO
                "\xb1" => "a", "\xa1" => "A", "\xe6" => "c", "\xc6" => "C",
                "\xea" => "e", "\xca" => "E", "\xb3" => "l", "\xa3" => "L",
                "\xf3" => "o", "\xd3" => "O", "\xb6" => "s", "\xa6" => "S",
                "\xbc" => "z", "\xac" => "Z", "\xbf" => "z", "\xaf" => "Z",
                "\xf1" => "n", "\xd1" => "N");

            return strtr($tekst, $tabela);
        }

        public function Shortcode()
        {


            $linkapi = "https://admin.esens.com.pl/EsensAdmin/rest/planFormyRuchyStyleTaneczne";
            //$linkapitest = "https://admin.esens.com.pl/EsensAdmin/rest/planFormyRuchyStyleTaneczne";
            $force_refresh = false; // dev
            $refresh = 360 * 60; // 6h
            $cache = __DIR__ . "/dane.json"; // make this file in same dir


            if(isset($_GET['refreshjson'])){
               if( $_GET['refreshjson'] == 1){
                    $refresh_json = '1';
                }
            }else{
                $refresh_json = '0';
            }
            if ($force_refresh || ((time() - filectime($cache)) > ($refresh) || 0 == filesize($cache)) || $refresh_json =='1') {
                // cache json results so to not over-query (api restrictions)
                $curl = curl_init($linkapi);
                curl_setopt($curl, CURLOPT_URL, $linkapi);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_USERPWD, "test:test123");
                curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                $headers = array();
                $headers["Accept"] = "application/json";
                $headers["Authorization"] = "Basic dGVzdDp0ZXN0MTIz";
                curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
                //for debug only!
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
                $handle = fopen($cache, 'wb') or die('no fopen');
                curl_setopt($curl, CURLOPT_FILE, $handle);
                $resp = curl_exec($curl);
                curl_close($curl);

                $string = file_get_contents($cache);
                $json_a = json_decode($string, true);


                $style_tancow = array();
                $style_tancow_forma_id = array();

                echo '<div id="app">
           <h2>Zapisz się</h2> 
        <div class="current-groups">
            <div class="module_round_box_outer">
      <div class="module_round_box">
        <div class="s5_module_box_1">
          <div class="s5_module_box_2">
           
            <div class="rgkafel">
              <div class="rgkafelinner">
            <ul id="kafelki" class="menu_kafle isotope">';


                foreach ($json_a as $key => $val) {
                    foreach ($val['dane'] as $key2 => $val2) {
                        $style_tancow[] = $val2['forma_ruchu_nazwa'];
                        $style_tancow_forma_id[] = $val2['forma_ruchu_id'];
                    }
                }
                $style_tancow_unique = array_unique($style_tancow);

                foreach ($style_tancow_unique as $key2 => $val2) {
                    $jpeg_nazwa = str_replace(' ', '-', $val2);

                    $no_pl = $this->_no_pl($jpeg_nazwa);
                    $no_pl_no_duze = strtolower($no_pl);
                    $forma_ruchu_link = str_replace('(','', $no_pl_no_duze);
                    $forma_ruchu_link1 = str_replace(')','', $forma_ruchu_link);

                    echo '<li id="' . $style_tancow_forma_id[$key2] . '" class="item-' . $style_tancow_forma_id[$key2] . ' isotope-item">
                                        <div>
            <div>
            <div style="background-image: url(&quot;/wp-content/plugins/dancecategories/img/' . $no_pl_no_duze . '.jpg&quot); height: 116px;">
            <div class="zapiszsie">
            <h2><a href="https://www.nowa1.esens.com.pl/' . $forma_ruchu_link1 . '">
            <span class="s5_h3_first">' . $val2 . '</span></a></h2>
            </div>
            </div>

                    <ul id="kafelki" class="menu_kafle">';
                    foreach ($json_a as $key => $val) {

                        foreach ($val['dane'] as $key3 => $val3) {

                            if ($val2 == $val3['forma_ruchu_nazwa']) {

                                $styl_nazwa = str_replace(' ', '-', $val3['styl_taneczny_nazwa']);
                                $styl_nazwa = str_replace('{', '', $styl_nazwa);
                                $styl_nazwa = str_replace('}', '', $styl_nazwa);
                                $styl_nazwa = $this->_no_pl($styl_nazwa);
                                $styl_nazwa = strtolower($styl_nazwa);


                                echo '
            <li class="item-list" >
            <h2><a href="https://www.nowa1.esens.com.pl/' . $forma_ruchu_link1. '/' . $styl_nazwa . '">
            <span class="s5_h3_first">' . $val3['styl_taneczny_nazwa'] . '</span></a></h2></li>';

                            }

                        }
                        ;

                    }
                    echo '</ul>';
                }

                echo "<div style=\"clear: both;\"></div>
                 </div>
                 </div>
            </li>
                </ul>
            </div>
            </div>
            <div style=\"clear:both; height:0px\"></div>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
       <script>
        jQuery(function() {
            jQuery('#kafelki').isotope({ layoutMode: 'masonry'});
            function rgqq()
            {
                jQuery('#kafelki').isotope('reLayout');
            }
            setTimeout(rgqq, 1000);
            }
            </script>";
            }

            else {

                $string = file_get_contents($cache);
                $json_a = json_decode($string, true);


                $style_tancow = array();
                $style_tancow_forma_id = array();
                echo '<div id="app">
           <h2>Zapisz się</h2> 
        <div class="current-groups">
            <div class="module_round_box_outer">
      <div class="module_round_box">
        <div class="s5_module_box_1">
          <div class="s5_module_box_2">
           
            <div class="rgkafel">
              <div class="rgkafelinner">
            <ul id="kafelki" class="menu_kafle isotope">';


                foreach ($json_a as $key => $val) {
                    foreach ($val['dane'] as $key2 => $val2) {
                        $style_tancow[] = $val2['forma_ruchu_nazwa'];
                        $style_tancow_forma_id[] = $val2['forma_ruchu_id'];
                    }
                }
                $style_tancow_unique = array_unique($style_tancow);

                foreach ($style_tancow_unique as $key2 => $val2) {
                    $jpeg_nazwa = str_replace(' ', '-', $val2);

                    $no_pl = $this->_no_pl($jpeg_nazwa);
                    $no_pl_no_duze = strtolower($no_pl);

                    echo '<li id="' . $style_tancow_forma_id[$key2] . '" class="item-' . $style_tancow_forma_id[$key2] . ' isotope-item"
>
                                        <div>
            <div>
            <div style="background-image: url(&quot;/wp-content/plugins/dancecategories/img/' . $no_pl_no_duze . '.jpg&quot); height: 116px;">
            <div class="zapiszsie">
            <h2><a href="https://www.nowa1.esens.com.pl/' . $no_pl_no_duze . '">
            <span class="s5_h3_first">' . $val2 . '</span></a></h2>
            </div>
            </div>
            <ul id="kafelki" class="menu_kafle">';


                    foreach ($json_a as $key => $val) {

                        foreach ($val['dane'] as $key3 => $val3) {

                            if ($val2 == $val3['forma_ruchu_nazwa']) {

                                $styl_nazwa = str_replace(' ', '-', $val3['styl_taneczny_nazwa']);

                                $styl_nazwa = $this->_no_pl($styl_nazwa);
                                $styl_nazwa = strtolower($styl_nazwa);


                                echo '
            <li class="item-list">
            <h2><a href="https://www.nowa1.esens.com.pl/' . $no_pl_no_duze. '/' . $styl_nazwa . '">
            <span class="s5_h3_first">' . $val3['styl_taneczny_nazwa'] . '</span></a></h2>
            </li>';


                            }

                        }

                    }
                    echo '</ul>';
                }

                echo "<div style=\"clear: both;\"></div>
                 </div>
                 </div>
            </li>
         </ul>
            </div>
            </div>
            <div style=\"clear:both; height:0px\"></div>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
       <script>
        jQuery(function() {
            jQuery('#kafelki').isotope({ layoutMode: 'masonry'});
            function rgqq()
            {
                jQuery('#kafelki').isotope('reLayout');
            }
            setTimeout(rgqq, 1000);
            }
            </script>";
            }
            }
        }
    (new DanceCategoriesPlugin())->Register();
    }