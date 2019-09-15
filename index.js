const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

//to env file
const port = process.env.PORT || 8000;

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MONGO_URI } = dotenv.config().parsed;

const { authController, loginController, signupController, logoutController } = require('../controllers/authControllers');
const { authMiddleware } = require('./middlewares/index')

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(MONGO_URI);


app.post('/signup', signupController)
app.post('/login', loginController)
app.get('/', authMiddleware, authController)
app.get('/logout', logoutController)

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`))
