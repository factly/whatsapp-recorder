"use strict";

var express = require('express');

var MongoClient = require('mongodb').MongoClient;

var bodyParser = require('body-parser');

var http = require('http');

var cors = require('cors');

var app = express(); 

require('dotenv').config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors({
  origin: '*'
}));

app.post('/save', async function (req, res) {
    // Create a new MongoClient
    var url = process.env.MONGO_URI
    var name = process.env.MONGO_DB

    var db = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(function(client) { 
        return client.db(name) 
    })
    
    req.body['insertTime'] = new Date()
    return db.collection("test").insertOne(req.body, function(err, result) {
        if(err)
            return res.sendStatus(500)
        return res.sendStatus(200)
    })

});

var port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

var server = http.createServer(app);

server.listen(port, function () {
  console.log("The server is running port:".concat(port));
});

module.exports = server;