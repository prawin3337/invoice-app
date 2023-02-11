const express = require('express');
const router = express.Router();
const db = require('../db/db_connection');
const utils = require("../util");
module.exports = router;

let model = {
    add: (input, callback) => {
        let data = {
            po_id: input.poId,
            po_no: input.poNo,
            address_id: input.addressId,
            approved_by: input.approvedBy,
            requested_by: input.requestedBy,
            delivery_date: new Date(input.deliveryDate),
            department: input.department,
            ven_id: input.venId,
            com_id: input.comId,
            sys_date: new Date()
        }

        db.query("insert into purchase_order set ?",[data], callback);
    },

    addPOproduct: (input, callback) => {
        let data = {
            po_id: input.poId,
            pro_id: input.proId,
            pro_gst: input.proGst,
            pro_qty: input.proQty,
            pro_rate: input.proRate,
            com_id: input.comId,
            sys_date: new Date()
        }
        db.query("insert into purchase_order_products set ?",[data], callback);
    },

    get: (input, callback) => {
        const transformMap = new Map([
            ['po_id', 'poId'],
            ['po_no', 'poNo'],
            ['address_id', 'addressId'],
            ['approved_by', 'approvedBy'],
            ['requested_by', 'requestedBy'],
            ['delivery_date', 'deliveryDate'],
            ['department', 'department'],
            ['ven_id', 'venId'],
            ['com_id', 'comId'],
            ['sys_date', 'sysDate']
        ]);
            
        const result = [];
        input.forEach((o) => {
            result.push(utils.transformKeys(transformMap, o));
        });

        callback(result);
    },

    getPOProduct: (input, callback) => {
        const transformMap = new Map([
            ['po_id', 'poId'],
            ['pro_id', 'proId'],
            ['pro_qty', 'proQty'],
            ['pro_rate', 'proRate'],
            ['pro_gst', 'proGst'],
            ['com_id', 'comId'],
            ['sys_date', 'sysDate']
        ]);
            
        const result = [];
        input.forEach((o) => {
            result.push(utils.transformKeys(transformMap, o));
        });

        callback(result);
    }
}

module.exports = model;