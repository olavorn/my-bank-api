import winston from 'winston';

export function setupLog() {
    const log = winston.createLogger({
        level: 'info',
        format: winston.format.simple(),
        defaultMeta: { service: 'user-service' },
        transports: [
            //
            // - Write all logs with level `error` and below to `error.log`
            // - Write all logs with level `info` and below to `combined.log`
            //
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
    });
    //winston format
    if (process.env.NODE_ENV !== 'production') {
        log.info(new winston.transports.Console({
            format: winston.format.simple(),
        }));
    }
    return log;
}