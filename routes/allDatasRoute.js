const express = require('express');
const router = express.Router();

const getAllDatasController = require('../controllers/getAllDatasController');

// Get Datas from tables: interfaces, categories, configurations, sessions, notifications, tags, interface_categorie, interface_tag.
router.get('/', getAllDatasController.getAllDatas);

module.exports = router;
