const mongoose = require('mongoose');

const url = 'mongodb://172.17.0.2:27017';

mongoose.connect(url);// connect with the database

const heroSchema = new mongoose.Schema({
    name: String//It will look like
})

module.exports = mongoose.model('Hero', heroSchema);//export model
