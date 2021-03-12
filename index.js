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
        //console.log(wsaa.certificate)
    
        const tra = wsaa.createTRA()
        //console.log(tra)
        
        //const ta = await tra.supplicateTA()
        //console.log(ta)


        const prev_ta = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
        '<loginTicketResponse version="1.0">\n' +
        '    <header>\n' +
        '        <source>CN=wsaahomo, O=AFIP, C=AR, SERIALNUMBER=CUIT 33693450239</source>\n' +
        '        <destination>SERIALNUMBER=CUIT 20405268206, CN=demo1</destination>\n' +
        '        <uniqueId>2272597095</uniqueId>\n' +
        '        <generationTime>2021-03-11T17:15:30.586-03:00</generationTime>\n' +
        '        <expirationTime>2021-03-12T05:15:30.586-03:00</expirationTime>\n' +
        '    </header>\n' +
        '    <credentials>\n' +
        '        <token>PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8c3NvIHZlcnNpb249IjIuMCI+CiAgICA8aWQgc3JjPSJDTj13c2FhaG9tbywgTz1BRklQLCBDPUFSLCBTRVJJQUxOVU1CRVI9Q1VJVCAzMzY5MzQ1MDIzOSIgZHN0PSJDTj13c2ZlLCBPPUFGSVAsIEM9QVIiIHVuaXF1ZV9pZD0iMTQ1MDAzOTAwNyIgZ2VuX3RpbWU9IjE2MTU0OTM2NzAiIGV4cF90aW1lPSIxNjE1NTM2OTMwIi8+CiAgICA8b3BlcmF0aW9uIHR5cGU9ImxvZ2luIiB2YWx1ZT0iZ3JhbnRlZCI+CiAgICAgICAgPGxvZ2luIGVudGl0eT0iMzM2OTM0NTAyMzkiIHNlcnZpY2U9IndzZmUiIHVpZD0iU0VSSUFMTlVNQkVSPUNVSVQgMjA0MDUyNjgyMDYsIENOPWRlbW8xIiBhdXRobWV0aG9kPSJjbXMiIHJlZ21ldGhvZD0iMjIiPgogICAgICAgICAgICA8cmVsYXRpb25zPgogICAgICAgICAgICAgICAgPHJlbGF0aW9uIGtleT0iMjA0MDUyNjgyMDYiIHJlbHR5cGU9IjQiLz4KICAgICAgICAgICAgPC9yZWxhdGlvbnM+CiAgICAgICAgPC9sb2dpbj4KICAgIDwvb3BlcmF0aW9uPgo8L3Nzbz4K</token>\n' +
        '        <sign>rTFO2nTMMg6BtqeqxWZJQK8aSm6CjS/whqXN6zgQNLsdgl8gceBXW/SkfYgDckHKwjJ/nxu7spH+SqtkYyzny3A4nHCpOgLjuWZVOml2bhNi31dEH8yQHH0ne15SIApyJ4NAfW6YOHfW8OIzOZwQfNnfwJeEQGlFKWWJ2INtKzw=</sign>\n' +
        '    </credentials>\n' +
        '</loginTicketResponse>'


        const ta = wsaa.createTAFromString(prev_ta)
        
        
        const wsfe = new Wsfe(ta);
        
        //para saber si el server esta funcionando bien
        // const response = await wsfe.FEDummy({});
        // console.log(response);
        
        //Obtiene los tipo de IVA
        // response2 = await wsfe.FEParamGetTiposIva({});
        // console.dir(response2, { depth: null });
        
        
        // Obtiene el numero del ultimo comprobate autrizado
        // response = await wsfe.FECompUltimoAutorizado({
        //     PtoVta:1,
        //     CbteTipo:11
        // });
        // console.dir(response, { depth: null });


        // Autoriza un comprobante
        const puntoDeVenta = 1
        const ultimoAutorizado = 3 //aqui va el valor obtenido en la funcion anterior
        const factura = {
            FeCAEReq:{
                FeCabReq:{
                    CantReg:1,
                    PtoVta:puntoDeVenta,
                    CbteTipo:11
                },
                FeDetReq:{
                    FECAEDetRequest:{
                        Concepto:1,
                        DocTipo:80,
                        DocNro:"23000000000",
                        CbteDesde:ultimoAutorizado + 1,
                        CbteHasta:ultimoAutorizado + 1,
                        CbteFch:'20210311',
                        ImpTotal:1.00,
                        ImpTotConc:0.00,
                        ImpNeto:1.00,
                        ImpOpEx:0.00,
                        ImpTrib:0.00,
                        ImpIVA:0.00,
                        MonId:"PES",
                        MonCotiz:1
                    }
                }
            }
        };

        response = await wsfe.FECAESolicitar(factura);
        console.dir(response, { depth: null });
        // en este response esta el CAE del comprobante obtenido 

        
        //Consulta un comprobante autorizado
        // response = await wsfe.FECompConsultar({
        //     FeCompConsReq:{
        //         PtoVta:1,
        //         CbteTipo:11,
        //         CbteNro:1,
        //     }
        // });
        // console.log(response);

        //Generando codigos de barras
        // este método solo sirve para el response de una solocitud de comprobante no desde
        // el response de consultar un comprobante autorizado pq es priomer response es 
        // {FECAESolicitarResult: {FeCabResp:{}, FeDetResp:{}} y el segundo es
        // FECompConsultarResult: {ResultGet: {}}
        console.log(wsfe.BarCodes(response));

        
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


