const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido',
};

const uniqueValidator = require('mongoose-unique-validator');

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true,'El campo nombre es necesario'],
    },
    email:{
        type: String,
        unique: true,
        required: [true,'El campo correo es necesario'],
    },
    password: {
        type: String,
        required: [true,'La contrasena es obligatoria'],
    },
    img:{
        type: String,
        required: false,
    },
    role:{
        type: String,
        required:true,
        default: 'USER_ROLE',
        enum: rolesValidos,
    },
    estado:{
        type: Boolean,
        default: true,
    },
    google:{
        type:Boolean,
        default: false,
    }
});

//Con esto retiramos el password
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

usuarioSchema.plugin(uniqueValidator,{
    message: '{PATH} debe de ser unico',
});


module.exports = mongoose.model('Usuario',usuarioSchema);