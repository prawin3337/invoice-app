const express = require('express');
const mysqlConnection = require('../db/db_connection');
const router = express.Router();
var constantsModule = require('../constants-module');
let verifyToken = require('./verify.token');

router.get('/', verifyToken, (req, res, next) => {
   getInvoiceData(req, (data) => {
      let obj = {success: true, result: data};
      res.send(obj);
   });
})

let getInvoiceData = (req, calback) => {
   let {sessionData, query} = req;
   mysqlConnection.query("SELECT * FROM `invoice` WHERE `com_id`=? && YEAR(invo_date)=?",
   [sessionData.com_id, query.date],
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