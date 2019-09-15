const Message = require('../models/messageModel');
const { requestMessageCheck, errorHandler, getFromMongo, getDate } = require('../helpers/index');

const addMessageController = (req, res, next) =>
    requestMessageCheck(req)
    .then(message => {
        const date = getDate(new Date());
        const newMessage = new Message({ username: message.username, content: message.content, date });
        return newMessage.save()
    })
    .then(() => getFromMongo(Message))
    .then(messages => messages && messages.length ? messages : Promise.reject({ message: 'There is no messages yet' }))
    .then(messages => res.json({ success: true, messages }))
    .catch(err => errorHandler(err, res, next))

const getMessagesController = (req, res, next) =>
    getFromMongo(Message)
    .then(messages => messages && messages.length ? messages : Promise.reject({ message: 'There is no messages yet' }))
    .then(messages => res.json({ success: true, messages }))
    .catch(err => errorHandler(err, res, next))

module.exports = { addMessageController, getMessagesController }
