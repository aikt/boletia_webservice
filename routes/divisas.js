const { Router } = require('express');
const router = Router()
const { getDateFormatBoletia } = require('../helpers/date_format');
const { getDivisasByName } = require('../queries/divisas.get');

router.get('/currencies/:currency', async (req,res) => {
    var divisa = req.params.currency
    var letters = /^[A-Za-z]+$/;

    if(divisa.match(letters)){
        if(divisa.length == 3){
            divisa = divisa.toUpperCase();
            const finit = req.query.finit;
            const fend = req.query.fend;
            var tinit = "";
            var tend = "";
            if(finit !== undefined){
                if(finit == ""){
                    tinit="all"
                }else{
                    if(new Date(req.query.finit).toString() == "Invalid Date") return res.status(400).send({ error: 'Bad Request: finit invalid format' });    
                    tinit = await getDateFormatBoletia(new Date(req.query.finit))    
                }
            }
            if(fend !== undefined){
                if(fend == ""){
                    tend="all"
                }else{
                    if(new Date(req.query.fend).toString() == "Invalid Date") return res.status(400).send({ error: 'Bad Request: fend invalid format' });    
                    tend = await getDateFormatBoletia(new Date(req.query.fend))
                }
            }
            getDivisasByName(divisa,tinit,tend).then( resDivisas => {
                return res.json(resDivisas)  
            })
        }else{
            res.status(400).send({ error: 'Bad Request: only 3 characters' });
        }
    }else{
        res.status(400).send({ error: 'Bad Request: only letters' });
    }
})
module.exports = router