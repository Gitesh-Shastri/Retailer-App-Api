const express = require('express');

const router = express.Router();
const Order = require('../models/SalesOrder');
const SalesOrderItems = require('../models/SalesOrderItems');
const vpiinventory = require('../models/vpimedicine');
const Camp = require('../models/camp');
const Message = require('../models/message');

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

router.get('/updateApp', (req, res, next) => {
    Message.find()
        .exec()
        .then(doc => {
            res.status(200).json({
                code: doc[0].code,
                count: doc[0].count,
                "Version": [{
                    "version": "2.0.8",
                    "error": "01"
                }],
                "Controle": [{
                    "version": "2.0.8",
                    "error": "01"
                }]
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;