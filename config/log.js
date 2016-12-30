/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#!/documentation/concepts/Logging
 */

var winston = require('winston');

var logConfig = {
	'level': process.env.LOG_LEVEL || 'info',
	'colors': true,
	'prefix': false
};

if (process.env.NODE_ENV === 'production') {
	logConfig.level = 'error';
  logConfig.custom = new (winston.Logger)({
		'transports': [
			new (winston.transports.Console)({
				'level': process.env.LOG_LEVEL || 'error',
				'showLevel': false,
				'colorize': true,
				'timestamp': true,
				'json': false
			})
		]
	});
}

module.exports.log = logConfig;
