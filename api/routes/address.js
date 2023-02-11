const express = require('express');
const router = express.Router();
const verifyToken = require('./verify.token');
const addressModel = require('../models/address');
const sqlQueryModel = require('../models/sql-query-model');

router.get('/', verifyToken, (req, res, next) => { 
    const {sessionData, query} = req;
    const par = {comId: sessionData.com_id, addressId: query.addressId};

    sqlQueryModel.getAddress(par ,(data) => {
        res.send(data);
    });
});

router.post('/add', verifyToken, (req, res) => {
    let {sessionData, query} = req;
    req.body["comId"] = sessionData.com_id;

    addressModel.add(req.body, (error, result, fields) => {
        if (error) {
            let errorStr = JSON.stringify(error);
            res.status(500).json({
                message: "There are some error with query.",
                data: [{error: errorStr}]
            })
        } else {
            res.status(200).json({
                status: true,
                message:"Address successfully added.",
                data: result
            });
        }
    });
});

module.exports = router;