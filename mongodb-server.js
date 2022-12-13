const mongoose = require('mongoose') //en provider för att kunna koppla sig till mongodb servern, ett api i sig självt som man kan använda sig utav för att komma åt funktionaliteten

const mongodbInit = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB is running at ${conn.connection.host}`)
}

module.exports = mongodbInit