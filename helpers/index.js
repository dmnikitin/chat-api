const bcrypt = require('bcrypt');

const getDate = date => {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const formattedMonth = (`0${mm}`).slice(-2);
    const formattedDay = (`0${dd}`).slice(-2);
    const yyyy = date.getFullYear();
    return `${formattedDay}.${formattedMonth}.${yyyy}`;
};

const requestUserCheck = req => {
    const { username, password } = req.body.user;
    if (username && password) {
        return Promise.resolve({ username, password })
    }
};

const requestMessageCheck = req => {
    const { username, message } = req.body.message;
    if (username && message) {
        return Promise.resolve({ username, message })
    }
};

const getFromMongo = (model, options) => {
    let query = options ? model.findOne(options) : model.find({});
    return query.exec();
}

const isCorrectPassword = (req, user) =>
    bcrypt.compare(req.body.user.password, user.password)
    .then(result => result ? user : null)


const errorHandler = (err, res, next) => {
    console.log('error handler', err)
    res.json({ success: false, message: err.message });
    // next : controller будет пропущен в express.router
    next(err);
}

module.exports = { getDate, requestUserCheck, requestMessageCheck, getFromMongo, isCorrectPassword, errorHandler };
