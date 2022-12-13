const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const controller = express.Router()
const userSchema = require('../schemas/userSchemas')
const { generateAccessToken } = require('../middlewares/authorization')

//unsecured routes
controller.route('/signup').post(async(req, res) => {
    const {firstName, lastName, email, password} = req.body

    if (!firstName || !lastName || !email || !password)
        res.status(400).json({text: 'all fields are required'})

    const userExists = await userSchema.findOne({email})
    if (userExists)
        res.status(400).json({text: 'email address already exists'})
    else {
        const salt = await bcrypt.genSalt(10) //vi saltar lösenordet 10 gånger dvs det krypteras typ
        const hashedPassword = await bcrypt.hash(password, salt) // här hashar vi lösenordet och det saltade lösenordet, så det krypteras ännu bättre
    
        const user = await userSchema.create ({ firstName, lastName, email, password: hashedPassword })
        
        if (user)
            res.status(201).json({text: 'welcome'})
        else 
            res.status(400).json({text: 'something went wrong'})
    }
})

controller.route('/signin').post(async(req, res) => {
    const {email, password} = req.body

    if (!email || !password)
        res.status(400).json({text: 'email and password is required'})

    const userExists = await userSchema.findOne({email})
    if (userExists && await bcrypt.compare(password, userExists.password)) { // här jämförs krypterade pw med användarens, typ..
        res.status(200).json({
            accessToken: generateAccessToken(userExists.id)
        })
    }
    else {
        res.status(400).json({text: 'incorrect email or password'})
    }
})

module.exports = controller