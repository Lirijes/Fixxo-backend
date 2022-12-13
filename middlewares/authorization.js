const jwt = require('jsonwebtoken')

const generateAccessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { //med jwt secret kan vi dekryptera koden till skillnad från bcrypt
        expiresIn: '1d'
    }) 
}

const authorize = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { // om vi har en auktorisersing som börjar med bearer så gör vi följade
        try {
            const accessToken = req.headers.authorization.split(' ')[1]
            const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET) //för att kunna dekryptera
            next() //om ovan fungerar går vi vidare
        }
        catch {
            res.status(401).json()
        }
    }
    else {
        res.status(401).json()
    }
}


module.exports = { generateAccessToken, authorize}