const User = require('../models/usersModel');
const { errorHandler, getFromMongo } = require('../helpers/index');

const getUsersController = (req, res, next) =>
    getFromMongo(User)
    .then(users => users && users.length ? users : Promise.reject({ message: 'no users registered' }))
    .then(users => res.json({ success: true, users }))
    .catch(err => errorHandler(err, res, next))

module.exports = { getUsersController };
