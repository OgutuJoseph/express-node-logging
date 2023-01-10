const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const expressWinston = require('express-winston');
const { transports, format } = require('winston');
require('winston-mongodb');

const newLogger = require('./logger');

/** env variables */
const port = process.env.PORT;
const mongodb = process.env.MONGO;

/** middleware for (handling) routes -- should be created before routes */
app.use(expressWinston.logger({
    winstonInstance: newLogger,
    statusLevels: true
}));

app.get('/', (req, res) => {
    newLogger.info('This is an info log.')
    res.sendStatus(200);
});

app.get('/400', (req, res) => {
    newLogger.warn('This is an warn log.')
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
            filename: 'logsInternalErrors.log'
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
