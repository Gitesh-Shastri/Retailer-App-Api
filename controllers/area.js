const mongoose = require('mongoose');

const Area = require('../models/area');

const State = require('../models/medicento_state');

const City = require('../models/medicento_city');

exports.area_get_all = function (req, res) {
    Area.find()
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
}

exports.create_area = function (req, res) {
    const area = new Area({
        area_id: new mongoose.Types.ObjectId(),
        area_name: req.body.area_name,
        area_city: req.body.area_city,
        area_state: req.body.area_state,
        area_pincode: req.body.area_pincode
    });
    area.save().then(result => {
            console.log(result);
            res.status(200).json({
                message: "Created Area Successfully !",
                area: {
                    area_name: result.area_name,
                    area_city: result.area_city,
                    area_state: result.area_state,
                    area_pincode: result.area_pincode,
                    _id: result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.area_get_by_id = function (req, res) {
    const id = req.params.areaId;
    Area.findById(id)
        .select('area_city area_state area_pincode area_name')
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                message: "No Valid Entry for provided ID"
            });
        });
}

exports.area_update_by_id = function (req, res) {
    const id = req.params.areaId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Area.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

exports.area_delete_by_id = function (req, res) {
    const area_name = req.params.areaName;
    Area.findOneAndRemove({
            area_name: area_name
        })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.create_state = function (req, res) {

    var state  = new State();
    state.name = req.body.name;
    state.save()
        .then( state_doc => {
            res.status(200).json({state: state_doc, message: 'Created State'});
        })
        .catch( err => {
            res.status(200).json({message: err.errmsg});
        });

   

};

exports.get_all_state = function (req, res) {

        State.find({})
        .sort({ name: 1 })
        .then( state_doc => {
            res.status(200).json({state: state_doc, message: 'State List'});
        })
        .catch( err => {
            res.status(200).json({message: err.errmsg});
        });

};


exports.create_city = function (req, res) {

    var city  = new City();
    city.name = req.body.name;
    city.state = req.body.state;
    city.save()
        .then( city_doc => {
            res.status(200).json({state: city_doc, message: 'Created City'});
        })
        .catch( err => {
            res.status(200).json({message: err.errmsg});
        });

   

};

exports.get_all_city_by_state = function (req, res) {

        City.find({state: req.body.state})
        .sort({ name: 1 })
        .then( city_doc => {
            res.status(200).json({state: city_doc, message: 'City List'});
        })
        .catch( err => {
            res.status(200).json({message: err.errmsg});
        });

};