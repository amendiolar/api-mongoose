const express = require ('express');
const mongoose = require('mongoose');
const multer = require('multer');
const UserController = require('./controllers/UserController');
const manageFiles = require('./middlewares/manageFiles');

const app = express();
const MONGO_URI = "mongodb+srv://abel:prueba1234@mini-twitter.e5l8o.mongodb.net/apimongo?retryWrites=true&w=majority"
// const MONGO_URI = "mongodb://db:27017/apimongo"
// const MONGO_URI = `mongodb://db:27017/${process.env.MONGO_NAME}` //variable de entorno

const storage = process.env.NODE_ENV === "production" 
? multer.memoryStorage()
: multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads')
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}_${file.originalname}`)
    }
})

const mult = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // limite de 5 MB
    }
})

app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use('/uploads',express.static('uploads'))

if(process.env.NODE_ENV !== 'test'){
    mongoose.connect(MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
}

const db = mongoose.connection

db.on('error', function(err){
    console.log('Connection error', err)
})

db.once('open', function(){
    console.log('Connected to database!!')
})

app.get('/users', UserController.fetch)

app.post('/users', [mult.single('photo'), manageFiles] , UserController.create)
 /*   if(req.file){ // aqui viene el archivo con todos sus datos que nos manda multer
        const url = await storage(req.file); // aqui subo mi archivo a firebase
        req.body.photo = url // voy a guardar la url de la imagen en BD
    } */  // esto se movio a middleware de managefiles

app.get('/users/:id', UserController.findOne)

app.patch('/users/:id', [mult.single('photo'), manageFiles], UserController.update)

app.delete('/users/:id', UserController.remove)



app.listen(3000,() =>{
    console.log('Server ready!!')
})

module.exports = app;

