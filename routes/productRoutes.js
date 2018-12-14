const express = require('express');

const router = express.Router();

const vpiinventory = require('../models/vpimedicine');

router.get("/medimap", (req, res) => {
    vpiinventory
        .find()
        .sort({
            Item_name: 1
        })
        .select("Item_name manfc_name mrp qty item_code")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        medicento_name: doc.Item_name,
                        company_name: doc.manfc_name,
                        price: doc.mrp,
                        stock: doc.qty,
                        item_code: doc.item_code,
                        _id: doc._id
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;