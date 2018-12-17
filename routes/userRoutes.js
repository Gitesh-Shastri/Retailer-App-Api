const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

const Area = require('../models/area');

const Pharma = require('../models/pharmacy');

const Code = require('../models/usercode');

const Person = require('../models/sperson');

const Message = require('../models/message');

router.post('/login', (req, res, next) => {
    console.log(req.body);
    if (req.body.email == "") {
        User.find({
                phone: req.body.phone
            })
            .exec()
            .then(doc1 => {
                if (doc1.length > 0) {
                    res.status(200).json({
                        message: 'User Phone Exists Please Try Another One !'
                    });
                } else {
                    Code.find().exec().then(doc => {
                        console.log(doc);
                        const pharma = new Pharma({
                            _id: mongoose.Types.ObjectId(),
                            pharma_name: req.body.pharma_name,
                            area: req.body.area_id,
                            pharma_address: req.body.pharma_address,
                            gst_license: req.body.gst,
                            drug_license: req.body.drug,
                            email: req.body.email,
                            contact: req.body.phone,
                            owner_name: req.body.name,
                            pincode: req.body.pincode
                        });
                        const user1 = new User({
                            useremail: req.body.phone,
                            usercode: doc[0].code,
                            phone: req.body.phone
                        });
                        doc[0].code = doc[0].code + 1;
                        doc[0].save();
                        user1.save();
                        pharma.save();
                        const person = new Person({
                            user: user1._id,
                            Name: req.body.pharma_name,
                            Allocated_Area: req.body.area_id,
                            Allocated_Pharma: pharma._id
                        });
                        person.save();
                        console.log(user1);
                        res.status(200).json({
                            code: user1.usercode,
                            message: 'user created !'
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
    } else {
        User.find({
                useremail: req.body.email
            })
            .exec()
            .then(user => {
                if (user.length > 0) {
                    res.status(200).json({
                        message: 'User Email Exists Please Try Another One !'
                    });
                } else {
                    Code.find().exec().then(doc => {
                        console.log(doc);
                        const pharma = new Pharma({
                            _id: mongoose.Types.ObjectId(),
                            pharma_name: req.body.pharma_name,
                            area: req.body.area_id,
                            pharma_address: req.body.pharma_address,
                            gst_license: req.body.gst,
                            drug_license: req.body.drug,
                            email: req.body.email,
                            contact: req.body.phone,
                            owner_name: req.body.name,
                            pincode: req.body.pincode
                        });
                        const user1 = new User({
                            useremail: req.body.email,
                            usercode: doc[0].code,
                            phone: req.body.phone
                        });
                        doc[0].code = doc[0].code + 1;
                        doc[0].save();
                        user1.save();
                        pharma.save();
                        const person = new Person({
                            user: user1._id,
                            Name: req.body.pharma_name,
                            Allocated_Area: req.body.area_id,
                            Allocated_Pharma: pharma._id
                        });
                        person.save();
                        console.log(user1);
                        res.status(200).json({
                            code: user1.usercode,
                            message: 'user created !'
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            }).catch(err => {
                res.status(500).json({
                    err: err
                });
            });
    }
});

router.get('/login', (req, res, next) => {
    if (req.query.useremail != null) {
        User.findOne({
                useremail: req.query.useremail
            })
            .exec()
            .then(user => {
                console.log(user);
                Person.find({
                        user: user._id
                    })
                    .exec()
                    .then(doc => {
                        res.status(200).json({
                            Sales_Person: doc
                        })
                    });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Invalid Useremail or password"
                });
            });
    } else if (req.query.phone != null) {
        User.findOne({
                phone: req.query.phone
            })
            .exec()
            .then(user => {
                console.log(user);
                Person.find({
                        user: user._id
                    })
                    .exec()
                    .then(doc => {
                        res.status(200).json({
                            Sales_Person: doc
                        })
                    });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Invalid Phone Number"
                });
            });
    } else {
        User.findOne({
                usercode: req.query.usercode
            })
            .exec()
            .then(user => {
                console.log(user);
                Person.find({
                        user: user._id
                    })
                    .exec()
                    .then(doc => {
                        res.status(200).json({
                            Sales_Person: doc
                        })
                    });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Invalid Useremail or password"
                });
            });
    }
});

module.exports = router;