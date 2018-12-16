const express = require('express');

const router = express.Router();

const Pharmacy = require('../models/pharmacy');

const User = require('../models/user');

const Person = require('../models/sperson');

const Code = require('../models/usercode');

router.post('/new', (req, res, next) => {
    Code.find().exec().then(doc => {
        const pharma = new Pharmacy({
            _id: mongoose.Types.ObjectId(),
            pharma_name: req.body[i].pharma_name,
            area: req.body.area_id,
            pharma_address: req.body.pharma_address,
            gst_license: req.body.gst,
            drug_license: req.body.drug,
            email: req.body.email,
            contact: req.body.phone,
            owner_name: name
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
        const Person = new Person({
            user: user._id,
            Name: req.body[i].pharma_name,
            Allocated_Area: req.body.area_id,
            Allocated_Pharma: pharma._id
        });
        Person.save();
        console.log(err);
        res.status(200).json({
            code: pharma.code
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/signUp', (rrq, res, next) => {

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
            })
        });
});

router.get('', (req, res, next) => {
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