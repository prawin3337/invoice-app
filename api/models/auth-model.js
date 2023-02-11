const express = require('express');
const router = express.Router();
const db = require('../db/db_connection');

module.exports = router;

let model = {
    signUp: (input, callback) => {
        let data = {
            login_id: input.loginId,
            password: input.password,
            user_email: input.userEmail,
            user_type: 'a',
            user_name: input.userName,
            user_contact: input.userContact,
            user_status: 1,
            sys_date: new Date()
        }

        return db.query("insert into login set ?",[data], callback)
    },

    login: (input, callback) => {
        return db.query("SELECT * FROM login WHERE login_id = ?",[input.loginId], callback)
    }
}

module.exports = model;