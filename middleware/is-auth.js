const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    // token is attached to the header, and we will extract from it
    if(!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.AUTH_SECRET_KEY);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken) { // decoding worked but if was not able to verify the token
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};
