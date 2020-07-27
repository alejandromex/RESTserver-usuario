const express = require('express');
const { verificaToken, verificaRole_Admin } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
const usuario = require('../models/usuario');

//Mostrar todas las categorias
app.get('/categoria',(req,res)=>{
    Categoria.find().sort('descripcion').populate('usuario','nomre email').exec((err,categorias)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Categoria.countDocuments((err,count)=>{
            res.json({
                ok:true,
                categorias,
                count
            });
        })

    })
      
});

//Mostrar una categoria por ID
app.get('/categoria/:id',(req,res)=>{
    //Categoria.findbyid
    let id = req.params['id'];

    Categoria.findById(id, function (err,categoria){
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoria)
        { 
            return res.status(400).json({
                ok:false,
                message: "No existe categoria"
            });
        }

        res.json({
            ok:true,
            categoria
        });


    });
    
});


//Crear una categoria por ID
app.post('/categoria',verificaToken,(req,res)=>{
    let categoria = new Categoria({
        descripcion: req.body['descripcion'],
        usuario: req.usuario._id,
    });
    categoria.save((err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                message: "No existe categoria"
            });
        }
        res.json({
            ok:true,
            categoria: categoriaDB,
        });
    })
    
});

//Edita una categoria
app.put('/categoria/:id',(req,res)=>{
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion,
    }
    Categoria.findByIdAndUpdate(id,descCategoria,{new:true, runValidators: true},(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                message: "No existe categoria"
            });
        }
        res.json({
            ok:true,
            categoria: categoriaDB,
        });

    });

});

//Elimina una categoria
app.delete('/categoria/:id',(req,res)=>{
    //Solo un administrador puede borrar categorias
    let id = req.params.id;
    Categoria.findOneAndRemove(id,[verificaToken, verificaRole_Admin],(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                message: "No existe categoria"
            });
        }
        res.json({
            ok:true,
            categoria: categoriaDB,
        });
    });
});






module.exports = app;