const { socketMiddleware } = require('../middlewares/index');
const { addMessageController } = require('./messagesControllers');

const socketHandler = io => {
    io.use(socketMiddleware);
    io.on('connection', (socket) => {
        socket.on('send-message', (newMessage) => {
            const { username, content } = newMessage;
            if (username === socket.verified.user.username) {
                return addMessageController(socket.verified.user.username, content)
                    .then(message => io.emit('new-message', message))
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    })
    return (req, res, next) => {
        res.io = io;
        next();
    };
}

module.exports = { socketHandler };
