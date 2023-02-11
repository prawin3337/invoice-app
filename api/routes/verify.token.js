let constantsModule = require('../constants-module');
let jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
    let token = req.headers.token;
    if(token) {
        jwt.verify(token, constantsModule.secret, (error, tokenData) => {
            if(error) {
                return res.status(401).json({message: "Unauthorized request."})
            }
    
            if(tokenData) {
                req["sessionData"] = tokenData.payload;
                next();
            }
        })
    } else {
        // check for basic auth header
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            return res.status(401).json({ message: 'Missing Authorization Header' });
        }

        // verify auth credentials
        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        // Pass com_id and login_id in query params
        const {com_id, login_id} = req.query;

        const user = authenticateUser({ username, password, com_id, login_id });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid Authentication Credentials' });
        }

        // attach user to request object
        req["sessionData"] = user

        next();
    }
}

let authenticateUser = ({ username, password, com_id, login_id }) => {
    // users hardcoded for simplicity, store in a db for production applications
    const users = [{ id: 1, username: '8796', password: 'Rinvoice'}];

    const user = users.find(u => u.username === username && u.password === password);
    user.com_id = com_id;
    user.login_id = login_id;

    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

module.exports = verifyToken;