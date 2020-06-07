const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  todos: [{
    id: String,
    title: String,
    description: String
  }]
}) 

module.exports = mongoose.model("User", userSchema)