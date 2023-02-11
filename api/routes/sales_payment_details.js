var express = require('express');
var fs = require('fs');
var constantsModule = require('../constants-module');
let verifyToken = require('./verify.token');

var router = express.Router();
var filePath = constantsModule.rootPath+"/data/sales_payment_details.json";

router.get('/', (req, res) => {
    fs.readFile(filePath, 'utf8', function (err, data) {
       res.end(data);
    });
 })

module.exports = router;