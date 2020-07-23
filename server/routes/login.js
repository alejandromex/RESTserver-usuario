const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaRole_Admin } = require('../middlewares/autenticacion');


app.get('/login',verificaToken,(req,res)=>{

    let usuario = ({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
    });

    let body  = req.body;
    Usuario.findOne({
        email: body.email
    },(err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!usuarioDB)
        {
            return res.status(400).json({
                ok: false,
                err:{
                    message: '-Usuario- y/o contraseña es incorrectas',
                },
            });
        }

        if(!bcrypt.compareSync(body.password,usuarioDB.password))
        {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario y/o -contraseña- es incorrectas',
                },
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD});

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
});








module.exports = app;