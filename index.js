const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const dotenv = require('dotenv');
const port = process.env.PORT || 8000;

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {

})

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`))
