const express = require('express');

const Message = require('../models/message');

const app_version = require('../models/retailer_app_version');

const router = express.Router();

router.get('/app_version', (req, res, next) => {

    app_version.findOne({})
                .exec()
                .then(app_version => {
                    Message.findOne({})
                    .exec()
                    .then(message => {
                        res.status(200).json({
                            code: message.code,
                            count: message.count,
                            app_version: app_version
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });

                })
                .catch( err => {
                    res.status(500).json({
                        error: err
                    });
                });
});

module.exports = router;