# Segurança de Rotas utilizando JsonWebToken (JWT)

----------


Quando desenvolvemos as nossas rotas, não nos preocupamos em protege-las, simplesmente montamos uma rota como http://localhost:3000/api/users/retrieve para listar todos os usuários e depois capturamos a informação retornada por essa rota em alguma tecnologia front-end.
Imagine que você faça um CRUD completo de usuários e que voce utilize ele em seu Front-End utilizando o [Angular-JS](https://angularjs.org/), por exemplo, para trabalhar com essas informações. Até ai mil maravilhas! Mas você já parou pra pensar que você deixou essa rota aberta para qualquer pessoa ter acesso? Qualquer pessoa com um pouco de conhecimento conseguirá acessar essas rotas e Listar, Criar, Alterar e Deletar as informações do banco de dados quando bem entender.

Enfim, chega de lorota e vamos para a parte prática.

Para explicar de forma simples como colocar segurança em suas rotas no [ExpressJS](http://expressjs.com/) utilizando o [ JSON Web Token (JWT)](https://jwt.io/) vou iniciar um projeto com o [Express-Generator](http://expressjs.com/pt-br/starter/generator.html) para gerar a estrutura de arquivos, utilizaremos o [mongoose](http://mongoosejs.com/) para a modelagem de dados e logicamente o [MongoDB](https://www.mongodb.com/) para o armazenamento dos dados.

Primeiro vamos iniciar um projeto utilizando o [Express-Generator](http://expressjs.com/pt-br/starter/generator.html).

> **Antes de iniciar verifique se você tem esses dois packages instalados a nível global**

> - Express-Generator
> - [Nodemon](https://nodemon.io/)

> Caso não tenha esses packages instalados, instale com os comandos abaixo

>**#Windows**
>`npm i -g nodemon express-generator`
>**#Linux**
>`$ sudo npm i nodemon express-generator`

### Criando o projeto utilizando o Express-Generator
---
Abra o terminal em um diretório de sua preferência (No meu caso */home/catini/Projects*) e execute o comando `express JWT` e automaticamente será criado um diretório com a estrutura pronta para inicarmos nosso projeto.

Feito isso acesse o diretório criado (JWT) e instale as dependências usando o comando `npm install`

E por fim, execute o comando `npm i mongoose jsonwebtoken --save` para instalar as últimas dependencias necessárias para nosso projeto.

---
Agora vamos editar o arquivo `package.json` e vamos alterar para que nosso servidor inicie usando o nodemon, para que não precisar reiniciar o servidor NodeJS toda vez que você fizer alguma alteração.

```javascript
// package.json
{
  "name": "jwt",
  "version": "0.0.0",
  "private": true,
  "scripts": {
	"start": "node ./bin/www" // --> ORIGINAL
    "start": "nodedemon ./bin/www" // --> ALTERADO
  },
  "dependencies": {
    "body-parser": "~1.16.0",
    "cookie-parser": "~1.4.3",
    "debug": "~2.6.0",
    "express": "~4.14.1",
    "jade": "~1.11.0",
    "morgan": "~1.7.0",
    "serve-favicon": "~2.3.2"
  }
}
```
---
Tudo certo, agora vamos iniciar nosso servidor utilizando o comando `npm start`, se tudo correr bem você vai receber essa mensagem no seu console.
```
catini@catini-corp ~/Projects/JWT $ npm start

> jwt@0.0.0 start /home/catini/Projects/JWT
> nodemon ./bin/www

[nodemon] 1.11.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./bin/www`

```
Experimente digitar http://localhost:3000/ em seu navegador, note que nosso servidor já está funcionando!

### Criando as rotas para Users (Create, Retrieve, Update, Delete)
---
Na raiz do projeto, crie uma pasta chamada **api** de dentro dessa pasta crie mais duas pastas, uma com o nome **routes** e outra com o nome **models**. Logo teremos esses dois diretórios:

	./api/routes/
	./api/models/

Agora vamos criar um modelo de dados dos nossos usuários, por isso crie um arquivo chamado `userModel.js` dentro do diretório `./api/models`

```javascript
// ./api/models/userModel.js
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _schema = {
	name: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}
const userSchema = new Schema(_schema)
const userModel = mongoose.model('user', userSchema)

module.exports = userModel

```

---

Vamos criar nosso arquivo de rotas com o nome `userRoutes.js` dentro do diretório `./api/routes/` e vamos adicionar as rotas do nosso CRUD

```javascript
// ./api/routes/userRoutes.js
'use strict'

const router = require('express').Router()

const userModel = require('../models/userModel')

const callback = function (res, err, data) {
    if (err) return res.json(err)
    return res.json(data)
}

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
```


Vamos acertar nosso arquivo `app.js` localizado na raiz do nosso projeto. Primeiro vou abrir uma conexão com o MongoDB utilizando o mongoose, remover as rotas padrão que vieram com a instalação automatica do Express-Generator e por fim adicionar a nossa rota nova. Observe o código abaixo.

```javascript
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
```

---
Bem, feito isso, nossas rotas já estão funcionais pelos links:

- http://localhost:3000/api/users/create (POST)
- http://localhost:3000/api/users/retrieve (GET)
- http://localhost:3000/api/users/update (POST)
- http://localhost:3000/api/users/delete (DELETE)

Como a ideia é mostrar como proteger as suas rotas, eu não vou aprofundar muito nesse assunto, afinal, se você está pesquisando por isso, é por que você já sabe montar suas rotas.

---

### Implementando o JWT

Antes de começar, recomendo ler algo sobre sobre o [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token).

Bom, para entendermos como vamos proteger as rotas, vou listar o passo-a-passo do que nossa aplicação deverá fazer.

1. a aplicação receberá uma requisição
2. essa requisição terá que vir com uma chave junto ao **header** com o parâmetro **Authorization**
3. o modulo **jwt** vai decodificar essa chave, verificando se ela é válida
4. caso ela for válida, **libera** o acesso para as demais rotas
5. caso for inválida **bloqueia** o acesso retornando um response dizendo que a chave recebida é invalida e não executa nenhuma operação do nosso CRUD

---

Vamos ao código?

Primeiro vamos gerar uma rota para que o JWT gere uma chave válida para utilizarmos como teste, afinal, se não tivermos a chave, não teremos como acessar as nossas rotas. Lembrando que essa chave é gerada em cima de uma senha definida por nós ou por algum certificado digital, no entanto, para descriptografar, precisaria dessa senha ou desse certificado.

Abra nosso arquivo de rotas `./api/routes/userRoutes.js` e criaremos uma constante recebendo nosso modulo JsonWebToken.

```javascript
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
        if (err) return res.json({ error: true, message: 'Falha ao gerar o token'})
        res.json({ error: false, token: data })
    })
})
// *** codigo omitido *** //
```

Feito isso, ao acessar o link http://localhost:3000/api/users/getToken (GET) vou receber um JSON com as informações abaixo.

```javascript
{
"error" : false,
"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1aWxoZXJtZUBjYXRpbmkub3JnIiwidXNlck5hbWUiOiJHdWlsaGVybWUgQ2F0aW5pIiwiaWF0IjoxNDg3MTE0NzQ1LCJleHAiOjE0ODcyMDExNDV9.IsRcvTnpVBFEZkZUDzWTRyrl2xGAscGU8IaB53MNomI"
}
```

***Atenção, não tente usar esse token gerado acima pois a validade dele é de 24 horas a partir do momento que foi gerado, caso tentar usar não irá funcionar***

---
Maravilha! Temos nosso token!

Agora vamos criar uma rota apenas para ver como ficaria esse token decodificado, lembrando, que **NÃO DEVE EXISTIR UMA ROTA PARA DECODIFICAR O TOKEN, É APENAS PARA VERMOS COMO FUNCIONA A FUNÇÃO!**

```javascript
 // *** Codigo Omitido *** //
 // após router.get('/getToken'....

