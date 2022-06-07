const { psql_conection } = require('../database/connection');
const { getDateFormatBoletia } = require('../helpers/date_format');
const { addLogCloudwatch } = require('../logger/cloudwatch_log');
const { getLastRowDivisaTiempo } = require('./divisas_tiempo.add');
process.env.TZ = 'GMT';

const getDivisasByName = async (name,finit, fend) => {
    var query = "";
    var resJson = {
        tiempo: ''
    }
    var idDate = 0;
    var resDataDivisasTiempo = ""
    if( ( finit == "all" && fend == "all" ) || ( fend == "" && finit == "" )){ //Los finit y fend estan pero ninguno tiene valor o no esta presente ninguno de ellos
        resDataDivisasTiempo = await getLastRowDivisaTiempo
    }else if(finit == "all" && fend == ""){ // Finit esta vacío y fend no esta presente
        query = " ORDER BY tiempo ASC LIMIT 1"
        resDataDivisasTiempo = await getDataFromDivisasTiempoByQuery(query)
    }else if(fend == "all" && finit == ""){ // Fend esta vacío y finit no esta presente
        query = " ORDER BY tiempo DESC LIMIT 1"
        resDataDivisasTiempo = await getDataFromDivisasTiempoByQuery(query)
    }else if((finit != "all" || finit != "") && (fend == "" || fend == "all")){ // Finit esta presente con valor de Date, pero fend no esta presente o esta vacío
        query = " WHERE tiempo >= $1 ORDER BY id ASC LIMIT 1";
        resDataDivisasTiempo = await getDataFromDivisasTiempoByQuery(query,[finit])
    }else if((fend != "all" || fend != "") && (finit == "" || finit == "all")){ // Fend esta presente con valor de Date, pero finit no esta presente o esta vacío
        query = " WHERE tiempo <= $1 ORDER BY id DESC LIMIT 1";
        resDataDivisasTiempo = await getDataFromDivisasTiempoByQuery(query,[fend])
    }else if(fend != "" && finit != ""){ // Ambos tienen valor
        query = " WHERE tiempo >= $1 AND tiempo <= $2 ORDER BY id DESC LIMIT 1"
        resDataDivisasTiempo = await getDataFromDivisasTiempoByQuery(query,[finit,fend])
    }
    if(resDataDivisasTiempo!=false){
        if(resDataDivisasTiempo.rowCount > 0){
            idDate = resDataDivisasTiempo.rows[0].id
            resJson["tiempo"] = resDataDivisasTiempo.rows[0].tiempo 
            if(name=="ALL"){
                const resAllDivisas = await selectAllDivisas
                if(resAllDivisas!=false){
                    if(resAllDivisas.rowCount > 0){
                        resJson["data"] = resAllDivisas.rows
                        return resJson
                    }else{
                        resJson["data"] = "Not data for the moment, try again in another time"
                        return resJson            
                    }
                }
            }else{
                const resDivisaByName = await selectByDivisa(name,idDate)
                if(resDivisaByName.rowCount > 0){
                    resJson["data"] = resDivisaByName.rows
                    return resJson
                }else{
                    resJson["data"] = "Divisa " + name + " not encountered or don't have data, try again in another time"
                    return resJson             
                }
                
            }
        }else{
            resJson["data"] = "Not data for the moment, try again in another time"
            return resJson
        }
    }
}

const getDataFromDivisasTiempoByQuery = (query,filters = []) => new Promise( (resolve,reject) => {
    psql_conection.query(
        'SELECT id,tiempo FROM divisas_tiempo'+query, filters ,(error, result) => {
        if (error) {
            addLogCloudwatch(
                "routes/divisas_tiempo/select/error",
                "Error when select into table divisas_tiempo to get last row in Postgress: " + error
            );
            return resolve(false);
        }
        return resolve(result)
    })
})

const getLastDateFromDivisaTiempo = new Promise ( (resolve,reject) => {
    psql_conection.query(
        'SELECT dvt.id, dvt.tiempo FROM divisas_tiempo as dvt ORDER BY dvt.tiempo DESC LIMIT 1', (error, result) => {
        if (error) {
            addLogCloudwatch(
                "routes/divisas_tiempo/select/error",
                "Error when select into table divisas_tiempo to get last row in Postgress: " + error
            );
            return resolve(false);
        }
        return resolve(result)
    })
})

const selectByDivisa = (name,divisa_tiempo_id) => new Promise( (resolve,reject) => {
    psql_conection.query(
        'SELECT div.valor, cdiv.name FROM divisas_has_tiempos as dht ' +
        'INNER JOIN divisas as div ON div.id = dht.divisa_id ' +
        'INNER JOIN catalog_divisas as cdiv ON cdiv.id = div.divisa_name_id ' +
        'WHERE cdiv.name = $1 AND dht.tiempo_id = $2 LIMIT 1', [name,divisa_tiempo_id] ,(error, result) => {
        if (error) {
            addLogCloudwatch(
                "routes/divisas/select/error",
                "Error when select into table divisas to get divisa by name in Postgress: " + error
            );
            return resolve(false);
        }
        return resolve(result)
    })
})

const selectAllDivisas = new Promise( (resolve,reject) => {
    psql_conection.query(
        'SELECT div.valor, cdiv.name FROM divisas_has_tiempos as dht ' +
        'INNER JOIN divisas as div ON div.id = dht.divisa_id ' +
        'INNER JOIN catalog_divisas as cdiv ON cdiv.id = div.divisa_name_id ' +
        'WHERE dht.tiempo_id = ( SELECT MAX(tiempo_id) FROM divisas_has_tiempos) ORDER BY div.id ASC', (error, result) => {
        if (error) {
            addLogCloudwatch(
                "routes/divisas/select/error",
                "Error when select into table divisas to get last all divisas in Postgress: " + error
            );
            return resolve(false);
        }
        return resolve(result)
    })
})

module.exports = {
    getDivisasByName
}