const express = require('express');
const router = express.Router();
const { authController, loginController, signupController, logoutController } = require('../controllers/authControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, authController);
router.get('/logout', logoutController);
router.post('/login', loginController);
router.post('/signup', signupController);

module.exports = router;
