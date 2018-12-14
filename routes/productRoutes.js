const express = require('express');

const router = express.Router();
const Order = require('../models/SalesOrder');
const SalesOrderItems = require('../models/SalesOrderItems');
const vpiinventory = require('../models/vpimedicine');
const Camp = require('../models/camp');

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

router.get("/recent_order/:id", (req, res, next) => {
    console.log(req.query.status);
    Order.find({
            pharmacy_id: req.params.id
        })
        .select("created_at grand_total sales_order_code")
        .populate("order_items")
        .exec()
        .then(docs => {
            const response = {
                orders: docs.map(doc => {
                    return {
                        order_id: doc.sales_order_code,
                        created_at: doc.created_at,
                        grand_total: doc.grand_total,
                        order_items: doc.order_items
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get("/notification", (req, res, next) => {
    Camp.find()
        .exec()
        .then(doc => {
            var doc1 = doc[doc.length - 1];
            res.status(200).json({
                title: doc1.name,
                type: doc1.type,
                content: doc1.content
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;