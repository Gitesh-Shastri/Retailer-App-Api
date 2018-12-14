const express = require('express');

const router = express.Router();


const User = require('../models/user');

const Area = require('../models/area');

const Pharma = require('../models/pharmacy');

const Person = require('../models/sperson');

const Message = require('../models/message');

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
