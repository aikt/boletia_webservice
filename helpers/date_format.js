const getDateFormatBoletia = tiempo => new Promise( (resolve,reject) => {
    const tiempo_formated = tiempo.toISOString().split('.')[0];
    resolve(tiempo_formated)
} )

module.exports = {
    getDateFormatBoletia
}