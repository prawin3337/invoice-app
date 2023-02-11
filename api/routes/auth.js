const express = require('express');
const router = express.Router();
const authModel = require('../models/auth-model');
var constantsModule = require('../constants-module');

let jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// router.get('/signup', (req, res) => {
//     let password = req.body.password;
//     const saltRounds = 123456;

//     bcrypt.hash(password, saltRounds, (error, hash) => {
//         req.body.password = hash;
//         authModel.signUp(req.body, (error, result) => {
//             res.json({result, error});
//         });
//     });
// });

// router.post('/login', verifyToken, (req, res) => {
router.post('/login', (req, res) => {
    authModel.login(req.body, (error, results, fields) => {
        let password = req.body.password;

        if (error) {
            res.json({
                status:false,
                message:'there are some error with query',
                data: []
              })
        } else {
          if(results.length > 0) {
              if(password == results[0].password) {
                    let data = results[0];
                    delete data["password"];


                    let token = jwt.sign({payload: data}, constantsModule.secret, {expiresIn:'12h'});
                    res.json({
                        status:true,
                        message:'Successfully authenticated.',
                        // Remove userData after removed php dependancy.
                        data: [{token, userData: data}]
                    })
              } else {
                  res.json({
                    status:false,
                    message:"login id and password does not match.",
                    data: []
                   });
              }
           
          } else {
            res.json({
              status:false,    
              message:"Login Id does not exits.",
              data: []
            });
          }
        }
    });
});

module.exports = router;