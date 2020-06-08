const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const bcrypt = require('bcrypt')
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const mod = () => {
  try {
    return require('./nodemon.json')
  } catch {
    return 'code'
  }
}
let code = mod()


const uri = "mongodb+srv://sandip:" + (process.env.MONGO_ATLAS_PW || code.env.MONGO_ATLAS_PW) + "@todo-app-lyobv.mongodb.net/test?retryWrites=true&w=majority";

const Product = require("./models/product")
const User = require("./models/user")

mongoose.connect(uri, {
  dbName: "fullstack",
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(cors())
app.use(express.json())


// app.use(express.static(__dirname))
// app.get('*'), (req, res) => {
// 	res.sendFile(path.resolve(__dirname, 'index.html'))
// }

console.log(__dirname)


const authenticateToken = (req, res, next) => {
  const authHeader = req.header('authorization') || req.body.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || code.env.ACCESS_TOKEN_SECRET, (err, username) => {
    if (err) return res.status(401).json("token not valid")
    req.username = username.username
    next()
  })
}

app.get('/todos', authenticateToken, (req, res) => {
  console.log('req todos')
  User.findOne({username: req.username}, (err, data) => {
    if (err) throw err
    res.status(200).json(data)
  })
})
app.get("/api/working", (req, res) => {
  console.log('working')
  res.json({msg: "working"})
}) 

app.get('/test', (req, res) => {
  console.log('req test')
  res.json({msg: 'test'})
})

app.put('/todos/update', authenticateToken, (req, res) => {
  User.updateOne({username: req.username}, {todos: req.body.allTodos}, (err, data) => {
    if (err) {
      res.status(400).json({msg: "Couldn't update"})
      throw err
    }
    res.status(201).json({msg: 'saved', data}) 
    // User.findOne({username: req.username}, (err, data) => {
    //   if (err) throw err
      
    //   res.status(201).json(data) 
    // }) 
  }) 
}) 

app.delete('/todos/delete/:id', authenticateToken, (req, res) => {
  User.updateOne({username: req.username}, {$pull: { todos: { id: req.params.id } }}, (err, data) => {
    if (err || data.nModified == 0) {
      return res.status(400).json({msg: "failed to delete"})
    }
    res.status(200).json(data)
  })
})


const generateAccessToken = user => {
  return jwt.sign({username: user}, (process.env.ACCESS_TOKEN_SECRET || code.env.ACCESS_TOKEN_SECRET), {expiresIn: '2d'})
}

app.post('/login', (req, res) => {
  let username = req.body.username.toLowerCase(),
    password = req.body.password

  let user
  User.findOne({
    username
  }, async (err, data) => {
    if (err) throw err
    user = data
    if (user != null) {
      try {
        if (await bcrypt.compare(password, user.password)) {
          
          const accessToken = generateAccessToken(username)

          res.json({msg: 'success', accessToken: accessToken})
        } else {
          res.json({msg: "username or password is incorrect"})
        }
      } catch {
        res.send("password encryption error")
      }

    } else {
      
      res.json({msg: 'user doesn\'t exist. Please signup'})
    }
  })

})

app.post('/signup', (req, res) => {
  let doesUserExist
  const username = req.body.username.toLowerCase()
  User.findOne({
    username
  }, async (err, data) => {
    if (err) throw err
    doesUserExist = data
    // res.json(doesUserExist)

    if (doesUserExist == null) {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
          username,
          password: hashedPassword,
          todos: []
        })
        user.save()
        .then(() => res.json("user created"))
        .catch((err) => res.json({
          msg: err
        }))
      } catch {
        res.send("sign up server error")
      }
    } else {
      res.json('user already exist')
    }
  })
})


// serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('ui/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'ui', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 4000
app.listen(port, () => console.log('server started on port', port))