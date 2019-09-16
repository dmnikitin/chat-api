const Message = require('../models/messageModel');
const { errorHandler, getFromMongo, getDate } = require('../helpers/index');

const addMessageController = (username, content) => {
    if (username && content) {
        const date = getDate(new Date());
        const newMessage = new Message({ username, content, date });
        return newMessage.save()
    }
}

const getMessagesController = (req, res, next) =>
    getFromMongo(Message)
    .then(messages => messages && messages.length ? messages : Promise.reject({ message: 'There is no messages yet' }))
    .then(messages => res.json({ success: true, messages }))
    .catch(err => errorHandler(err, res, next))

module.exports = { addMessageController, getMessagesController }
