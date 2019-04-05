const express = require('express');

const router = express.Router();

const area = require('../models/area');

const AreasController = require('../controllers/area');

router.get('/', AreasController.area_get_all);

router.get('/get_states', AreasController.get_all_state);

router.get('/area_by_name', (req, res, next) => {

    area.find({area_city: req.query.city})
        .select('area_city area_state area_pincode area_name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                areas: docs.map(doc => {
                    return {
                        area_name: doc.area_name,
                        area_city: doc.area_city,
                        area_state: doc.area_state,
                        area_pincode: doc.area_pincode,
                        _id: doc._id
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

});

router.post('/area_by_name_pincode', (req, res, next) => {

    area.find({area_city: req.body.city})
        .select('area_city area_state area_pincode area_name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                areas: docs.map(doc => {
                    return {
                        area_name: doc.area_name,
                        area_city: doc.area_city,
                        area_state: doc.area_state,
                        area_pincode: doc.area_pincode,
                        _id: doc._id
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

});

router.post('/new_state', AreasController.create_state);

router.get('/get_cities_by_state', AreasController.get_all_city_by_state);

router.post('/new_city', AreasController.create_city);

router.post('/new', AreasController.create_area);

router.get('/:areaId', AreasController.area_get_by_id);

router.post('/update/:areaId', AreasController.area_update_by_id);

router.post('/delete/:areaName', AreasController.area_delete_by_id);

module.exports = router;
