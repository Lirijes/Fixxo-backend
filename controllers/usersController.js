const express = require('express')
const controller = express.Router()
let users = require('../data/stimulated_database')
const userSchema = require('../schemas/userSchemas')

controller.route('/').get(async (req,res) => {
    let users = []
    const list = await userSchema.find()
    if(list) {
        for(let user of list) {
            users.push({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password
            })
        }
        res.status(200).json(users)
    }
})

controller.route('/').post(async (req, res) =>{
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !email || !password)
        res.status(400).json({text: 'must contain name, email & password'})

    const userExists = await userSchema.findOne({email})
    if (userExists)
        res.status(409).json({text: 'a user with this email already exists'})
    else {
        const user = await userSchema.create({
            firstName,
            lastName,
            email, 
            password
        })
        if(user)
            res.status(201).json({text: `user ${firstName} is created`})
        else
            res.status(400).json({text: 'something went wrong'})
    }
})

controller.param("id", (req, res, next, id) => {
    req.user = users.find(user => user.id == id)
    next()
})

// http://localhost:5555/api/users
/* controller.route('/').post((httpRequest, httpResponse) => {
    let user = {
        id: (users[users.length -1])?.id > 0 ? (users[users.length -1])?.id +1 : 1,
        firstName: httpRequest.body.firstName,
        lastName: httpRequest.body.lastName,
        email: httpRequest.body.email,
        password: httpRequest.body.password
    }

    users.push(user)
    httpResponse.status(102).json(user)
}) */

/* controller.route('/').get((httpRequest, httpResponse) => {
    httpResponse.status(200).json(users)
}) */

// http://localhost:5555/api/users/1
controller.route("/:id").get((httpRequest, httpResponse) => {
    if (httpRequest != undefined)
        httpResponse.status(200).json(httpRequest.user)
    else   
        httpResponse.status(404).json()
})

controller.route("/:id").put((httpRequest, httpResponse) => {
    if (httpRequest.user != undefined) {
        users.forEach(user => {
            if (user.id == httpRequest.user.id) {
                user.firstName = httpRequest.body.firstName ? httpRequest.body.firstName : user.firstName
                user.lastName = httpRequest.body.lastName ? httpRequest.body.lastName : user.lasttName
                user.email = httpRequest.body.email ? httpRequest.body.email : user.email
            }
        })
        httpResponse.status(200).json(httpRequest.user)
    }
    else
        httpResponse.status(404).json()
})

controller.route("/:id").delete((httpRequest, httpResponse) => {
    if (httpRequest.user != undefined) {
        users = users.filter(user => user.id !== httpRequest.user.id)
        httpResponse.status(204).json()
    }
    else
        httpResponse.status(404).json()
})



module.exports = controller