const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const port = process.env.PORT || 8000;
const jwt = require('jsonwebtoken');
const { SECRET: secret } = dotenv.config().parsed;

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//validator
const requestUserCheck = req => {
    const { username, password } = req.body.user;
    if (username && password) {
        return Promise.resolve({ username, password })
    }
};

//signup handler

app.post('/signup', (req, res, next) => {
    //1_validate req data
    requestUserCheck(req)
        //2_ get from mongo
        .then(json => getFromMongo(User, { username: json.username }))
        //3_if no user in mongo - create one
        .then(user => {
            if (!user) {
                // todo: const registrationDate  - create func for date
                // create User mongo model
                const newUser = new User({
                    username: req.body.user.username,
                    password: req.body.user.password,
                    //registrationDate
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


//auth
const authMiddleware = (req, res, next) => {
    const [prefix, token] = req.headers.authorization.split(' ');
    if (prefix === 'Bearer') {
        // jwt.verify (token, callback func (verified) => {}
        // req.verified = verified
        //next()
    } else {
        //error access denied 403
    }
}


app.get('/', authMiddleware, (req, res) => {
    // if user
    return Promise.resolve({ user: req.verified.user })
        .then(json => res.json({ success: true, user: json.user }))
        .catch(err => console.log(err.message))
})


//logout



app.listen(port, () => console.log(`Listening on http://localhost:${port}/`))
