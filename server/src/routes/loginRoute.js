const router = require('express').Router();
const handleLogin = require('../controllers/loginController');

router.post('/', handleLogin);

module.exports = router;