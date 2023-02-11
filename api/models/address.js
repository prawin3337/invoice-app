const express = require('express');
const router = express.Router();
const db = require('../db/db_connection');
const utils = require("../util");
module.exports = router;

let model = {
    get: (input, callback) => {
        const transformMap = new Map([
            ['address_id', 'addressId'],
            ['address_det', 'addressDet'],
            ['address_contact', 'addressContact'],
            ['state', 'state'],
            ['state_code', 'stateCode'],
            ['com_id', 'comId'],
            ['sys_date', 'sysDate']
        ]);
            
        const result = [];
        input.forEach((o) => {
            result.push(utils.transformKeys(transformMap, o));
        });

        callback(result);
    },
    add: (input, callback) => {
        let data = {
            address_id: input.addressId,
            address_det: input.addressDet,
            address_contact: input.addressContact,
            state: input.state,
            state_code: input.stateCode,
            com_id: input.comId,
            sys_date: new Date()
        }

        return db.query("insert into address set ?",[data], callback)
    }
}

module.exports = model;