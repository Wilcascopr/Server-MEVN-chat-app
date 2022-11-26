const router = require('express').Router();
const handleUserData = require('../controllers/userController');

router.get('/', handleUserData);

module.exports = router;