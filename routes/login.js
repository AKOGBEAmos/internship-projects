const express = require("express");
const router = express.Router();

const Controller = require('../controllers/login')


/* views */
router.post('/',Controller.login);
router.post('/deconuser/:user_id/:user_login', Controller.deconnection);

module.exports = router;