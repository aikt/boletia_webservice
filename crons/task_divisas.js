require('dotenv').config()
const cron = require('node-cron')
const axios = require('axios');
const { addLlamadaAPI } = require('../queries/llamadas_api.add');
const { addDivisaTiempo } = require('../queries/divisas_tiempo.add');
const { addDivisa } = require('../queries/divisas.add');
const { addDivisaHasTiempo } = require('../queries/divisas_has_tiempos.add');

console.log("--->"+process.env.CURRENCY_API_KEY);
//Producción

cron.schedule('*/'+process.env.CRON_TIME_MINUTES+' * * * *', function() {
  console.log("Cron task every " + process.env.CRON_TIME_MINUTES + " minute");
  axios
    .get(process.env.API_CURRENCY_HOST+process.env.API_EXCHANGE_LATEST+process.env.CURRENCY_API_KEY, { timeout: process.env.CRON_TIMEOUT_MILISECONDS })
    .then(res => {
      const duracion = Math.ceil(res.headers['x-execution-time']) // Milisegundos
      initProcessDivisa(duracion,res.data.meta.last_updated_at,res.data.data)
    })
    .catch(error => { // Registrar en 'llamadas_api' el fallo ocasionado
      addLlamadaAPI(false,error.config.timeout) 
  });
})
// Para pruebas
// cron.schedule('*/'+process.env.CRON_TIME_MINUTES+' * * * *', function() {
  // console.log('running a task every ' + process.env.CRON_TIME_MINUTES + " minute");
  // axios
  //   .get(process.env.API_CURRENCY_HOST, { timeout: process.env.CRON_TIMEOUT_MILISECONDS })
  //   .then(res => {
  //     //const duracion = Math.ceil(res.headers['x-execution-time']) // Milisegundos
  //     initProcessDivisa(10,res.data.meta.last_updated_at,res.data.data)
  //   })
  //   .catch(error => { // Registrar en 'llamadas_api' el fallo ocasionado
  //     addLlamadaAPI(false,error.config.timeout) 
  // })
// })

const initProcessDivisa = async (tiempo_api_duracion,tiempo_fecha_divisa,dataDivisa) => {
  await addLlamadaAPI(true,tiempo_api_duracion)
  const idRowDivisaTiempo = await addDivisaTiempo(tiempo_fecha_divisa)
  if(idRowDivisaTiempo!=false && idRowDivisaTiempo > 0){
    for(const item in dataDivisa){
      const element = dataDivisa[item]
      const code = element.code
      const value = element.value
      const idRowDivisa = await addDivisa(code,value)
      const idRowDivisaHasTiempo = await addDivisaHasTiempo(idRowDivisa, idRowDivisaTiempo)
    }
  }
}



  