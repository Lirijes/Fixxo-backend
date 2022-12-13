const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: mongoose.Schema.Types.String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    category: {type: String},
    tag: {type: String},
    rating: {type: Number},
    imageName: {type: String}
})

module.exports = mongoose.model("products", productSchema) //inom "" är den collection som man går till, man kan ha flera st tex users men just nu ska den gå till products