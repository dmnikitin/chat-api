const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const port = process.env.PORT || 8000;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const { MONGO_URI } = dotenv.config().parsed;
const { SECRET: secret } = dotenv.config().parsed;
mongoose.connect(MONGO_URI);
const User = require('./models/usersModel')

const bcrypt = require('bcrypt');

//input validator
const requestUserCheck = req => {
    const { username, password } = req.body.user;
    if (username && password) {
        return Promise.resolve({ username, password })
    }
};

// data from db
const getFromMongo = (model, options) => {
    let query = options ? model.findOne(options) : model.find({});
    return query.exec();
}

// date func

const getDate = date => {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const formattedMonth = (`0${mm}`).slice(-2);
    const formattedDay = (`0${dd}`).slice(-2);
    const yyyy = date.getFullYear();
    return `${formattedDay}.${formattedMonth}.${yyyy}`;
};

//password validator

const isCorrectPassword = (req, user) =>
    bcrypt.compare(req.body.user.password, user.password)
    .then(result => result ? user : null)


//signup handler

app.post('/signup', (req, res, next) => {
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
        .catch(err => console.log(err.message))
})


//login

app.post('/login', (req, res, next) =>
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
    .catch(err => errorHandler(err, res, next)))

//auth

const authMiddleware = (req, res, next) => {
    if (req.headers.authorization) {
        const [prefix, token] = req.headers.authorization.split(' ');
        if (prefix === 'Bearer') {
            jwt.verify(token, secret, (error, verified) => {
                if (error) {
                    res.status(403).send({
                        success: false,
                        error: 'failed to verify token'
                    });
                }
                req.verified = verified;
                next();
            })
        } else {
            res.status(403).send({
                success: false,
                message: 'failed to authenticate: token required',
            });
        }
    }
}

app.get('/', authMiddleware, (req, res) =>
    Promise.resolve({ user: req.verified.user })
    .then(json => res.json({ success: true, user: json.user }))
    .catch(err => console.log(err.message))
)


//logout
app.get('/logout', (req, res, next) =>
    Promise.resolve({ message: 'Logged out successfully' })
    .then(json => res.json({ success: true, message: json.message }))
    .catch(err => errorHandler(err, res, next)))



app.listen(port, () => console.log(`Listening on http://localhost:${port}/`))
