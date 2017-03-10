'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/local');

const app = express();

app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/public'));

app.use(cors());
app.use(morgan('combined'));

const server = app.listen(config.server.port, function () {
  console.log(`Node app listening on port ${config.server.port}!`);
});

app.get('/', function (req, res) {
    return res.sendFile(path.join(__dirname+'/public/index.html'));
});
