const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MONGO_URI, port } = dotenv.config().parsed;

const routes = require('./routes/index');
const { authController, loginController, signupController, logoutController } = require('../controllers/authControllers');
const { authMiddleware } = require('./middlewares/index')

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(MONGO_URI);

app.use('/', routes);

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`))
