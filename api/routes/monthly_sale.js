const express = require('express');
const mysqlConnection = require('./db_connection');
const router = express.Router();
var constantsModule = require('../constants-module');
var fs = require('fs');
var filePath = constantsModule.rootPath+"/data/invoices.json";

let verifyToken = require('./verify.token');

// router.get('/', function (req, res) {
//     fs.readFile(filePath, 'utf8', function (err, data) {
//        res.end(data);
//     });
//  })

// module.exports = router;

// try {
//     await Promise.all(prizes.map(async (prize) => {
//         const winners = await Winner.find({"id": prize._id});
//         response.push({prize, winners});
//     }))
//     res.send({success:1, data: response});
// } catch (err) {
//     res.send({success: 0, data: err});
// }
// "select * from invopro where invo_id in(SELECT invo_id FROM `invoice` WHERE `com_id`=? && invo_date BETWEEN ? AND ?)"
router.get('/', (req, res, next) => {
    getInvoiceData(req.query, (data) => {
        res.send(data);
    });
})

let getInvoiceData = (params, calback) => {
    mysqlConnection.query("SELECT * FROM `invoice` WHERE `com_id`=? && invo_date BETWEEN ? AND ?",
    [params.com_id, params.from_date, params.to_date],
    (err, row, fields) => {
        if(!err) {
            Promise.all(getProductData(row)).then((values) => {
                calback(values);
            });
        } else {
            console.log(err);
        }
    })
}

let getProductData = (data) => {
    let promises = [];
    data.map((element) => {
        promises.push(
            new Promise((resolve, reject) => {
                mysqlConnection.query("select * from invopro where invo_id=?",
                [element.invo_id],
                (err, row, fields) => {
                    if(!err) {
                        element.products = row;
                        resolve(element);
                    } else {
                        element.data = err;
                        reject(element);
                    }
                })
            })
        );        
    })
    return promises;    
}

module.exports = router;