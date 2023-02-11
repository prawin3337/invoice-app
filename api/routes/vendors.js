const express = require('express');
const mysqlConnection = require('../db/db_connection');
const router = express.Router();
const verifyToken = require('./verify.token');
const vendorModel = require('../models/vendor');

router.get('/', verifyToken, (req, res, next) => {    
    let {sessionData, query} = req;
    mysqlConnection.query("SELECT * FROM `vendor` WHERE `com_id`=?",
    [sessionData.com_id],
    (err, row, fields) => {
        if(!err) {
            vendorModel.get(row, (result) => {
                res.send(result);
            });
        } else {
            console.log(err);
        }
    })
});

module.exports = router;