const express = require('express')
const app = express()
const productsRouter = require('./api/routes/products')
const ordersRouter = require('./api/routes/orders')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://admin:'+ process.env.MONGO_PW
+'@node-app-shard-00-00-gmfwy.mongodb.net:27017,node-app-shard-00-01-gmfwy.mongodb.net:27017,node-app-shard-00-02-gmfwy.mongodb.net:27017/test?ssl=true&replicaSet=node-app-shard-0&authSource=admin&retryWrites=true', 
{ useNewUrlParser: true })

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Method',
      'PUT, POST, PATCH, DELETE, GET')
      return res.status(200).json({})
  }
  next()

})

app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

app.use((req, res, next) => {
  const error = new Error('not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})
module.exports = app