const express = require('express');
const router = express.Router();
const db = require('../db/db_connection');
const utils = require("../util");
module.exports = router;

let model = {
    get: (input, callback) => {
        const transformMap = new Map([
            ['ven_id', 'venId'],
            ['ven_nm', 'venNm'],
            ['ven_gst', 'venGst'],
            ['ven_pan', 'venPan'],
            ['ven_email', 'venEmail'],
            ['ven_con', 'venCon'],
            ['ven_add', 'venAdd'],
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