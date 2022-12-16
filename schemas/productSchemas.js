const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: mongoose.Schema.Types.String, required: true},
    description: {type: String},
    price: {type: String, required: true}, //ska ändras till en string istället för att användas med graphql
    category: {type: String},
    tag: {type: String},
    rating: {type: String},
    imageName: {type: String},
    vendorId: { type: mongoose.Schema.Types.String, required: true }
})

module.exports = mongoose.model("Product", productSchema) //inom "" är den collection som man går till, man kan ha flera st tex users men just nu ska den gå till products