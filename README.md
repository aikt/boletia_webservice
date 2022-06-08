# Reto Boletia Task & API

Descripción: 
- Cada cierto "n" minutos se va ejecutar un cron task solicitando la información a https://api.currencyapi.com/v3/latest?apikey={API_KEY}
y guardando la información en las tablas correspondientes.
- Devolver las divisas mediante un GET /currencies/{divisa}?{filtros} con validaciones que se iran describiendo en esta guía.

## Notas importantes

- La cuenta en currencyapi brinda 300 requests y la respuesta de las divisas se actualiza cada día, esto nos da un detalle para probar nuestros filtros de 
"finit" y "fend" del GET /currencies/{divisa}. 

  - #### Extracto de CurrencyAPI sobre las actualizaciones de las divisas

![Returns the latest exchange rates  The default base currency is](https://user-images.githubusercontent.com/16615287/172466171-eba8bc4e-6672-497f-a049-22cfb6f6eaf8.png)


Para hacer simulaciones de prueba, en nuestro archivo de /queries/divisas_tiempo.add.js comentar la linea 13:

```javascript
Linea 13 => tiempo = await getDateFormatBoletia(new Date(tiempo)) 
```

Y descomentar la linea 14:

```javascript
Linea 14 => tiempo = await getDateFormatBoletia(new Date())
```

- Debido al tiempo del CRON puede demorar mucho para hacer pruebas, así que si quieres que el proceso se corra manualmente cada vez que se inicie el servidor de Node.
  - En nuestro archivo de /crons/task_divisas.js descomentar la linea 12 y 23:

```javascript
Linea 12 => cron.schedule('*/'+process.env.CRON_TIME_MINUTES+' * * * *', function() {
Linea 23 => })
```
  - Con eso cada vez que corras npx nodemon index.js o node index.js el proceso se correra manualmente y así podras simular con mas comidad el escenario de los filtros de la fecha

## Configuraciones

- Renombrar el archivo .env.file a .env y dentro podemos encontrar:

| Key | Descripción |
| ------ | ------ |
| CRON_TIME_MINUTES | Tiempo en minutos para correr el cron task, default: 1 minuto |
| CRON_TIMEOUT_MILISECONDS | Tiempo en milisegundos que se usa como timeout en la petición del cron task, default: 60000 milisegundos |
| API_CURRENCY_HOST | URL Base del API de currency, default: https://api.currencyapi.com/v3/ |
| API_EXCHANGE_LATEST | Path de las ultimas divisas, default: latest?apikey= |
| CURRENCY_API_KEY | Valor del API Key obtenido del currency api |
| AWS_ACCESS_KEY_ID | Es el ID de AWS para conectarse y hacer acciones, default: AKIARQKHTJ7KZWRG2ALP |
| AWS_ACCESS_KEY_SECRET | Es el Secret de AWS para conectarse y hacer acciones, default: 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 |
| DB_DATABASE | Nombre de la base de datos, default: boletia, *comentado* |
| DB_USER | Nombre del usuario de la base de datos, default: boletia, *comentado* |
| DB_PASSWORD | Contraseña de la base de datos, default: password, *comentado* |
| DB_HOST | Host para conectarse al Postgres, default: postgres, *comentado* |
| DB_PORT | Puerto donde esta el Postgres, default: 5432, *comentado* |

## Pre-requisitos
 - Tener instalado NodeJS ( https://nodejs.org/en/download/ )

## Como correr el proyecto sin Docker

 - En la terminal ejecutar:

```sh
npm install
npx nodemon index.js
```
  - Visitar http://localhost:3000 y revisar si la respuesta es JSON
  - Listo, seguir leyendo para probar los escenarios de la ruta currencie y como usarlo con Docker

## Diagrama SQL

Link: https://drive.google.com/file/d/15rQrsh5Okd7KHHTVtPAfAbmqJ0erECKS/view?usp=sharing

Imagen: 

![Captura de Pantalla 2022-06-07 a la(s) 15 04 08](https://user-images.githubusercontent.com/16615287/172472276-0ab9a79e-7d3d-49d3-85f3-0555bfe4a80e.png)

## Esqueleto

- crons/task_divisas.js = Logica del cron donde cada cierto "n" tiempo en minutos ejecuta el currencyapi y guarda los valores en las tablas de la base de datos de Postgres
- database/sql_file = Archivo del SQL que lo usa el Docker para iniciar el contenedor de PostgresSQL ( Mas información en sección Docker )
- database/connection.js = Configuración para conectarse a la base de datos de Postgres
- helpers/date_format.js = Función donde se parsea la fecha y regresarlo en formato: 2021-10-28T20:15:00
- logger/cloudwatch_log.js = Configuración para conectarse a AWS y definir la función addLogCloudwatch para registrar logs en Cloudwatch. (Mas información en sección Cloudwatch)
- node_modules = Paquetes que instala el NodeJS, no tocar.
- queries/* = Se nombran la tabla y el metodo (add,select,insert,update,etc) Ej: divisas.add.js y cada archivo tiene las consultas queries
- routes/* = Se nombra la tabla de la base de datos y adentro tiene la logistica GET,POST,PUT,etc 
- Dockerfile = Configuración del Dockerfile usando node 16
- docker-compose.yml = Configuración usando el servicio de boletia_web y postgres


## Tablas SQL

- catalog_divisas: Esta tabla va guardar el nombre de cada divisa ej: MXN en la columna 'name' y con un id de auto incremento
- divisas: Esta tabla hace referencia a (catalog_divisas) en la columna 'divisa_name_id' y guarda el valor del precio de la divisa en 'valor', con un id de auto incremento
- divisas_tiempo: Esta tabla va guardar el tiempo obtenido del CurrencyAPI ej: 2022-06-06T23:59:59Z en la columna 'tiempo'
- divisas_has_tiempos = Esta tabla hace refrencia a (divisas) en la columna 'divisa_id' y (divisas_tiempo) en la columna 'tiempo_id'
- llamadas_api = Esta tabla guarda el status de la petición del api en la columna 'status' (BOOL), la fecha en que se ejecuto la peticion en 'tiempo_ejecucion' y cuanto tiempo en milisegundos duro la petición en 'tiempo_duracion'

## Logica Cron

Link: https://drive.google.com/file/d/1CHwmxOuLRTIXBpI7GRmW98VYo_9teeVz/view?usp=sharing

Imagen:


![Captura de Pantalla 2022-06-07 a la(s) 15 38 15](https://user-images.githubusercontent.com/16615287/172477961-000bbf06-257d-4b00-a510-a648a5a1949d.png)


## Ruta currencies

- Ruta: /currencies/{currency_name}?{filters}
- Type: GET
- Valores:
  - currency_name: Nombre del currency, si es "all" va ofrecer todas las divisas.
  - filters:
    -  finit = Formato YYYY-MM-DDThh:mm:ss
    -  fend = Formato YYYY-MM-DDThh:mm:ss
- Validadores:
  - No numeros /currencies/123:

    - ![Captura de Pantalla 2022-06-07 a la(s) 16 12 30](https://user-images.githubusercontent.com/16615287/172485676-e79d6c9b-8372-4d9c-9593-2a3278723c0d.png)

  - No mayor de 3 caracteres /currencies/lalo:

    - ![Captura de Pantalla 2022-06-07 a la(s) 16 12 41](https://user-images.githubusercontent.com/16615287/172485707-969628dd-2bc4-43e0-a335-deef2cad97a1.png)

  - Solo divisas existentes /currencies/LLL:

    - ![Captura de Pantalla 2022-06-07 a la(s) 16 13 42](https://user-images.githubusercontent.com/16615287/172485740-a1eba6bf-82ec-4598-b2ad-264202ac0e4a.png)

  - No información por el momento /currencies/MXN:

    - ![Captura de Pantalla 2022-06-07 a la(s) 16 14 58](https://user-images.githubusercontent.com/16615287/172485757-b8f5fbf7-e7f2-4cb6-90e2-0130b88e0e1f.png)

  - Fecha finit mal formato /currencies/all?finit=AñO-06-06T23:30:00:

    - ![Captura de Pantalla 2022-06-07 a la(s) 16 25 22](https://user-images.githubusercontent.com/16615287/172485793-077a6cd6-3582-465e-b167-b28bb6ae260d.png)

  - Fecha fend mal formato /currencies/all?fend=AñO-je-jeT23:30:00:

    - ![Captura de Pantalla 2022-06-07 a la(s) 16 25 33](https://user-images.githubusercontent.com/16615287/172485808-6b8bd5ec-bf40-498c-9c14-fc5ca722a6fb.png)

- Respuestas:
  -  Todas las divisas '/currencies/all' ( va ir por las divisas con la fecha mas reciente )::

      - ![all](https://user-images.githubusercontent.com/16615287/172495490-49266c52-4b41-4f4d-a68d-ae6c167f5c56.png)

  -  Todas las divisas '/currencies/all?finit=' con finit vacío ( va ir por las divisas con la fecha mas antigua ):

      - ![all_find](https://user-images.githubusercontent.com/16615287/172495538-f58cc621-b3fb-477e-8802-a7b0fc965afe.png)

  -  Todas las divisas '/currencies/all?fend=' con fend vacío ( va ir por las divisas con la fecha mas reciente ):

      - ![all_fend](https://user-images.githubusercontent.com/16615287/172495556-fd75418f-72e4-40cd-8e17-fd3562a3ad4d.png)

  -  Todas las divisas con valor en finit '/currencies/all?finit=2022-06-07T11:30:00' (va ir por las divisas con la primera fecha presente después del finit):

      - ![all_finit_value](https://user-images.githubusercontent.com/16615287/172495571-6552162c-f666-4609-993f-c64c05e7e14b.png)

  -  Todas las divisas con valor en finit '/currencies/all?fend=2022-06-07T23:30:00' (va ir por las divisas con la ultima fecha presente antes del fend):

      - ![all_fend_value](https://user-images.githubusercontent.com/16615287/172495580-c438a44b-7938-4b0a-b60b-de43a68ec697.png)

  -  Todas las divisas con valor en finit y fend '/currencies/all?finit=2022-06-07T11:30:00&fend=2022-06-07T23:30:00' (va ir por las divisas con la ultima fecha en el rango de finit y fend):

      - ![all_finit_fend_value](https://user-images.githubusercontent.com/16615287/172495594-2bd65cd8-d557-4e2a-a857-7bf289cba791.png)

  -  Todas las divisas con vacio en finit y fend '/currencies/all?finit=&fend=' ( va ir por las divisas con la fecha mas reciente ):

      - ![Captura de Pantalla 2022-06-07 a la(s) 17 54 30](https://user-images.githubusercontent.com/16615287/172496399-171306b7-21f0-48c5-a5f3-9227bdd03932.png)

-----------

  -  Divisa por nombre '/currencies/MXN' ( va ir por la divisa con la fecha mas reciente ):

      - ![mxn](https://user-images.githubusercontent.com/16615287/172497552-7f341919-7708-4083-a90c-654b0a9a3269.png)

  -  Todas las divisas '/currencies/MXN?finit=' con finit vacío ( va ir por la divisa con la fecha mas antigua ):

      - ![mxn_finit](https://user-images.githubusercontent.com/16615287/172497567-20bc8b5b-31ec-45bf-9e7c-62427c13defb.png)

  -  Todas las divisas '/currencies/MXN?fend=' con fend vacío ( va ir por las divisa con la fecha mas reciente ):

      - ![mxn_fend](https://user-images.githubusercontent.com/16615287/172497577-8fbcac1b-5185-43ce-9577-b9ba51bdcdb6.png)

  -  Todas las divisas con valor en finit '/currencies/MXN?finit=2022-06-07T11:30:00' (va ir por la divisa con la primera fecha presente después del finit):

      - ![mxn_finit_valu](https://user-images.githubusercontent.com/16615287/172497595-c8bb9803-2526-4c58-87e5-0e4e4b5fabc4.png)

  -  Todas las divisas con valor en finit '/currencies/MXN?fend=2022-06-07T23:30:00' (va ir por la divisa con la ultima fecha presente antes del fend):

      - ![mxn_fend_value](https://user-images.githubusercontent.com/16615287/172497621-70c7068a-1a13-4c47-b0ce-59a473164faa.png)

  -  Todas las divisas con valor en finit y fend '/currencies/all?finit=2022-06-07T11:30:00&fend=2022-06-07T23:30:00' (va ir por la divisa con la ultima fecha en el rango de finit y fend):

      - ![mxn_finit_fend_value](https://user-images.githubusercontent.com/16615287/172497642-790f898b-76f8-4038-af5a-95f581d1797b.png)

  -  Todas las divisas con vacio en finit y fend '/currencies/all?finit=&fend=' ( va ir por las divisas con la fecha mas reciente ):

      - ![mxn_finit_fend_empty](https://user-images.githubusercontent.com/16615287/172497657-170866c7-8349-425d-9870-20fa0322d438.png)

## Cloudwatch

  - Tener logs dentro de una aplicación puede ser muy estresante debido a:
    - Conectarse al servidor de nuestra aplicación para revisar los logs.
    - Testear linea por linea para dar con el error
    - Estresarse por solucionar rapido el error en producción ya que hay millones de usuarios esperando respuesta.

  - Para eso en nuestro aplicación implementamos el AWS SDK y con eso podemos mandar mensajes buenos, malos, warnings, etc a Cloudwatch mediante un grupo y streams.
  - Nuestro grupo es "Boletia" y los streams se dividen por el nombre de cada una de las tablas de bases de datos

  - Grupo Boletia en AWS:

    - ![Captura de Pantalla 2022-06-07 a la(s) 18 13 50](https://user-images.githubusercontent.com/16615287/172498389-4d3f7296-84ee-4967-b8a5-d4ec8183b27d.png)

  - Streams en Boletia en AWS:

    - ![Captura de Pantalla 2022-06-07 a la(s) 18 14 19](https://user-images.githubusercontent.com/16615287/172498427-f37b9374-3249-48cf-b962-08bbc5dad0bf.png)

  - Cada Stream genera sus propios mensajes, ej :

    - ![Captura de Pantalla 2022-06-07 a la(s) 18 15 46](https://user-images.githubusercontent.com/16615287/172498519-06be0d4a-a1f8-4876-a650-026867ceb2c8.png)

  - Con esto nuestra aplicación puede mandar mensajes a Cloudwatch y los desarrolladores pueden detectar rapido el cambio, pero viene otra gran pregunta:

## ¿ Cómo podemos darnos automaticamente cuenta de un error si hay miles de streams ?

R: Mediante el grupo, podemos crear filtros de metricas a nuestros streams, es decir mediante un texto podemos detectar algo simple como "status => false" y va buscarlo en nuestro streams
para así poder hacer un conteo total de cuantas veces encontro ese texto en un intervalo de tiempo que nosotros y mediante un limite de veces encontrado, podemos
mandar una alerta SNS a los correos correspondientes para así atacar rapidamente el error que esta pasando en vivo.

En este CloudWatch se agregan 2 reglas:

- La regla de detectar si la petición al currencyAPI esta fallando por ej: por timeout en nuestro stream -> dev/queries/llamadas_api/insert/success

![Captura de Pantalla 2022-06-07 a la(s) 18 33 39](https://user-images.githubusercontent.com/16615287/172500553-093caadb-4a46-4a00-b3ac-815b43c64493.png)

- La regla de detectar si la fecha del api y la ultima fecha de la base de datos son iguales ya que en un escenario mas real, esto nos sirve para saber si la petición que estamos haciendo no cambio en nada, el es stream -> dev/queries/divisas_tiempo/insert/time

![Captura de Pantalla 2022-06-07 a la(s) 18 33 44](https://user-images.githubusercontent.com/16615287/172500586-b93d93f1-3024-46d0-8cef-3a474792e6d5.png)

- A cada metrica se le configura una alarma que si en 1 minuto el filtro de texto se encontro mas de 5 veces con 1 datapoint y 1 evaluación de tiempo, va enviar un correo a un topico mediante SNS, aquí tenemos una grafica

![Captura de Pantalla 2022-06-07 a la(s) 12 34 55](https://user-images.githubusercontent.com/16615287/172500999-ab8fefe8-27f7-48ca-b51d-def53d40a30a.png)

- Correo de notificación de AWS:

![Captura de Pantalla 2022-06-07 a la(s) 18 38 28](https://user-images.githubusercontent.com/16615287/172501057-e67462e2-756c-4ee4-a2bb-7e534770dcc1.png)

## Docker

  - Con Docker le decimos adios a las dependencias de nuestra máquina, como analogía sería prestarle el Disco de Megaman a tu amigo y así a tu otro amigo y nomas la consola reproduce el contenido. 
  asi es lo mismo con Docker, tu creas una imagen con los paquetes y sus versiones y lo puedes compartir con tus compañeros de trabajo y ya nunca depender de los paquetes que instale la Windows, Mac, etc y 
  explotarnos la cabeza de que a Pedrito no le corre su proyecto. 
  
  - Beneficios:
    - Reducir tiempos de instalar paquetes en tu PC con las versiones adecuadas para correr el proyecto.
    - Evitar entender el proyecto con las configuraciones de los desarrolladores para correrlo.
    - Solo corre la imagen y listo, ya puedes desarrollar.
    - Los desarrolladores ya actualizan solo la imagen y los demas hacen pull, como un Github.

  - Lo que se hizo en este reto, fue crear un DockerFile con la version del node 16 que es LTS de la pagina oficial de NodeJS y se crean los comandos para que
    copie nuestro proyecto como imagen.
  - Se creo también un Docker Compose, que nos permite usar otros servicios para conectarlo en nuestra imagen, en este caso se usa la imagen de Postgres y la conectamos con nuestra aplicación, esto quiere decir que,
    ya no tenemos que instalar Postgres en nuestra maquina, si no que vamos a ir a descargarla y la vamos a conectar con nuestra aplicación.
    
  - ¿ Que se configuro ?
    - Un servicio con el nombre "boletia_web" donde expone la aplicación en el puerto 3001 conectado mediante puente al puerto 3000 de nuestra API
    - Un servicio de "postgres" donde se descarga la imagen de postgres, se le configura su usuario y password, se expone el puerto 5432 y se le pasa el archivo del SQL a la imagen para que instale nuestra base de datos. 
    
  - ¿ Como usar el Docker ?
    - Simple, tener descargado Docker https://docs.docker.com/get-docker/
    - Instarlo en tu maquina
    - En terminal, correr 'docker --version' y revisar si te devuelve la version.
    - En el proyecto correr 'docker-compose build' para construir nuestra imagen
    - Y para ejecutar nuestra imagen correr 'docker-compose up' 
    - Visitar http://localhost:3001 y si ves la respuesta JSON, significa que ya tienes levantada el API del Reto ;) !!

En la presentación se hara uso normal de la aplicación, cloudwatch, alarmas y correr la aplicación en Docker.
