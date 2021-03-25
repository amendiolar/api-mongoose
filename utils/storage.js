const {Storage} = require('@google-cloud/storage');

const storage = new Storage({
    projectId: "masterencode-a37b4",
    keyFilename: "service.json"
});

const bucket = storage.bucket("masterencode-a37b4.appspot.com");

module.exports = (file) =>{

    return new Promise((resolve,reject) =>{
        if(!file) reject("No hay ningun archivo");

        const newFilename = `${file.originalname}_${Date.now()}`; // esto va a renombrar el archivo

        const fileUpload = bucket.file(newFilename); // voy a crear un nuevo archivo

        const valid_mimetypes = ['image/jpeg', 'image/png']

        if(valid_mimetypes.indexOf(file.mimetype) === -1) reject ('Es necesario enviar un tipo valido')


        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype // que tipo de archivo voy a enviar
            }
        })

        blobStream.on('error', (error) => {
            reject(error)
        }) // si pasa un error la promesa debe regresar un error

        blobStream.on('finish', () => {
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media`
            resolve(url)
        }) // si todo sale bien regresame la url de mi archivo

        blobStream.end(file.buffer); // aqui comienza la transmision de datos del backend al bucket
    })
}


