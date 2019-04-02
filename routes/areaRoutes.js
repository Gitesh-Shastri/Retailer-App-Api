const express = require('express');

const router = express.Router();

const area = require('../models/area');

const AreasController = require('../controllers/area');

router.get('/', AreasController.area_get_all);

router.get('/get_states', AreasController.get_all_state);

router.post('/new_state', AreasController.create_state);

router.get('/get_cities_by_state', AreasController.get_all_city_by_state);

router.post('/new_city', AreasController.create_city);

router.post('/new', AreasController.create_area);

router.get('/:areaId', AreasController.area_get_by_id);

router.post('/update/:areaId', AreasController.area_update_by_id);

router.post('/delete/:areaName', AreasController.area_delete_by_id);

module.exports = router;