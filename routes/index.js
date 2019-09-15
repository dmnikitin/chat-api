const express = require('express');
const router = express.Router();
const { authController, loginController, signupController, logoutController } = require('../controllers/authControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getMessagesController, addMessageController } = require('../controllers/messagesControllers');

router.get('/', authMiddleware, authController);
router.get('/logout', logoutController);
router.post('/login', loginController);
router.post('/signup', signupController);

router.get('/messages', getMessagesController)
router.post('/addmessage', addMessageController)

module.exports = router;
