// ./app.js
'use strict'

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// conexao com o banco de dados 'jwt'
const db = require('mongoose')         // --> Abrir Conexão com o MongoDB
db.connect('mongodb://localhost/jwt')  // --> Abrir Conexão com o MongoDB

//const index = require('./routes/index') --> REMOVER
//const users = require('./routes/users') --> REMOVER

const apiUsers = require('./api/routes/userRoutes')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//app.use('/', index) --> REMOVER
//app.use('/users', users) --> REMOVER

app.use('/api/users', apiUsers) // --> ADICIONAR ROTA

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
