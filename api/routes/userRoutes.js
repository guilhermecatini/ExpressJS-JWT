'use strict'

const userModel = require('../models/userModel')

const router = require('express').Router()

const jwt = require('jsonwebtoken')
const superSecret = 'umasenhasuperfoda'

const callback = function (res, err, data) {
  if (err) return res.json(err)
  return res.json(data)
}

router.use((req, res, next) => {
  if ( 1 == 2 ) {
    res.json({error: true, message:"Nenhum token recebido"})
  } else {
    next()
  }
})

router.post('/create', (req, res) => {
  const body = req.body
  userModel.create(body, (err, data) => {
    callback(res, err, data)
  })
})

router.get('/retrieve', (req, res) => {
  const query = {}
  userModel.find(query, (err, data) => {
    callback(res, err, data)
  })
})

router.get('/retrieve/:id', (req, res) => {
  const query = { _id: req.params.id }
  userModel.findOne(query, (err, data) => {
    callback(res, err, data)
  })
})

router.post('/update', (req, res) => {
  const query = { _id: req.body._id }
  const mod = req.body
  userModel.update(query, mod, (err, data) => {
    callback(res, err, data)
  })
})

router.delete('/delete/:id', (req, res) => {
  const query = { _id: req.params.id }
  userModel.remove(query, (err, data) => {
    callback(res, err, data)
  })
})

module.exports = router