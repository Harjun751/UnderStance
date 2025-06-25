const winston = require("winston");

const logger = winston.createLogger({
	transports: [
		new winston.transports.File({
			filename: "logs/error.log",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json(),
			),
			level: "error",
		}),
		new winston.transports.Console({
			level: "info",
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
	],
});

module.exports = logger;
