'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config/local');

const app = express();

app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/public'));

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./routes')(app);

const server = app.listen(config.server.port, function () {
  console.log(`Node app listening on port ${config.server.port}!`);
});

app.all('*', function (req, res, next) {
    return res.sendFile(path.join(__dirname+'/public/index.html'));
});


