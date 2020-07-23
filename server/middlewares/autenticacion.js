const jwt = require('jsonwebtoken');

//============
// Verificar Token
//============

let verificaToken = (req,res,next) =>{
    let token = req.get('Authorization');
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err)
        {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    })
    
};

let verificaRole_Admin = (req,res,next) =>{
    let role = req.usuario.role;
    if(role == "USER_ROLE")
    {
        return res.status(401).json({
            ok:false,
            err: {
                message: 'Usuario no autorizado',
            },
        })
    }
    next();
}

module.exports = {
    verificaToken,
    verificaRole_Admin
};