const { psql_conection } = require('../database/connection');
const { addLogCloudwatch } = require('../logger/cloudwatch_log');

const addDivisaHasTiempo = async (divisa_id,tiempo_id) => {
    const resInsertRow = await insertRowDivisaHasTiempo(divisa_id,tiempo_id);
    if(resInsertRow!=false) return resInsertRow
    else return false
}

const insertRowDivisaHasTiempo = (divisa_id, tiempo_id) => new Promise( (resolve,reject) => {
    psql_conection.query('INSERT INTO divisas_has_tiempos (divisa_id,tiempo_id) VALUES ($1,$2)', [divisa_id,tiempo_id], (error, result) => {
        if (error) {
            addLogCloudwatch(
                "queries/divisas_has_tiempos/insert/error",
                "Error when insert into divisas_has_tiempos in Postgress: " + error
            )
            return resolve(false)
        }
        return resolve(true)
    })
})
module.exports = {
    addDivisaHasTiempo
}