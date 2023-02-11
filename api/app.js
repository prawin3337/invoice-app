const express = require('express');
const bodyParser = require('body-parser');

var app = express();

const PORT = 4300;

app.use((req, res, next) => {

    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://3.19.188.39');
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    // res.setHeader('Access-Control-Allow-Origin', 'http://remoteinvoices.com');

    var allowedOrigins = ['http://3.19.188.39', 'http://remoteinvoices.com', 'http://localhost', 'http://localhost:4200', 'http://localhost:4300'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var auth = require('./routes/auth');
var home = require('./routes/home');
var invoices = require('./routes/invoices');
var products = require('./routes/products');
var vendors = require('./routes/vendors');
var address = require('./routes/address');
var purchaseOrder = require('./routes/purchase-order');

app.use('/api/auth', auth);
app.use('/api', home);
app.use('/api/invoices', invoices);
app.use('/api/products', products);
app.use('/api/vendors', vendors);
app.use('/api/address', address);
app.use('/api/PO', purchaseOrder);

app.listen(PORT, function() {
    console.log("test api server is running on ", PORT);
});

module.exports = app;
