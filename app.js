const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const expressWinston = require('express-winston');
const { transports, format } = require('winston');

/** port */
const port = process.env.PORT;

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
        })
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),
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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
