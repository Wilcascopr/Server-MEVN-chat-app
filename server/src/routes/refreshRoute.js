const router = require('express').Router();
const handleRefreshToken = require('../controllers/refreshController')

router.get('/', handleRefreshToken);

module.exports = router;