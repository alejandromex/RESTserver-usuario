const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaRole_Admin } = require('../middlewares/autenticacion');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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



//Configuracion de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
 
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
 
}

  app.post('/google', async(req,res)=>{
    let token = req.body.idtoken;
    let googleUser = await verify(token);
    Usuario.findOne({email: googleUser.email},(err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(usuarioDB)
        {
            if(usuarioDB.google == false)
            {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Error al auntenticar',
    
                    },
                });
            }
            else{
                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD});
                res.json({
                    ok:true,
                    usuario: googleUser,
                    token,
                });
            }
           
        }
        else{
            //Si el usuario no existe en nuestra base de datos (CREAMOS NUEVO USUARIO)
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google =true; 
            usuario.password = ':)';

            usuario.save((err,usuarioDB) => {
                if(err)
                {
                    return res.status(500).json({
                        ok:false,
                    });
                }
            let token = jwt.sign({
                usuario: usuarioDB
            },process.env.SEED,{expiresIn: process.env.CADUCIDAD});
            
            res.json({
                ok:true,
                usuario: googleUser,
                token,
            });
            });
        }
        
    });

   
});




module.exports = app;