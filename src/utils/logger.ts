import winston, { format, transports } from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';


const logDirPath = path.join(__dirname, '../logs');
if (!existsSync(logDirPath)) {
  mkdirSync(logDirPath);
}

const logFormat = format.printf(info => { return `${info.timestamp} ${info.level}: ${info.message}`; });

const Logger = winston.createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // Set log file of level (info)
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDirPath}/info`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
    // Set log file of level (error)
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDirPath}/error`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

Logger.add(new transports.Console({
  format: format.combine(
    format.colorize(),
    format.simple(),
  )
}));

export const DebugLog = (msg: any) => {
  Logger.info(`🟧 [DEBUG] ${JSON.stringify(msg)}`);
}

export const InfoLog = (msg: any) => {
  Logger.info(`✅ [INFO] ${JSON.stringify(msg)}`);
}

export const ErrorLog = (msg: any) => {
  Logger.error(`❌ [ERROR] ${JSON.stringify(msg)}`);
}