const express = require('express');
const router = express.Router();
const db = require('../db/db_connection');
const utils = require("../util");
module.exports = router;

let model = {
    add: (input, callback) => {
        let data = {
            pro_id: input.proId,
            pro_nm: input.proNm,
            pro_hsn: input.proHsn,
            pro_desc: input.proDesc,
            pro_cat: input.proCat,
            pro_make: input.proMake,
            product_status: input.proStatus,
            product_gst: input.proGst,
            product_type: input.proType,
            com_id: input.comId,
            sys_date: new Date()
        }

        return db.query("insert into product set ?",[data], callback)
    },

    get: (input, callback) => {
        const transformMap = new Map([
            ['pro_id', 'proId'],
            ['pro_nm', 'proNm'],
            ['pro_hsn', 'proHsn'],
            ['pro_desc', 'proDesc'],
            ['pro_cat', 'proCat'],
            ['pro_make', 'proMake'],
            ['product_status', 'proStatus'],
            ['product_gst', 'proGst'],
            ['product_type', 'proType'],
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