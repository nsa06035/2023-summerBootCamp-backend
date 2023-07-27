const winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transport.File({filenaame: '/usr/src/app/logs/pp.log'}),
        new winston.transport.Console()
    ],
});

logger.info('Hello, Winston!');