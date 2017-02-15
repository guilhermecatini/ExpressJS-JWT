// ./api/routes/userRoutes.js
'use strict'

const router = require('express').Router()

const userModel = require('../models/userModel')

const jwt = require('jsonwebtoken')
// senha para criptografar a chave
const supersecret = 'senhasuperfoda'

const callback = function (res, err, data) {
    if (err) return res.json(err)
    return res.json(data)
}

// Gera um novo token
router.get('/getToken', (req, res) => {
    // Dados que vou armazenar dentro dessa chave
    const jwtData = {
        email: 'guilherme@catini.org',
        userName: 'Guilherme Catini'
    }
    // parâmetros para criar a chave
    const jwtParams = {
        algorithm: 'HS256', // tipo da criptografia da chave
        expiresIn: 60 * 60 * 24 // Tempo para essa chave expirar em segundos
    }
    // gerar a chave
    jwt.sign(jwtData, supersecret, jwtParams, (err, data) => {
        if (err) return res.json({ error: true, message: 'Falha ao gerar o token' })
        res.json({ error: false, token: data })
    })
})

// Decodifica o token (APENAS PARA TESTES)
router.get('/decodeToken/:token', (req, res) => {
    const token = req.params.token
    jwt.verify(token, supersecret, (err, data) => {
        callback(res, err, data)
    })
})


// Antes de acessar as rotas abaixo, terá que passar pelo teste criado
router.use((req, res, next) => {
    const token = req.headers['authorization']
    // caso não receba nenhum token, já retorna o erro e não liberando o acesso as rotas.
    if (!token) return res.json({ error: true, message: 'Nenhum token recebido.' })

    jwt.verify(token, supersecret, (err, data) => {
        if (err) return res.json(err) // caso o token recebido seja invalido, já retorna o erro
        next() // por final, se o token for válido, usa o next() para liberar o acesso as rotas
    })

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