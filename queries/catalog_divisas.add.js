const { psql_conection } = require('../database/connection')
const { addLogCloudwatch } = require('../logger/cloudwatch_log')

const findOrAddDivisaName = async (name) => {
    const idCatalogDivisa = await getDataCatalogDivisaByName(name)
    var idRow = 0;
    if(idCatalogDivisa != false){
        if(idCatalogDivisa.rowCount == 0){
            const resInsertRow = await insertRowDivisaName(name)
            if(resInsertRow != false) return resInsertRow
            else return false
        }else{
            return idCatalogDivisa.rows[0].id
        }
    }else return false
}

const getDataCatalogDivisaByName = (name) => new Promise( (resolve,reject) => {
    psql_conection.query('SELECT id FROM catalog_divisas WHERE name = $1 LIMIT 1', [name], (error, result) => {
        if (error) {
            addLogCloudwatch(
                "queries/catalog_divisas/insert/error",
                "Error when select into table catalog_divisas in Postgress: " + error
            );
            return resolve(false);
        }
        return resolve(result)
    })
})

const insertRowDivisaName = (name) => new Promise( (resolve,reject) => {
    psql_conection.query('INSERT INTO catalog_divisas (name) VALUES ($1) RETURNING id', [name], (error, result) => {
        if (error) {
            addLogCloudwatch(
                "queries/catalog_divisas/insert/error",
                "Error when insert into catalog_divisas in Postgress: " + error
            )
            return resolve(false)
        }
        return resolve(result.rows[0].id)
    })
})

module.exports = {
    findOrAddDivisaName
}