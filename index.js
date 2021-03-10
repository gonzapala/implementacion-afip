'use stric'  // para poder usar nuevas funcionalidades de javascript
const fs = require('fs');

var express = require('express');
// var bodyParser = require('body-parser');//para convertir lo que llega a traves de las peticiones en un objeto json
var app = express();
var port = process.env.PORT || 3788; //toma una variabl de entorno, en este caso port
const { Wsaa, Wsfe } = require('./node_modules/afipjs');


var api = express.Router();
var productos_ruta = api.get('/test', 
    //acciones
    async function prueba(req, res) {
        var pem = fs.readFileSync('./storage/MiCertificado.pem', 'utf8')
        var key = fs.readFileSync('./storage/MiClavePrivada.pem', 'utf8')
        const conf = {
            prod: false,
            debug: true,
        }
        const wsaa = new Wsaa(conf)

        wsaa.setCertificate(pem)
        wsaa.setKey(key)
        console.log(wsaa.certificate)

        const tra = wsaa.createTRA()
        console.log(tra)
        
        
        // console.log('hola')
        // var wsaa = new Wsaa();
        // let miTRA = wsaa.createTRA();
        // const TA = await miTRA.supplyTA();

        // const wsfe = new Wsfe(TA);
        // const response = await wsfe.FEDummy({});
        // console.log(response);
        // res.status(200).send({
        //     message: 'probando controlador productos'
        // })
    }
);
//configurar rutas base (midleware)
app.use('/api', productos_ruta);


//configurar cabeceras y CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.listen(port, function () {
    console.log("Esta escuchando en el puerto: " + port + ". http://localhost:" + port + ".\n...\n");
});


