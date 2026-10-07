const express = require('express');
const router = express.Router();
const yapeController = require('../controllers/yapeController');

router.post('/notificacion', yapeController.recibirNotificacion);

module.exports = router;