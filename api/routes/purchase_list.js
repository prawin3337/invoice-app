var express = require('express');
var fs = require('fs');
var constantsModule = require('../constants-module');
let verifyToken = require('./verify.token');

var router = express.Router();
var filePath = constantsModule.rootPath+"/data/purchase_list.json";

router.get('/', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
       res.end(data);
    });
 })

module.exports = router;