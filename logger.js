const { createLogger, transports, format } = require("winston");

const newLogger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({
            level: 'warn',
            filename: 'logsWarnings.log'
        }),
        new transports.File({
            level: 'error',
            filename: 'logsErrors.log'
        }),
        // new transports.MongoDB({
        //     db: mongodb,
        //     /** no need to specify collection name as below as it defaults 
        //      *  to a collection named: 'log'
        //      */
        //     collection: 'logs'
        // })
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.metadata(),
        format.prettyPrint()
    )
});

module.exports = newLogger;