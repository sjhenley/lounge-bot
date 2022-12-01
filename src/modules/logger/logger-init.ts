import * as winston from 'winston';

const LOG_DIR = './logs';
const LOG_NAME = 'LoungeBotLogger';

const logFormat = winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

const fileLoggerOptions: winston.transports.FileTransportOptions = {
  filename: `${LOG_NAME}.log`,
  dirname: LOG_DIR,
  level: 'silly',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp(),
    logFormat
  )
};

const consoleLoggerOptions: winston.transports.ConsoleTransportOptions = {
  level: 'silly',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.timestamp(),
    logFormat
  )
};

winston.loggers.add(LOG_NAME, {
  transports: [
    new winston.transports.File(fileLoggerOptions),
    new winston.transports.Console(consoleLoggerOptions)
  ]
});

const logger = winston.loggers.get(LOG_NAME);

logger.info('Logger initialized');
export default logger;
