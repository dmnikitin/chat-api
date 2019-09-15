const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { SECRET: secret } = dotenv.config().parsed;

const authMiddleware = (req, res, next) => {
    if (req.headers.authorization) {
        const [prefix, token] = req.headers.authorization.split(' ');
        if (prefix === 'Bearer') {
            jwt.verify(token, secret, (error, verified) => {
                if (error) {
                    res.status(403).send({
                        success: false,
                        error: 'failed to verify'
                    });
                }
                req.verified = verified;
                next();
            })
        } else {
            res.status(403).send({
                success: false,
                message: 'failed to authenticate: token verification required',
            });
        }
    }
}

module.exports = { authMiddleware }
