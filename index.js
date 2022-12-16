require('dotenv').config()

const port = process.env.API_PORT || 5002
const mongodbInit = require('./mongodb-server')
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

//middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

//routes/controller
const usersController = require('./controllers/usersController')
app.use ('/api/users', usersController)

const productsController = require('./controllers/productsController')
const { mongo } = require('mongoose')
app.use ('/api/products', productsController)

const authenticationController = require('./controllers/authenticationController')
app.use('/api/authentication', authenticationController)

app.use('/graphql', graphqlHTTP({
    schema: require('./schemas/graphQL/graphqlSchema'),
    graphiql: true // ger oss ett grafiskt gränssnitt där vi kan exprimentera och testa saker på. används i testsyfte och kopplas bort när man kör "på riktigt"
}))


//initialize
//mongodbInit()
app.listen(port, () => {
    console.log(`Web Api is running on http://localhost:${port}`)
    mongodbInit()
})
