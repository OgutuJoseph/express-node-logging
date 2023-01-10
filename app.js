const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const expressWinston = require('express-winston');
const { transports, format } = require('winston');
require('winston-mongodb');

/** env variables */
const port = process.env.PORT;
const mongodb = process.env.MONGO;

/** middleware for (handling) routes -- should be created before routes */
app.use(expressWinston.logger({
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
    ),
    statusLevels: true
}));

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.get('/400', (req, res) => {
    res.sendStatus(400);
});

app.get('/500', (req, res) => {
    res.sendStatus(500);
});

app.get('/error', (req, res) => {
    throw new Error('This is a custom error.')
});

/** to format logs from error handling,  
 * using format.prettyPrint() will result in additional fields in the json,
 * below only returns the fields specified (/top level items) in the printf({}) function
*/
const myFormat = format.printf(({level, meta, timestamp}) => {
    return `${timestamp} ${level}: ${meta.message}`
})

/** middleware for (handling) errors -- should be created after routes but before express error handler */
app.use(expressWinston.errorLogger({
    transports: [
        new transports.File({
            filename: 'internalErrorLogs.log'
        })
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),        
        // format.prettyPrint()
        myFormat
    )
}))

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
