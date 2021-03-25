const uploadImage = require('../utils/storage');

module.exports = (req,res,next) => {

    if(process.env.NODE_ENV === "production"){
        if(!req.file) return next() //res.status(400).send({message:"no se envio ninguna imagen"});
        const url = uploadImage(req.file);
        req.body.photo = url;
    }else{
        if(!req.file) return next();
        req.body.photo = `${req.protocol}://${req.host}/${req.file.path }` 
        // en path viene la ubicacion del archivo dentro del servidor
    }
    next();
}