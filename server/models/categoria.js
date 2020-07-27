const mongoose = require('mongoose');

let Schema = mongoose.Schema;

// let rolesValidos = {
//     values: ['ADMIN_ROLE','USER_ROLE'],
//     message: '{VALUE} no es un rol valido',
// };

// const uniqueValidator = require('mongoose-unique-validator');

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true,'El campo descripcion es necesario'],
    },
    usuario: {
        type: String,
        required: [true,'El campo usuario es necesario'],
    },
});

module.exports = mongoose.model('Categoria',categoriaSchema);