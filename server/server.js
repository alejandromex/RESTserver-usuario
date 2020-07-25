require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//Habilitar la carpeta public para acceder desde cualquier lugar
app.use(express.static( path.resolve(__dirname, '../public' )));

//Configuracion globales de rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then((resp) => { console.log('Connected to Mongo!!'); })
  .catch((error) => { console.log('Error connecting to Mongo', error); });


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});