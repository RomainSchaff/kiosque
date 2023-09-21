const express = require('express');
const router = express.Router();

const configController = require('../controllers/configController');

// Get Datas from tables: interfaces, categories, configurations, sessions, notifications, tags, interface_categorie, interface_tag.
router.put('/', configController.updateConfigurations);

module.exports = router;