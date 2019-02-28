const Product = require("../models/Product");
const OrderCode = require("../models/sales_order_code");
const Pharmacy = require("../models/pharmacy");
const Review = require("../models/review");
const Person = require("../models/sperson");
const OrderItem = require("../models/SalesOrderItems");
const fs = require("fs");
const Order = require("../models/SalesOrder");
const Log = require("../models/logs");
const mongoose = require("mongoose");
const express = require("express");
const Message = require('../models/message');
const router = express.Router();
const moment = require("moments");
const Camp = require("../models/camp");
const fast_csv = require("fast-csv");
const vpiinventory = require("../models/vpimedicine");
var nodeoutlook = require("nodejs-nodemailer-outlook");
const tulsiinverntory = require("../models/tulsimedicines");

router.get("/medimap", (req, res) => {
    vpiinventory
        .find()
        .sort({
            Item_name: 1
        })
        .select("Item_name manfc_name mrp qty item_code packing")
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
                        _id: doc._id,
                        packing: doc.packing
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


router.post("/order", (req, res, next) => {
    const log = new Log();
    log.logd = JSON.stringify(req.body);
    log.created_at = new Date();
    log.save();
    var csv = "Party Code, Item Code, Item Name, Qty\n";
    var date = new Date();
    console.log(date.toISOString());
    OrderCode.find().exec().then(doc_order_code => {
        Pharmacy.findOne({
                _id: req.body[0].pharma_id
            })
            .populate("area")
            .exec()
            .then(docp => {
                message =
                    "<h3>Pharmacy Name: " +
                    docp.pharma_name +
                    "</h3><h4>Area Name: " +
                    docp.area.area_name +
                    "</h4><h4>Address : " +
                    docp.pharma_address +
                    "</h4>";
                message +=
                    '<table border="1" style="width:100%"><tr><th style="width:60%">Medicine Name</th><th style="width:20%">Medicine Code</th><th style="width:10%">Quantity</th><th style="width:10%">Cost</th></tr>';
                var deliverdate = date;
                deliverdate.setDate(deliverdate.getDate() + 1);
                deliverdate = deliverdate.toLocaleDateString();
                count = req.body.length - 1;
                total = 0;
                orderid = "";
                for (i = 0; i < count; i++) {
                    cost = Number(req.body[i].cost);
                    total += cost;
                }
                Person.findOne({
                        _id: req.body[0].salesperson_id
                    })
                    .populate("user")
                    .exec()
                    .then(salesP => {
                        orders = [];
                        for (i = 0; i < count; i++) {
                            const orderItem = new OrderItem();
                            (orderItem.quantity = req.body[i].qty),
                            (orderItem.paid_price = req.body[i].rate),
                            (orderItem.code = req.body[i].code),
                            (orderItem.created_at = date),
                            (orderItem.medicento_name = req.body[i].medicento_name),
                            (orderItem.company_name = req.body[i].company_name),
                            (orderItem.total_amount = req.body[i].cost);
                            orderItem.save();
                            orders.push(orderItem._id);
                            csv +=
                                salesP.user.useremail +
                                "," +
                                req.body[i].code +
                                "," +
                                req.body[i].medicento_name +
                                "," +
                                req.body[i].qty +
                                "\n";
                            message +=
                                '<tr><td style="width:60%">' +
                                req.body[i].medicento_name +
                                '</td><td style="width:20%">' +
                                req.body[i].code +
                                '</td><td style="width:10%">' +
                                req.body[i].qty +
                                '</td><td style="width:10%">' +
                                req.body[i].cost +
                                "</td></tr>";
                        }
                        console.log(doc_order_code[0].code);
                        const order = new Order();
                        order.created_at = date;
                        order.pharmacy_id = req.body[0].pharma_id;
                        order.sales_person_id = req.body[0].salesperson_id;
                        order.sales_order_code = doc_order_code[0].code;
                        order.grand_total = total;
                        order.delivery_date = deliverdate;
                        order.status = "Active";
                        for (i = 0; i < count; i++) {
                            order.order_items.push(orders[i]);
                        }
                        order.save();
                        console.log(order);
                        OrderCode.findOneAndUpdate({
                            _id: doc_order_code[0]._id
                        }, {
                            $set: {
                                code: doc_order_code[0].code + 1
                            }
                        }, {
                            new: true
                        }, (error, update_code) => {
                            /*  var message1	= {
                                         text:	"i hope this works", 
                                         from:	"Gitesh <giteshmedicento@gmail.com>", 
                                         to:		"Gitesh <giteshmedicento@gmail.com>",
                                         subject:	"testing emailjs",
                                         attachment: 
                                         [
                                            {data: message, alternative:true}
                                         ]
                                      };
                                      
                                      // send the message and get a callback with an error or details of the message that was sent
                                      server.send(message1, function(err, message) { console.log(err || message); });
                                   */
                            /*var nodemailer = require('nodemailer');
 /*   const mailOptions = {
	    from: 'giteshmedicento@gmail.com', // sender address
	    to: 'giteshshastri100@gmail.com', // list of receivers
	    html: message + '<p>Grand Total = ' + total +'</p>'// plain text body
    };
    */
                            console.log(csv);
                            Person.findOne({
                                    _id: req.body[0].salesperson_id
                                })
                                .populate("user")
                                .exec()
                                .then(sales => {
                                    content =
                                        "Order has been placed by " +
                                        docp.pharma_name +
                                        " on " +
                                        date.toISOString(); // Subject line
                                    message =
                                        message +
                                        '<td style="width:60%"></td><td colspan="2" style="width:40%">Grand Total = ' +
                                        total +
                                        "</td>";
                                    nodeoutlook.sendEmail({
                                        auth: {
                                            user: "giteshshastri123@outlook.com",
                                            pass: "shastri@1"
                                        },
                                        from: "giteshshastri123@outlook.com",
                                        to: "giteshshastri96@gmail.com,contact.medicento@gmail.com",
                                        subject: content,
                                        html: message,
                                        attachments: [{
                                            filename: "SalesOrder_Medicento_" +
                                                docp.pharma_name +
                                                "_" +
                                                sales.user.useremail +
                                                "_" +
                                                date.toISOString() +
                                                ".csv",
                                            content: csv
                                        }]
                                    });
                                    console.log("Sales id : ", sales);
                                    Person.update({
                                            _id: sales._id
                                        }, {
                                            Total_sales: sales.Total_sales + total,
                                            No_of_order: sales.No_of_order + 1,
                                            Earnings: sales.commission * (sales.Total_sales + total)
                                        })
                                        .exec()
                                        .then((err, updated) => {
                                            /*             transporter.sendMail(mailOptions, function (err, info) {
                        if(err)
                          console.log(err)
                        else
                          console.log(info);
                     });
		*/
                                            res.status(200).json({
                                                message: "Order has been placed successfully",
                                                delivery_date: order.delivery_date.toLocaleString(),
                                                order_id: "" + order.sales_order_code,
                                                grand_total: order.grand_total
                                            });
                                        });
                                });
                        });
                    });
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
                    "version": "2.1.7",
                    "error": "01"
                }],
                "Controle": [{
                    "version": "2.1.7",
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
