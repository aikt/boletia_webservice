const { psql_conection } = require('../database/connection');
const { findOrAddDivisaName } = require('./catalog_divisas.add');
const { addLogCloudwatch } = require('../logger/cloudwatch_log');

const addDivisa = async (moneda,valor) => {
    const idDivisaName = await findOrAddDivisaName(moneda)
    if(idDivisaName != false){
        const resInsertRow = await insertRowDivisa(idDivisaName,valor)
        if(resInsertRow!=false) return resInsertRow
        else return false
    }else{
        addLogCloudwatch(
            "queries/divisas/insert/error",
            "Error when obtain the id of column catalog_divisa: "
        )
    }
}

const insertRowDivisa = (divisa_name_id,valor) => new Promise( (resolve,reject) => {
    psql_conection.query('INSERT INTO divisas (divisa_name_id,valor) VALUES ($1,$2) RETURNING id', [divisa_name_id,valor], (error, result) => {
        if (error) {
            addLogCloudwatch(
                "queries/divisas/insert/error",
                "Error when insert into divisas_tiempo in Postgress: " + error
            )
            return resolve(false)
        }
        return resolve(result.rows[0].id)
    })
})


module.exports = {
    addDivisa
}