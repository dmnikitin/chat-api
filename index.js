const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MONGO_URI, port } = dotenv.config().parsed;
const routes = require('./routes/index');

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes);
mongoose.connect(MONGO_URI);

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`))
