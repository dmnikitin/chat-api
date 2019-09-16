const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { SECRET: secret } = dotenv.config().parsed;

const authMiddleware = (req, res, next) => {
    if (req.headers.authorization) {
        const [prefix, token] = req.headers.authorization.split(' ');
        if (prefix === 'Bearer') {
            jwt.verify(token, secret, (error, verified) => {
                if (error) {
                    return next(new Error('authentication error'))
                }
                req.verified = verified;
                next();
            })
        }
    } else {
        return next(new Error('authentication error'))
    }
}

const socketMiddleware = (socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
        return next(new Error('authentication error'))
    } else {
        jwt.verify(token, secret, (err, verified) => {
            if (err) {
                return next(new Error('authentication error'))
            }
            socket.verified = verified;
            next();
        });
    }
}

module.exports = { authMiddleware, socketMiddleware };
