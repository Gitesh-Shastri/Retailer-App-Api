const express = require('express');

const router = express.Router();

const Pharmacy = require('../models/pharmacy');

const mongoose = require('mongoose');

const User = require('../models/user');

const Person = require('../models/sperson');

const Code = require('../models/usercode');

router.post('/new', (req, res, next) => {
    Code.find().exec().then(doc => {
        console.log(doc);
        const pharma = new Pharmacy({
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
        const user = new User({
            useremail: req.body.email,
            usercode: doc[0].code,
            phone: req.body.phone
        });
        doc[0].code = doc[0].code + 1;
        doc[0].save();
        user.save();
        pharma.save();
        const person = new Person({
            user: user._id,
            Name: req.body.pharma_name,
            Allocated_Area: req.body.area_id,
            Allocated_Pharma: pharma._id
        });
        person.save();
        console.log(person);
        res.status(200).json({
            code: user.usercode
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/updateUserProfile', (req, res, next) => {
    Person.findOne({_id:req.query.id})
    .populate('Allocated_Pharma')
    .populate('user')
    .exec()
    .then(doc=> {  
        Pharmacy.update({_id: doc.Allocated_Pharma._id}, {$set: {contact: req.body.phone, email: req.body.email, gst_license: req.body.gst, drug_license: req.body.drug, pan_card: req.body.pan}})
        .exec(); 
        User.update({_id: doc.user._id}, {$set: {phone: req.body.phone, first: req.body.first, second: req.body.second, username: req.body.username, useremail: req.body.email}})
        .exec();    
        res.status(200).json({message: 'updated', data: doc});
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({
            error: err
        });
    });
});

router.get('/updatePharma', (req, res, next) => {
    Person.findOne({_id:req.query.id})
    .populate('Allocated_Pharma')
    .populate('user')
    .exec()
    .then(doc=> {  
        Pharmacy.update({_id: doc.Allocated_Pharma._id}, {$set: {contact: req.query.phone, email: req.query.email, area: req.query.area}})
        .exec(); 
        User.update({_id: doc.user._id}, {$set: {phone: req.query.phone}})
        .exec();    
        Person.update({_id: doc._id}, {$set: {Allocated_Area: req.query.area}})
        .exec();   
         res.status(200).json({message: 'updated', data: doc});
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({
            error: err
        });
    });
});



router.post('/update/:pharmaId', (req, res, next) => {
    const id = req.params.pharmaId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Pharmacy.update({
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
});

router.delete('/delete/:pharmaId', (req, res, next) => {
    const id = req.params.pharmaId;
    Pharmacy.findOneAndRemove({
            _id: id
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
});

router.get('/byName/:name', (req, res, next) => {
    Pharmacy.findOne({
            pharma_name: {
                $regex: req.params.name
            }
        })
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('', (req, res) => {
    page_no = req.query.page_no;
    start = page_no * 10;
    end = (page_no - 1) * 10;
    console.log(page_no);
    Pharmacy.find()
        .select('pharma_name pharma_address area')
        .limit(10)
        .skip((page_no - 1) * 10)
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                pharmas: docs.map(doc => {
                    return {
                        pharma_name: doc.pharma_name,
                        pharma_address: doc.pharma_address,
                        _id: doc._id,
                        area_id: doc.area
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

module.exports = router;