


import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { setupLog } from './utils.js';

import { AccountRoutes } from './account.js';

const secretKey = "SecRETKey";
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());
var router = express.Router();
app.use(router);

//log
const log = setupLog();

//account routes
AccountRoutes('/account', router, log);

//basic routes
router.post('/login', function (req,res){
    if (req.body.user == 'joao' && req.body.pwd == '1234'){
        const id = 1;
        const token = jwt.sign({id}, secretKey, { expiresIn : 3600 });
        res.json(token);
    } 
    else{
        res.status(401).send();
    }
    
});

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

app.listen(port, () => {
    console.log('Curso do IGTI');
});



