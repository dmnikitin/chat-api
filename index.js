const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const io = require('socket.io');

const routes = require('./routes/index');

const app = express();
const server = http.createServer(app);
const { MONGO_URI, port } = dotenv.config().parsed;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(MONGO_URI);


io.listen(server);
app.listen(port, () => console.log(`Listening on http://localhost:${port}/`))
