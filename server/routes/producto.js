const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
let app = express();

let Producto = require('../models/producto');



//Obtener todos los productos
app.get('/productos',(req,res)=>{
    //trae todos los productos, populando usuario y categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({disponible: true})
            .skip(desde)
            .limit(5)
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .exec((err,productos)=>{
                if(err)
                {
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }
                res.json({
                    ok:true,
                    productos
                });
    })
});

//buscar productos
app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({nombre: regex}).populate('categoria','nombre').exec((err,prouctos)=>{
        if(err)
        {
            return res.status(500).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            productos
        });
    })
})


//obtener un producto por ID
app.get('/producctos/:id',(req,res)=>{
    let id = req.params.id;
    Producto.findById.populate('usuario','nombre email')
                    .populate('categoria', 'nombre')
                    .exec((id,(err,productoDB)=>{
        if(err)
        {
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!productoDB)
        {
            return res.status(400).json({
                ok:false,
                err: {
                    message: "No existe producto con ese id",
                },
            });
        }
        res.json({
            ok:true,
            productoDB
        });
    }))

});


//Crear un producto
app.post('/productos',verificaToken,(req,res)=>{
    let producto_body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: producto_body['nombre'],
        precioUni: producto_body['precioUni'],
        descripcion: producto_body['descripcion'],
        disponible: producto_body['disponible'],
        categoria: producto_body['categoria'],
    });
    producto.save((err,productoDB)=>{
        if(err)
        {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        res.status(200).json({
            ok:true,
            producto: productoDB
        })
    });
});


//Editar un producto
app.put('/productos/:id',(req,res)=>{
    let id = req.params.id;
    let body = req.body;
    Producto.findOneAndUpdate(id,(err,productoDB)=>{
        if(err)
        {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB)
        {
            return res.status(400).json({
                ok:false,
                message: "El ID no existe"
            })
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err,productoDB)=>{
            if(err)
            {
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            res.status(200).json({
                ok:true,
                producto: productoDB
            })
        });

       
    })
});


//Eliminar un producto
app.delete('/productos/:id',(req,res)=>{
    let id = req.params.id;
    Producto.findById(id,(err,productoDB)=>{
        if(err)
            {
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
        if(!productoDB)
        {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        productoDB.disponible=false;
        productoDB.save((err,productoEliminado)=>{
            res.json({
                ok:true,
                productoDB,
                message: "Producto Eliminado",
            });
        })
    })
});








module.exports = app;