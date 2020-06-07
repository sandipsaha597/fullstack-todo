const express = require('express')
const app = express()
const cors = require('cors')
const bcrypt = require('bcrypt')
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const code = require('./nodomon.json')

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



app.listen(5000)