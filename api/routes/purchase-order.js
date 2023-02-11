const express = require('express');
const router = express.Router();
const verifyToken = require('./verify.token');
const purchaseOrderModel = require('../models/purchase-order');
const sqlQueryModel = require('../models/sql-query-model');

router.post('/add', verifyToken, (req, res) => {
    let {sessionData, query} = req;
    req.body["comId"] = sessionData.com_id;

    purchaseOrderModel.add(req.body, (error, result, fields) => {
        if (error) {
            let errorStr = JSON.stringify(error);
            res.status(500).json({
                message: "There are some error with query.",
                data: [{error: errorStr}]
            })
        } else {
            let pOproduct = req.body.products;
            if(pOproduct) {
                let poId = result["insertId"];
                let {com_id} = sessionData;

                let promises = addPOproducts(poId, com_id, pOproduct);
                Promise.all(promises).then((values) => {
                    res.status(200).json({
                        status: true,
                        message:"PO successfully added.",
                        data: {poDetails: result,
                               productDetails: values}
                    });
                 });                
            } else {
                res.status(500).json({
                    message: "PO products not found.",
                    data: [{result}]
                })
            }
        }
    });
});

let addPOproducts = (poId, comId, products) => {
    let promises = [];    
    products.forEach((prod) => {
        promises.push(
            new Promise((resolve, reject) => {
                prod["poId"] = poId;
                prod["comId"] = comId;
        
                purchaseOrderModel.addPOproduct(prod, (error, result, fields) => {
                    if(error) {
                        resolve(error);
                     } else {
                        resolve(result);
                     }
                });
            })
        );
    });
    return promises;
}

router.get('/', verifyToken, (req, res, next) => {    
    const {sessionData, query} = req;
    const comId = sessionData.com_id;
    const par = {comId, poId: query.poId};

    sqlQueryModel.getPurchaseOrder(par ,(poData) => {     
        let promises = [
            new Promise((resolve, reject) => {
                sqlQueryModel.getAddress({comId} ,(addressData) => {
                    if(addressData.error) {
                        reject("Address data not found.");
                    } else {
                        resolve(addressData);
                    }                    
                });
            }),
            new Promise((resolve, reject) => {
                sqlQueryModel.getPOProducts({comId} ,(poProductData) => {
                    if(poProductData.error) {
                        reject("PO products data not found.");
                    } else {
                        resolve(poProductData);
                    } 
                });
            }),
            new Promise((resolve, reject) => {
                sqlQueryModel.getProducts({comId} ,(productData) => {
                    if(productData.error) {
                        reject("Products data not found.");
                    } else {
                        resolve(productData);
                    } 
                });
            })
        ];
        
        Promise.all(promises)
            .then((values) => {
                let newObj = [];
                values.forEach((obj) => {
                    newObj.push(...obj);
                });

                poData.map((po) => {
                    let address = newObj.find((d) => d.addressId == po.addressId);
                    if(address) {
                        po = Object.assign(po, address);
                    }                    

                    let products = newObj.filter((d) => d.poId == po.poId);
                    products.map((p) => {
                        let pro = newObj.find((d) => (!d.poId && d.proId == p.proId));
                        if(pro) {
                            let {proDesc, proHsn, proCat, proMake} = pro;
                            Object.assign(p, {proDesc, proHsn, proCat, proMake});
                        }
                    });
                    po["products"] = products;                    
                });
                res.send(poData);
            })
            .catch((error) => {
                console.log(error);
                res.send(error);
            });
    });
});

module.exports = router;