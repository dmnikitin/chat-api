const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/usersModel');
const { getDate, requestUserCheck, getFromMongo, isCorrectPassword, errorHandler } = require('../helpers/index');
const { SECRET: secret } = dotenv.config().parsed;

const signupController = (req, res, next) =>
    requestUserCheck(req)
    .then(json => getFromMongo(User, { username: json.username }))
    .then(user => {
        if (!user) {
            const registrationDate = getDate(new Date())
            const newUser = new User({
                username: req.body.user.username,
                password: req.body.user.password,
                registrationDate,
            })
            return newUser.save();
        }
        return Promise.reject({ message: 'User already exists' })
    })
    .then(json => json
        ? res.json({
            success: true,
            message: 'User has been successfully registered'
        })
        : Promise.reject({ message: 'Failed to register' }))
    .catch(err => errorHandler(err, res, next))


const loginController = (req, res, next) =>
    requestUserCheck(req)
    .then(user => getFromMongo(User, { username: user.username }))
    .then(user => user
        ? isCorrectPassword(req, user)
        : Promise.reject({ message: 'Failed to login. Wrong username or password' }))
    .then(user => {
        if (user) {
            // const userObjWithoutPassword = { id: user.id, username: user.username, registrationDate: user.registrationDate };
            req.token = jwt.sign({ user }, secret, { expiresIn: '24h' });
            return ({ user, token: req.token });
        }
        return Promise.reject({ message: 'Failed to login. Wrong username or password' });
    })
    .then(json => res.json({ success: true, user: json.user, token: json.token }))
    .catch(err => errorHandler(err, res, next))


const authController = (req, res) =>
    Promise.resolve({ user: req.verified.user })
    .then(json => res.json({ success: true, user: json.user }))
    .catch(err => errorHandler(err, res, next))


const logoutController = (req, res, next) =>
    Promise.resolve({ message: 'Logged out successfully' })
    .then(json => res.json({ success: true, message: json.message }))
    .catch(err => errorHandler(err, res, next))


module.exports = { authController, loginController, signupController, logoutController }
