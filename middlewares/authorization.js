const jwt = require('jsonwebtoken')

const generateAccessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { //med jwt secret kan vi dekryptera koden till skillnad från bcrypt
        expiresIn: '1d'
    }) 
}

module.exports = { generateAccessToken }