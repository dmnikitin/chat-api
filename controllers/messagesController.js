const Message = require('../models/messageModel');
const { errorHandler, getFromMongo, getDate } = require('../helpers/index');


const requestMessageCheck = req => {
    const { username, message } = req.body.message;
    if (username && message) {
        return Promise.resolve({ username, message })
    }
};

const addMessageController = (req, res, next) =>
    requestMessageCheck(req)
    .then(message => {
        const date = getDate(new Date());
        const newMessage = new Message({ username: message.username, content: message.content, date });
        return newMessage.save()
    })