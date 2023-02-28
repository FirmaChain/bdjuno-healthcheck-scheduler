const WINSTON = require('winston');
const WINSTON_DAILY = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const logDirPath = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirPath)) {
  fs.mkdirSync(logDirPath);
}

const logFormat = WINSTON.format.printf(info => { return `${info.timestamp} ${info.level}: ${info.message}`; });

const Logger = WINSTON.createLogger({
  format: WINSTON.format.combine(
    WINSTON.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // Set log file of level (info)
    new WINSTON_DAILY({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDirPath}/info`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
    // Set log file of level (error)
    new WINSTON_DAILY({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDirPath}/error`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

Logger.add(new WINSTON.transports.Console({
  format: WINSTON.format.combine(
    WINSTON.format.colorize(),
    WINSTON.format.simple(),
  )
}));

const DebugLog = (msg) => {
  Logger.info(msg);
}

const InfoLog = (msg) => {
  Logger.info(`✅ [INFO] ${JSON.stringify(msg)}`);
}

const ErrorLog = (msg) => {
  Logger.error(`❌ [ERROR] ${JSON.stringify(msg)}`);
}

module.exports = {
  DebugLog, InfoLog, ErrorLog
}