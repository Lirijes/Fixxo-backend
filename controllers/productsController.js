const express = require('express')
//const products = require('../data/stimulated_database')
const productSchemas = require('../schemas/productSchemas')
const controller = express.Router()
//let products = require('../data/stimulated_database')


// nedan är kopplat till stimulated_database
/* controller.param("articleNumber", (req, res, next, articleNumber) => {
    req.product = products.find(x => x.articleNumber === articleNumber) // vi vill bara hämta produkter som har en tag
    next() // säger att den ska vidare till nästa steg annars fastnar den vid dena funktion
})
controller.param("tag", (req, res, next, tag) => {
    req.products = products.filter(x => x.tag == tag) 
    next()
}) */


// unsecured routes - kan hämtas av alla användare 

controller.route('/details/:articleNumber').get(async (req, res) => { //hämtar en specifik produkt
    const product = await productSchemas.findById(req.params.articleNumber)
    if(product) {
        res.status(200).json({
            articleNumber: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            tag: product.tag,
            imageName: product.imageName,
            rating: product.rating
        })
    }
    else
        res.status(404).json()
}) 

controller.route('/:tag').get(async (req, res) => { // hämtar en specifik tag
    let products = []
    const list = await productSchemas.find({ tag: req.params.tag })
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    }
    else
        res.status(404).json()
}) 

controller.route('/:tag/:take').get(async (req, res) => { //hämtar ett antal produkter från en tag
    const products = []
    const list = await productSchemas.find({ tag: req.params.tag }).limit(req.params.take)
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    }
    else
        res.status(404).json()
}) 

controller.route('/').get(async (req, res) => { //hämtar ALLA produkter
    let products = []
    const list = await productSchemas.find()
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    }
    else
        res.status(404).json()
})


// secured routes - kan endast nås av personer som är tex inloggade 
controller.route('/').post(async (req, res) => { // går till products routern för att posta en ny produkt
    const { name, description, price, category, tag, imageName, rating } = req.body // body är vår produkt med all information

    if (!name || ! price)
        res.status(400).json({text: 'name and price is required.'})

    const itemExists = await productSchemas.findOne({name}) //här kontrollerar vi om en produkt redan finns genom namnet
    if (itemExists)
        res.status(409).json({text: 'a product with the same name already exists.'})
    else {
        const product = await productSchemas.create({ // skapa produkt
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })
        if (product)
            res.status(201).json({text: `product with article number ${product._id} was created successfully `}) //om produkten finns så skickas den tbx 
        else   
            res.status(400).json({text: 'something went wrong when we tried to create the product'})
    }

})

controller.route('/:articleNumber').delete(async (req, res) => { // går till products routern för att deleta en produkt genom artikelnummer
    if(!req.params.articleNumber)
        res.status(400).json('please enter an article number')
    else {
        const product = await productSchemas.findById(req.params.articleNumber)
    
        if (product) {
            await productSchemas.remove(product)
            res.status(200).json({text: `Product ${product.name} with article number ${req.params.articleNumber} is deleted`})
        }
        else {
            res.status(404).json({text: `Product with article number ${req.params.articleNumber} was not found`})
        }
    }
})

controller.route('/:articleNumber').put(async (req, res) => {
    const { articleNumber, name, description, price, category, tag, imageName, rating } = req.body
    const updatedProduct = ({ articleNumber, name, description, price, category, tag, imageName, rating })
// const updatedProduct = await productSchemas.findByIdAndUpdate(req.params.articleNumber, updatedProduct, { new: true }) //en kod joakim brukar använda sig av, prova om tid finns
    const productExist = await productSchemas.findById(req.params.articleNumber)
    if (productExist) {
        const updateProduct = await productSchemas.updateOne({ _id: req.params.articleNumber }, updatedProduct)
        if (updateProduct)
            res.status(200).json({text: `product ${name} with articleNumber ${articleNumber} was updated`})
        else   
            res.status(400).json({text: 'something went wrong when we tried to update the product'})
    }
    return (updatedProduct)
})


module.exports = controller