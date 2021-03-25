// vamos a jugar con la conexion de mongo
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer(); // esto crea un mini mongo server


const connect = async () =>{
    const uri = await mongod.getUri();
    const mongooseOptions = {
        useNewUrlParser: true,
        autoReconnect: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    }

    await mongoose.connect(uri,mongooseOptions);
}

const closeDatabase = async () =>{
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
} // esto se va a ejecutar cuando acabe todos los test

const clearDatabase = async() =>{
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
} // esto se va a ejecutar cada vez que se ejecuta un test

module.exports = {
    connect,
    closeDatabase,
    clearDatabase
}
