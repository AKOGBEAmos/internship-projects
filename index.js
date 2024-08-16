const express = require('express')
const https = require('node:https');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const process = require('process');
const bodyParser = require('body-parser');
const initRoutes = require("./routes/web");
const config = require('dotenv').config()
var cors = require('cors')
const  db = require('./models');
const utils = require('./helpers/utils');
global.uploadFolder = __dirname; 



/* Defining app */
let app = express();
console.log('Setting heanders')
// Autoriser plusieurs origines
//const allowedOrigins = ['https://pnaff.onrender.com', 'http://localhost:3000'];

// app.use(cors({
//     origin: 'https://pnaff.onrender.com'
// }));
// app.use(cors({
//     origin: allowedOrigins
// }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: false }))


/* Logging */
console.log('Setting Logging')
morgan.token("host", function(req, res) {
    return req.headers['host']
})
morgan.token("custom", "HOST => :host, Version => :http-version,  (:method) :url , Status :status Content-lengh :res[content-length] - Temps de réponse :response-time ms")
if(process.env.NODE_ENV == "production") {
    //use the new format by name
    let accessLogStream = fs.createWriteStream(__dirname + '/logs/' + "access.log", {flags: 'a'});
    app.use(morgan("custom",{stream: accessLogStream}));
}
 else {
    app.use(morgan("dev")); //log to console on development
}
/* Variables et constantes */
console.log('Setting Variable')
const port = process.env.SERVER_PORT || 5000;
console.log('Port: '+port);

/* Connect and create tables */
console.log('Setting database');
(async ()=> {
    try {
        console.log("Initializing ...")
        await db.sequelize.sync({logging: console.log, alter: true, force: true});
        // requête Alter
        const result = await db.sequelize.query('SELECT * FROM users', { type: db.sequelize.QueryTypes.SELECT });
        const alterFromFile = await utils.executeSQLFile('db/alter/add_default_to_create_update.sql');
   
        //console.log(result);
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de l\'exécution de la requête SQL :', error);
    }
    
    console.log("Finished ...")
})()



/* Routes */
console.log('Setting Routes')
initRoutes(app);


console.log('Setting Server...')
console.log('Environnement:', process.env.NODE_ENV)
if (process.env.NODE_ENV != "production") {
    app.listen(port, function(err){
        if (err) console.log("Error in server setup")
        console.log("Server HTTP listening on Port", port);
    })
}else{
    const sslServer = https.createServer({
        key: fs.readFileSync(path.join(__dirname,'/certs','privkey.pem')),
        cert: fs.readFileSync(path.join(__dirname,'/certs','fullchain.pem'))
    },app);
    
    sslServer.listen(port,() => console.log('Server HTTPS listening on '+ port))
    
}