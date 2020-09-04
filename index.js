

const express = require('express');
const winston = require('winston');

const port = 3000;
const app = express();

var router = express.Router();

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

if (process.env.NODE_ENV !== 'production') {
    log.info(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

router.get('/', async (req, res, next) => {
    try{
        log.info('Curso do IGTI');
        res.send('Hello World');
    }
    catch(ex){
        log.error('Erro no processamento');
        next(ex);
    }
});

router.get('/goError', async (req, res, next) => {
    try{
        throw new Error("API Error");
    }
    catch(ex){
        log.error('Erro no processamento.', ex);
        next(ex);
    }
});

app.use(router);

app.listen(port, () => {
    console.log('Curso do IGTI');
});
