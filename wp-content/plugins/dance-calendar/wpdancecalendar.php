<?php
/*
Plugin Name: Dance Calendar New
Description: Wyśwwietla nową wersję planu.
Author: PWPROGRAMMING
Author URI: https://pwprogramming.pl/
Version: 1.0.0
*/
if (!class_exists('DanceCalendarPluginn')) {
    class DanceCalendarPluginn
    {

        private $shortcodeName = 'dance_calendarn';

        public function Register()
        {

            add_action('wp_head', array(&$this, 'wp_head'));
            add_action('wp_footer', array(&$this, 'wp_footer'));
            add_action('wp_enqueue_scripts', [$this, 'Init']);
            add_shortcode($this->shortcodeName, [$this, 'Shortcode']);
        }

        function wp_head()
        {
            echo '<meta name="theme-color" content="#000000"/>
<meta name="description" content="Web site created using create-react-app"/>';
            echo $this->CreateCssStyles();
            echo '';

        }

        function wp_footer()
        {

        }

        public function Shortcode($atts = [], $content = null, $tag = '')
        {
            // normalize attribute keys, lowercase
            $atts = array_change_key_case((array)$atts, CASE_LOWER);

            // override default attributes with user attributes
            $wporg_atts = shortcode_atts([
                'defaultfilters' => '[ { "propertyName":"Address", "propertyFilters":[{"operator":"eq","value":"Robotnicza70j"}] },
		{"propertyName":"GroupDanceStyle","propertyFilters":[]}, { "propertyName":"StartDate",
		"propertyFilters":[{"operator":"lt","value":"new Date().toISOString()"}] } ]',
                'hiddenfilters' => '',
            ], $atts);
            //Build String
            $str = '<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="root" style="height:100%"></div>
        <div id="defaultFilters" style="display:none;">
            '.$wporg_atts['defaultfilters'].'
        </div>
	<div id="hiddenFilters" style="display:none;">
            '.$wporg_atts['hiddenfilters'].'
        </div>
<script>
        !function(e){function r(r){for(var n,a,i=r[0],c=r[1],l=r[2],s=0,p=[];s<i.length;s++)a=i[s],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&p.push(o[a][0]),o[a]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);for(f&&f(r);p.length;)p.shift()();return u.push.apply(u,l||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,i=1;i<t.length;i++){var c=t[i];0!==o[c]&&(n=!1)}n&&(u.splice(r--,1),e=a(a.s=t[0]))}return e}var n={},o={1:0},u=[];function a(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.e=function(e){var r=[],t=o[e];if(0!==t)if(t)r.push(t[2]);else{var n=new Promise((function(r,n){t=o[e]=[r,n]}));r.push(t[2]=n);var u,i=document.createElement("script");i.charset="utf-8",i.timeout=120,a.nc&&i.setAttribute("nonce",a.nc),i.src=function(e){return a.p+"static/js/"+({}[e]||e)+"."+{3:"e3adc10e"}[e]+".chunk.js"}(e);var c=new Error;u=function(r){i.onerror=i.onload=null,clearTimeout(l);var t=o[e];if(0!==t){if(t){var n=r&&("load"===r.type?"missing":r.type),u=r&&r.target&&r.target.src;c.message="Loading chunk "+e+" failed.\n("+n+": "+u+")",c.name="ChunkLoadError",c.type=n,c.request=u,t[1](c)}o[e]=void 0}};var l=setTimeout((function(){u({type:"timeout",target:i})}),12e4);i.onerror=i.onload=u,document.head.appendChild(i)}return Promise.all(r)},a.m=e,a.c=n,a.d=function(e,r,t){a.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,r){if(1&r&&(e=a(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(a.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)a.d(t,n,function(r){return e[r]}.bind(null,n));return t},a.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(r,"a",r),r},a.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},a.p="/",a.oe=function(e){throw console.error(e),e};var i=this.webpackJsonpcalendar=this.webpackJsonpcalendar||[],c=i.push.bind(i);i.push=r,i=i.slice();for(var l=0;l<i.length;l++)r(i[l]);var f=c;t()}([])</script>
        <script src="/wp-content/plugins/dance-calendar/static/js/2.3e5471af.chunk.js"></script>
        <script src="/wp-content/plugins/dance-calendar/static/js/main.60d59650.chunk.js"></script>';

            //Return to display
            return $str;
        }
        private function CreateCssStyles()
        {
            return '
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
    <link rel="apple-touch-icon" href="/wp-content/plugins/dance-calendar/logo192.png"/><link rel="manifest" href="/wp-content/plugins/dance-calendar/manifest.json"/>
    <link href=/wp-content/plugins/dance-calendar/static/css/main.6dea0f05.chunk.css" rel="stylesheet">';
        }
    }
    (new DanceCalendarPluginn())->Register();
    }
?>
