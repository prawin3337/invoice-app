const mysqlConnection = require('../db/db_connection');
const purchaseOrderModel = require('../models/purchase-order');
const addressModel = require('../models/address');
const productModel = require('../models/product');

const model = {
    getPurchaseOrder: (params, callback) => {
        let sql = "SELECT * FROM `purchase_order` WHERE `com_id`=?";
        let queryParams = [params.comId]

        if(params.poId && params.poId != "NULL") {
            sql = "SELECT * FROM `purchase_order` WHERE `com_id`=? && `po_id`=?";
            queryParams = [params.comId, params.poId];
        }

        _getData(sql, queryParams, purchaseOrderModel.get, callback);
    },
    
    getAddress: (params, callback) => {
        let sql = "SELECT * FROM `address` WHERE `com_id`=?";
        let queryParams = [params.comId]

        if(params.addressId) {
            sql = "SELECT * FROM `address` WHERE `com_id`=? && `address_id`=?";
            queryParams = [params.comId, params.addressId];
        }

        _getData(sql, queryParams, addressModel.get, callback);
    },

    getProducts: (params, callback) => {
        let sql = "SELECT * FROM `product` WHERE `com_id`=?";
        let queryParams = [params.comId]

        if(params.proId) {
            sql = "SELECT * FROM `product` WHERE `com_id`=? && `pro_id`=?";
            queryParams = [params.comId, params.proId];
        }

        _getData(sql, queryParams, productModel.get, callback);
    },

    getPOProducts: (params, callback) => {
        let sql = "SELECT * FROM `purchase_order_products` WHERE `com_id`=?";
        let queryParams = [params.comId]

        if(params.proId) {
            sql = "SELECT * FROM `purchase_order_products` WHERE `com_id`=? && `po_id`=?";
            queryParams = [params.comId, params.poId];
        }

        _getData(sql, queryParams, purchaseOrderModel.getPOProduct, callback);
    }
}

const _getData = (sql, queryParams, dataModel, callback) => {
    mysqlConnection.query(sql, queryParams,
        (err, row, fields) => {
            if(!err) {
                if(dataModel) {
                    dataModel(row, (result) => {
                        callback(result);
                    });
                } else {
                    callback(row);
                }                
            } else {
                callback({
                    error: true,
                    data: err
                });
            }
        });
}

module.exports = model;