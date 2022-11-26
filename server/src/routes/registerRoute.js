const router = require('express').Router();
const handleRegister = require('../controllers/registerController');

router.post('/', handleRegister);

module.exports = router;