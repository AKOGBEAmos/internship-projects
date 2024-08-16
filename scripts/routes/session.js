const express = require("express");
const router = express.Router();

const Controller = require('../controllers/login')


/* views */
router.post('/rstemail', Controller.resetEmail);
router.post('/passwordreset', Controller.resetPassword);
router.post('/sessions', Controller.expiredSession);

module.exports = router;