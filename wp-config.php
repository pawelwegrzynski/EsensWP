<?php
/** Enable W3 Total Cache */
define('WP_CACHE', true); // Added by W3 Total Cache

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'prezes55_wp9' );

/** MySQL database username */
define( 'DB_USER', 'prezes55_wp9' );

/** MySQL database password */
define( 'DB_PASSWORD', 'X[pcK#dolJliEx5xLW^63^,5' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'BmVHmXcgdnL1j7AdGshYBNJhcQ7MICR9TUjd0L2QcjqT07kQiMEy0OuWEj6MVno4');
define('SECURE_AUTH_KEY',  'jYdSH2hmx2kTmNtdGcNkxq1P3LO6PnAf26PVZjr084wPoquMVbWPq3Rx6lbyBKh4');
define('LOGGED_IN_KEY',    'Iqzoq6PGpgu0gvVorgAYRJqvsOagmT9o8NzmHBcpYjKTJ2I8mBYdWgOL567Xf3F7');
define('NONCE_KEY',        'qqkw1mk81SR21CePV40W4Ly5SpZD0ZO0tcV7VagljJI2nzWQltmL7ttoqUBbp7wy');
define('AUTH_SALT',        'Z8EE7SnDcHq9fe41WzjrIGx3mJ7kxyuSmnJAbSdFQr1QHXSSdR9fm01WHwVa0KGm');
define('SECURE_AUTH_SALT', 'SXbGZuPNgnA7LeJEFxtxgklRtap9QCXir2D9WswUlvwc9Ym9wxDdtwFRP95BtP1U');
define('LOGGED_IN_SALT',   'x3wGZGR9b3xGmTOyn7giKvO6CQQ3lVvJXTAKZro01Vt7ClPp9mf5Kb37bKBlnOja');
define('NONCE_SALT',       'Xm2xyuxrtFfEILtESAt9RIWo9fWXrbswXRzBV3UUi25XK5UlKwYXjJSM0bDLR35L');

/**
 * Other customizations.
 */
define('FS_METHOD','direct');
define('FS_CHMOD_DIR',0755);
define('FS_CHMOD_FILE',0644);
define('WP_TEMP_DIR',dirname(__FILE__).'/wp-content/uploads');

/**
 * Turn off automatic updates since these are managed externally by Installatron.
 * If you remove this define() to re-enable WordPress's automatic background updating
 * then it's advised to disable auto-updating in Installatron.
 */
define('AUTOMATIC_UPDATER_DISABLED', true);


/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', false );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once( ABSPATH . 'wp-settings.php' );