router.get('/decodeToken/:token', (req, res) => {
    const token = req.params.token
    jwt.verify(token, supersecret, (err, data) => {
        callback(res, err, data)
    })
})
 // antes de router.post('/create',....
 // *** Codigo Omitido *** //
```

Então ao acessar o link:
`http://localhost:3000/api/users/decodeToken/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1aWxoZXJtZUBjYXRpbmkub3JnIiwidXNlck5hbWUiOiJHdWlsaGVybWUgQ2F0aW5pIiwiaWF0IjoxNDg3MTE0NzQ1LCJleHAiOjE0ODcyMDExNDV9.IsRcvTnpVBFEZkZUDzWTRyrl2xGAscGU8IaB53MNomI`
Teremos o seguinte resultado:
```javascript
{
  "email": "guilherme@catini.org",
  "userName": "Guilherme Catini",
  "iat": 1487114745,
  "exp": 1487201145
}
```

---

Maravilha! Já sabemos decodificar nosso Token caso precise de alguma informação de dentro dele, agora que tal proteger nossas rotas?

Para fazer isso, usaremos a função **use** das rotas do express!

O callback dessa função retorna três objetos ***request***, ***response*** e o ***next***. Nela faremos a verificação do token, e caso ele for válido, vamos liberar para acessar as rotas criadas, e caso não for válido, retornaremos um json com erro e a mensagem do motivo pelo qual o acesso foi bloqueado.

Lembrando que nosso token será enviado via ***header*** com o parâmetro ***Authorization*** e nossa aplicação irá ler esse header e capturar o token. 

Obs: Para facilitar o teste, utilize o [POSTMAN](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop), um app do Google Chrome

Chega de bla bla bla e vamos para o código.

```javascript
// *** Código Omitido *** //
// após router.get('/decodeToken/:token',....

router.use((req, res, next) => {
    const token = req.headers['authorization']
    // caso não receba nenhum token
    // já retorna o erro e não liberando o acesso as rotas.
    if (!token) return res.json({ error: true, message: 'Nenhum token recebido.' })

    jwt.verify(token, supersecret, (err, data) => {
        if (err) return res.json(err) // caso o token recebido seja invalido, já retorna o erro
        next() // por final, se o token for válido, usa o next() para liberar o acesso as rotas
    })

})

// antes router.post('/create',....
// *** Código Omitido *** //
```

---

O arquivo `userRoutes.js` terá que ficar igual abaixo no final de tudo.

---

```javascript
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
```

Bom, é isso, agora sua rota está segura, ninguém e nenhuma aplicação vai conseguir acessar sem um token válido!