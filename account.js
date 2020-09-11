import fs from 'fs';
const accountsDbFilePath = './db/accounts.json';

export function AccountRoutes(base, router, log) {
        
    router.get(base, async (req, res, next) => {
        try{
            log.info('Get Conta');

            fs.readFile(accountsDbFilePath, (err, data) =>
            {
                res.send(data);
            });
        }
        catch(ex){
            log.error('Erro no processamento');
            next(ex);
        }
    });

    router.get(base + '/:id', async (req, res, next) => {
        try{
            log.info('Get Conta' + req.params.id);

            fs.readFile(accountsDbFilePath, (err, data) =>
            {
                var accountsDb  = JSON.parse(data);
                var result = accountsDb.filter(q=> q.id == req.params.id);

                if ( result.length == 1){
                    res.send(result[0]);
                }
                else{
                    res.status(401).send({
                        message: 'A conta não existe'
                    })
                }

                
            });
        }
        catch(ex){
            log.error('Erro no processamento');
            next(ex);
        }
    });

    router.post(base, async (req, res, next) => {
        try{
            
            let newId = 1;
            fs.readFile(accountsDbFilePath,  async (err,data) => {
                let accountsDb = null;
                try{
                    accountsDb = JSON.parse(data);
                }
                catch(ex){
                    accountsDb = [];
                }

                if ( accountsDb.length > 0){
                    newId = accountsDb.sort( (a,b) => b.id - a.id )[0].id + 1;
                }
    
                let newBalance = new Number(req.body.balance);
                
                var newAccount = {
                    id: newId,
                    name: req.body.name,
                    balance : Number.isNaN(newBalance) ? 0 : newBalance
                };
                
                //não pode haver conta com nome duplicado
                if (accountsDb.filter(q=> q.name == newAccount.name).length == 0 ){
                    accountsDb.push(newAccount);
                    try{
                        fs.writeFile(accountsDbFilePath, JSON.stringify(accountsDb), () => {
                            res.send(newAccount);
                        });
                    }
                    catch (fex){
                        res.send(fex);
                    }
                }
                else{
                    res.status(401).send({
                        message: 'O usuário já existe'
                    })
                }
            });
            
        }
        catch(ex){
            log.error('Erro no processamento');
            next(ex);
        }
    });

    router.put(base + '/deposit', async (req, res, next) => {
        log.info('Depositando na conta ' + req.body.id);
        req.data = { 'invalidValueMessage' : 'Valor Inválido para Depósito' };

        applyBalance(req, res, next, true);
    });

    router.put(base + '/withdraw', async (req, res, next) => {
        log.info('Depositando na conta ' + req.body.id);
        req.data = { 'invalidValueMessage' : 'Valor Inválido para Saque' };

        applyBalance(req, res, next, false);
    });
    
    router.delete(base, async (req, res, next) => {
        try{
            
            fs.readFile(accountsDbFilePath,  async (err,data) => {
                let accountsDb = null;
                try{
                    accountsDb = JSON.parse(data);
                }
                catch(ex){
                    accountsDb = [];
                }
                
                var filtered = accountsDb.filter(q=> q.id == req.body.id);
                

                if (filtered.length == 1){
                    var index = accountsDb.indexOf(filtered[0]);
                    accountsDb.splice(index, 1);
                   
                    try{
                        fs.writeFile(accountsDbFilePath, JSON.stringify(accountsDb), () => {
                            res.send({
                                id : req.body.id,
                                message: 'A conta foi excluida com sucesso'
                            });
                        });
                    }
                    catch (fex){
                        res.send(fex);
                    }
                }
                else{
                    res.status(404).send({
                        message: 'A conta não existe'
                    })
                }
            });
            
        }
        catch(ex){
            log.error('Erro no processamento');
            next(ex);
        }
    });
    

    function applyBalance(req, res, next, isDeposit ) {
        try {
            
            fs.readFile(accountsDbFilePath, async (err, data) => {
                let accountsDb = null;
                try {
                    accountsDb = JSON.parse(data);
                }
                catch (ex) {
                    accountsDb = [];
                }
                let newAmmount = new Number(req.body.ammount);
                var accResult = accountsDb.filter(q => q.id == req.body.id);

                //só pode haver uma conta com este id
                if (newAmmount <= 0) {
                    res.status(203).send({
                        message: req.data.invalidValueMessage
                    });
                }
                if (accResult.length == 1 && !Number.isNaN(newAmmount)) {
                    
                    if (!isDeposit){
                        newAmmount = -newAmmount;
                    }
                    accResult[0].balance += newAmmount;

                    if (accResult[0].balance < 0){
                        res.status(401).send({
                            message: 'A conta não pode ficar com saldo negativo'
                        });
                    }
                    else{
                        fs.writeFile(accountsDbFilePath, JSON.stringify(accountsDb), () => {
                            res.send(accResult);
                        });
                    }
                }
                else {
                    res.status(404).send({
                        message: 'A conta não existe'
                    });
                }
            });
        }
        catch (ex) {
            log.error('Erro no processamento');
            next(ex);
        }
    }
}
