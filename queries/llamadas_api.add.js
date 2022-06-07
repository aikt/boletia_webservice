const { psql_conection } = require('../database/connection')
const { getDateFormatBoletia } = require('../helpers/date_format')

const cloudwatch_logger = require('../logger/cloudwatch_log')
process.env.TZ = 'GMT';

const addLlamadaAPI = async (status,tiempo_duracion) => {
    const tiempo_ejecucion = await getDateFormatBoletia(new Date())
    const resOfInsertRow = await insertRowLlamadaAPI(status,tiempo_ejecucion, tiempo_duracion)
    return resOfInsertRow
}

const insertRowLlamadaAPI = (status,tiempo_ejecucion, tiempo_duracion) => new Promise( (resolve,reject) => {
    psql_conection.query('INSERT INTO llamadas_api (status, tiempo_ejecucion, tiempo_duracion) VALUES ($1, $2, $3)', [status, tiempo_ejecucion, tiempo_duracion], (error, result) => {
        if (error) {
            cloudwatch_logger.addLogCloudwatch(
                "queries/llamadas_api/insert/error",
                error.message    
            )
            return resolve(false)
        }
        cloudwatch_logger.addLogCloudwatch(
            "queries/llamadas_api/insert/success",
            "New row inserted: status =>" + status + " tiempo_ejecucion => " + tiempo_ejecucion + " tiempo_duracion_segundos => " + tiempo_duracion
        )
        return resolve(true)
    })
})

module.exports = {
    addLlamadaAPI
}