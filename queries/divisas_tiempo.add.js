const { psql_conection } = require('../database/connection')
const { getDateFormatBoletia } = require('../helpers/date_format');
const { addLogCloudwatch } = require('../logger/cloudwatch_log');
process.env.TZ = 'GMT';

/*
 TODO: Debido a que el servicio se actualiza por dia, se deja una variable tiempo
 que va por la fecha actual, esto para hacer pruebas de tiempo y simular que se esta actualizando
*/

const addDivisaTiempo = async (tiempo) => {
    var idNext = ""
    tiempo = await getDateFormatBoletia(new Date(tiempo)) // DESCOMENTAR ESTO POR QUE EL TIEMPO AL MENOS VA SER DAILY
    //tiempo = await getDateFormatBoletia(new Date()) // Dejar esto para probar simulaciones de tiempo diferente
    const objLastRowDivisa = await getLastRowDivisaTiempo
    console.log(objLastRowDivisa);
    if(objLastRowDivisa != false){
        const rowCountLastRow = objLastRowDivisa.rowCount
        var idNext = 0
        var tiempo_db = ""
        if(rowCountLastRow == 0){
            idNext = 1
            await insertRowDivisaTiempo(tiempo,idNext)
            return idNext
        } else{
            idNext = objLastRowDivisa.rows[0].id + 1 
            tiempo_db = await getDateFormatBoletia(objLastRowDivisa.rows[0].tiempo)
            if(tiempo != tiempo_db){
                 await insertRowDivisaTiempo(tiempo, idNext)
                 return idNext
            }else{
                console.log("Son la misma fecha");
                addLogCloudwatch(
                    "queries/divisas_tiempo/insert/time",
                    "No row inserted, because the time for last row of DB => " + tiempo_db + " are equal with time for API => " + tiempo
                );
                return false;
            }
        }
    }
}

const getLastRowDivisaTiempo = new Promise( (resolve, reject) => {
    psql_conection.connect( (err,client,release) => {
        client.query('SELECT id, tiempo FROM divisas_tiempo ORDER BY tiempo DESC LIMIT 1', (error, result) => {
            release()
            if (error) {
                addLogCloudwatch(
                    "queries/divisas_tiempo/insert/error",
                    "Error when select into table divisas_tiempo in Postgress: " + error
                );
                return resolve(false);
            }
            console.log("SIMOOON");
            return resolve(result)
        })
    })
})

const insertRowDivisaTiempo = (tiempo, id) => new Promise( (resolve, reject) => {
    psql_conection.query('INSERT INTO divisas_tiempo (tiempo) VALUES ($1)', [tiempo], (error, result) => {
        if (error) {
            addLogCloudwatch(
                "queries/divisas_tiempo/insert/error",
                "Error when insert into divisas_tiempo in Postgress: " + error
            );
            return resolve(false)
        }
        addLogCloudwatch(
            "queries/divisas_tiempo/insert/success",
            "New row inserted: tiempo => " + tiempo + " , id => " + id
        );
        return resolve(true);
    });
} )

module.exports = {  
    addDivisaTiempo,
    getLastRowDivisaTiempo
}