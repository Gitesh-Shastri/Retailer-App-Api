const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const User = require("../models/user");

var async = require("async");
const Area = require("../models/area");

const Pharma = require("../models/pharmacy");

const nodeoutlook = require('nodejs-nodemailer-outlook');

const Code = require("../models/usercode");

const Person = require("../models/sperson");

const Message = require("../models/message");

router.post("/login", (req, res, next) => {
  console.log(req.body);
  if (req.body.email == "") {
    User.find({
        phone: req.body.phone
      })
      .exec()
      .then((doc1) => {
        if (doc1.length > 0) {
          res.status(200).json({
            message: "User Phone Exists Please Try Another One !"
          });
        } else {
          Code.find()
            .exec()
            .then((doc) => {
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
                Allocated_Pharma: pharma._id,
                address: req.body.pharma_address,
                driving: req.body.driving,
                pan: req.body.pan
              });
              person.save();
              console.log(user1);
              message1 = "<p>Retailer Login Url : https://medicento-website.herokuapp.com/pharmacy_login</p>" +
              "<p>Retailer App Link :https://play.google.com/store/apps/details?id=com.medicento.retailerappmedi</p>" +
              "PharmaCode : " + code;
            nodeoutlook.sendEmail({
              auth: {
                user: "Team.medicento@outlook.com",
                pass: "med4lyf@51"
              },
              from: "Team.medicento@outlook.com",
              to: "" + req.body.email + ",giteshshastri96@gmail.com,contact.medicento@gmail.com",
              subject: "Congratulations! You've successfully registered as a Retailer with Medicento!",
              html: message1
            });
              res.status(200).json({
                code: user1.usercode,
                message: "user created !"
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(200).json({
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
      .then((user) => {
        if (user.length > 0) {
          res.status(200).json({
            message: "User Email Exists Please Try Another One !"
          });
        } else {
          Code.find()
            .exec()
            .then((doc) => {
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
              const code = doc[0].code;
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
              Area.findById(person.Allocated_Area).exec().then( area_for_details => {
              person.save();
              console.log(user1);
              var date = new Date();
              message1 = "<p> Hi "+req.body.name +", <br/><br/> Congratulations for Successfully registering with Medicento. We are pleased to have you here and looking "+
              "looking forward to work with you.<br/><br/><br/>"+
              "Please find below details for your reference : </p>"+
              "<table width=\"100%\" style=\"border-collapse: collapse;\"><tr style=\"background-color: #1F3864;color:white;text-align:center\"><td colspan=\"2\" style=\"border: 1px solid black;padding: 8px;text-align:center\">Login Details</td></tr>"+
              "<tr><td style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">PharmaCode</td><td style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">"+code+"</td></tr>"+
              "<tr><td style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">Registered Mobile No.</td><td style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">"+req.body.phone+"</td></tr></table>"+
              "<br/>Url to download the <b>Medicento Retailer App!</b><br/>"+
              "https://play.google.com/store/apps/details?id=com.medicento.retailerappmedi<br/>"+
              "<table width=\"100%\" style=\"border-collapse: collapse;\"><tr style=\"background-color: #1F3864;color:white;text-align:center\"><td colspan=\"2\" style=\"border: 1px solid black;padding: 8px;text-align:center\">Contact Details</td><tr>"+
              "<tr><td style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">Shop Name</td><td  style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">"+req.body.pharma_name+"</td></tr>"+
              "<tr><td style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">Owner Name</td><td  style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">"+req.body.name+"</td></tr>"+
              "<tr><td  style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">Email Id</td><td  style=\"border: 1px solid black;padding: 8px;text-align:center\">"+req.body.email+"</td></tr>"+
              "<tr><td  style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">State</td><td  style=\"border: 1px solid black;padding: 8px;text-align:center\">"+area_for_details.area_state+"</td></tr>"+
              "<tr><td style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">City</td><td  style=\"border: 1px solid black;padding: 8px;text-align:center\">"+area_for_details.area_city+"</td></tr></table><br/>"+
              "<table width=\"100%\" style=\"border-collapse: collapse;\"><tr style=\"background-color: #1F3864;color:white;text-align:center\"><td colspan=\"2\"  style=\"border: 1px solid black;padding: 8px;text-align:center\">Verification Details</td></tr>"+
              "<tr><td  style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">GST No.</td><td  style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">"+req.body.gst+"</td></tr>"+
              "<tr><td  style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">Drug License No.</td><td  style=\"border: 1px solid black;padding: 8px;text-align:center;width:50%\">"+req.body.drug+"</td></tr></table>"+
              "<br/>Warm Regards, <br/>"+
              "Team Medicento<br/><br/>"+
              "<p>This is an auto-generated mail.If you wish to communicatewith us, Please mail us at contact.medicento@gmail.com.</p>"
              var mailOptions = {
                auth: {
                  user: "Team.medicento@outlook.com",
                  pass: "med4lyf@51"
                },
                from: "Team.medicento@outlook.com",
                to: req.body.email+",giteshshastri96@gmail.com,contact.medicento@gmail.com",
                subject: "Congratulations! You've successfully registered as a Retailer with Medicento",
                html: message1
              };  
                nodeoutlook.sendEmail(mailOptions, (err, mail_message) => {
                  if(err) {
                    console.log(err);
                  } else {
                    console.log(mail_message);
                  }     
                });
              });
             res.status(200).json({
                code: user1.usercode,
                message: "user created !"
              });
        })
            .catch((err) => {
              console.log(err);
              res.status(200).json({
                error: err
              });
            });
        }
      })
      .catch((err) => {
        res.status(200).json({
          err: err
        });
      });
  }
});

router.post("/saleslogin", (req, res, next) => {
  console.log(req.body);
  if (req.body.email == "") {
    User.find({
        phone: req.body.phone
      })
      .exec()
      .then((doc1) => {
        if (doc1.length > 0) {
          res.status(200).json({
            message: "User Phone Exists Please Try Another One !"
          });
        } else {
          Code.find()
            .exec()
            .then((doc) => {
              console.log(doc);
              const user1 = new User({
                useremail: req.body.phone,
                usercode: doc[0].code,
                phone: req.body.phone,
                password: req.body.password,
                salesId: req.body.salesId
              });
              doc[0].code = doc[0].code + 1;
              doc[0].save();
              user1.save();
              const person = new Person({
                user: user1._id,
                Name: req.body.pharma_name,
                state: req.body.state,
                city: req.body.city,
                Allocated_Area: "5b28cf4a4381b00448fcbb27",
                Allocated_Pharma: "5c1662278583dd0023fed344",
                address: req.body.pharma_address,
                driving: req.body.driving,
                pan: req.body.pan
              });
              person.save();
              console.log(user1);
              message1 = "<p> Dear "+req.body.pharma_name +", <br/> Warm greetings from Medicento! <br/> Congratulations You have successfully registered as a Salesman with Medicento. Please"+
              " find below details for your reference : </p>"+
              "<table width=\"100%\" style=\"border-collapse: collapse;\"><tr style=\"background-color: darkgray;color:white\"><th colspan=\"2\" style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">Login Details</th></tr>"+
              "<tr ><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">SalesId/Username</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.salesId+"</td></tr>"+
              "<tr style=\"background-color: lightgray;color:white\"><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">Password</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.password+"</td></tr></table>"+
              "<br/>URL to download the <b>Medicento Sales App!</b><br/>"+
              "https://play.google.com/store/apps/details?id=com.medicento.salesappmedicento<br/>"+
              "<br/>"+
              "<table width=\"100%\" style=\"border-collapse: collapse;\"><tr style=\"background-color: darkgray;color:white\"><th colspan=\"2\" style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">Contact Details</th></tr>"
              +"<tr ><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">salesman name</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.pharma_name+"</td></tr>"+
              "<tr style=\"background-color: lightgray;color:white\"><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">Phone No.</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.phone+"</td></tr>"+
              "<tr ><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center;width:50%\">Email Id</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center;width:50%\">"+req.body.email+"</td></tr>"+
              "<tr style=\"background-color: lightgray;color:white\"><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center;width:50%\">State</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center;width:50%\">"+req.body.state+"</td></tr>"+
              "<tr ><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center;width:50%\">City</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center;width:50%\">"+req.body.city+"</td></tr></table>"+
              "<br/><br/>Warm Regards, <br/>"+
              "Team Medicento<br/>"+
              "<p>This is an auto-generated mail.If you wish to communicate with us, Please mail <br/>us at contact.medicento@gmail.com.</p>"
                nodeoutlook.sendEmail({
                auth: {
                  user: "Team.medicento@outlook.com",
                  pass: "med4lyf@51"
                },
                from: "Team.medicento@outlook.com",
                to: "" + req.body.email + ",giteshshastri96@gmail.com,contact.medicento@gmail.com",
                subject: "Hi "+req.body.pharma_name+", You have successfully registered as a Salesman with Medicento!",
                html: message1
              });
              res.status(200).json({
                code: user1.usercode,
                message: "user created !"
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(200).json({
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
      .then((user) => {
        if (user.length > 0) {
          res.status(200).json({
            message: "User Email Exists Please Try Another One !"
          });
        } else {
          Code.find()
            .exec()
            .then((doc) => {
              console.log(doc);
              const user1 = new User({
                useremail: req.body.email,
                usercode: doc[0].code,
                phone: req.body.phone,
                password: req.body.password,
                salesId: req.body.salesId
              });
              const code = doc[0].code;
              doc[0].code = doc[0].code + 1;
              doc[0].save();
              user1.save();
              const person = new Person({
                user: user1._id,
                Name: req.body.pharma_name,
                state: req.body.state,
                city: req.body.city,
                Allocated_Area: "5b28cf4a4381b00448fcbb27",
                Allocated_Pharma: "5c1662278583dd0023fed344",
                address: req.body.pharma_address,
                driving: req.body.driving,
                pan: req.body.pan
              });
              person.save();
              console.log(user1);
              message1 = "<p> Dear "+req.body.pharma_name +", <br/> Warm greetings from Medicento! <br/> Congratulations You have successfully registered as a Salesman with Medicento. Please"+
              " find below details for your reference : </p>"+
              "<table width=\"100%\" style=\"border-collapse: collapse;\"><tr style=\"background-color: darkgray;color:white\"><th colspan=\"2\" style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">Login Details</th></tr>"+
              "<tr ><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">SalesId/Username</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.salesId+"</td></tr>"+
              "<tr style=\"background-color: lightgray;color:white\"><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">Password</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.password+"</td></tr></table>"+
              "<br/>URL to download the <b>Medicento Sales App!</b><br/>"+
              "https://play.google.com/store/apps/details?id=com.medicento.salesappmedicento<br/>"+
              "<br/>"+
              "<table width=\"100%\" style=\"border-collapse: collapse;\"><tr style=\"background-color: darkgray;color:white\"><th colspan=\"2\" style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">Contact Details</th></tr>"
              +"<tr ><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">salesman name</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.pharma_name+"</td></tr>"+
              "<tr style=\"background-color: lightgray;color:white\"><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">Phone No.</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.phone+"</td></tr>"+
              "<tr ><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">Email Id</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.email+"</td></tr>"+
              "<tr style=\"background-color: lightgray;color:white\"><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">State</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.state+"</td></tr>"+
              "<tr ><td style=\"border: 1px solid #ddd;padding: 8px;align:center\">City</td><td style=\"border: 1px solid #ddd;padding: 8px;text-align:center\">"+req.body.city+"</td></tr></table>"+
              "<br/><br/>Warm Regards, <br/>"+
              "Team Medicento<br/>"+
              "<p>This is an auto-generated mail.If you wish to communicate with us, Please mail <br/>us at contact.medicento@gmail.com.</p>"
              nodeoutlook.sendEmail({
                auth: {
                  user: "Team.medicento@outlook.com",
                  pass: "med4lyf@51"
                },
                from: "Team.medicento@outlook.com",
                to: "" + req.body.email + ",giteshshastri96@gmail.com,contact.medicento@gmail.com",
                subject: "Hi "+req.body.pharma_name+", You have successfully registered as a Salesman with Medicento!",
                html: message1
              });
              res.status(200).json({
                code: user1.usercode,
                message: "user created !"
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(200).json({
                error: err
              });
            });
        }
      })
      .catch((err) => {
        res.status(200).json({
          err: err
        });
      });
  }
});

router.get("/login", (req, res, next) => {
  if (req.query.useremail != null) {
    User.findOne({
        useremail: req.query.useremail
      })
      .exec()
      .then((user) => {
        console.log(user);
        Person.find({
            user: user._id
          })
          .exec()
          .then((doc) => {
            res.status(200).json({
              Sales_Person: doc
            });
          });
      })
      .catch((err) => {
        res.status(200).json({
          message: "Invalid Useremail or password"
        });
      });
  } else if (req.query.phone != null) {
    User.findOne({
        phone: req.query.phone
      })
      .exec()
      .then((user) => {
        console.log(user);
        Person.find({
            user: user._id
          })
          .exec()
          .then((doc) => {
            res.status(200).json({
              Sales_Person: doc
            });
          });
      })
      .catch((err) => {
        res.status(200).json({
          message: "Invalid Phone Number"
        });
      });
  } else {
    User.findOne({
        usercode: req.query.usercode
      })
      .exec()
      .then((user) => {
        console.log(user);
        Person.find({
            user: user._id
          })
          .populate('user')
          .exec()
          .then((doc) => {
            res.status(200).json({
              Sales_Person: doc
            });
          });
      })
      .catch((err) => {
        res.status(200).json({
          message: "Invalid Useremail or password"
        });
      });
  }
});

router.get("/profile", (req, res, next) => {
  Person.findOne({
      _id: req.query.id
    })
    .populate("user")
    .populate("Allocated_Pharma")
    .exec()
    .then((perosnDoc) => {
      if (perosnDoc.Allocated_Pharma.owner_name == undefined) {
        perosnDoc.Allocated_Pharma.owner_name = "";
      }
      if (perosnDoc.Allocated_Pharma.address == undefined) {
        perosnDoc.Allocated_Pharma.address = "";
      }
      if (perosnDoc.user.useremail == undefined) {
        perosnDoc.user.useremail = "";
      }
      if (perosnDoc.user.phone == undefined) {
        perosnDoc.user.phone = "";
      }
      res.status(200).json({
        email: perosnDoc.user.useremail,
        phone: perosnDoc.user.phone,
        owner: perosnDoc.Allocated_Pharma.owner_name,
        address: perosnDoc.Allocated_Pharma.address,
        message: "ID Found !"
      });
    })
    .catch((err) => {
      res.status(200).json({
        message: "Invalid Id !"
      });
    });
});

router.get("/pharmaById/:id", (req, res, next) => {
  Person.find({
      Allocated_Pharma: req.params.id
    })
    .populate("Allocated_Pharma")
    .populate("user")
    .exec()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(200).json({
        message: err
      });
    });
});

router.get("/forgetPhone", (req, res, next) => {
  console.log(req.query);
  if (req.query.phone != undefined) {
    User.find({$or: [{
        phone: req.query.phone
      }, {
        useremail: req.query.phone
      }]})
      .exec()
      .then((phone) => {
        res.status(200).json({
          message: "user found",
          code: phone[0].usercode
        });
      })
      .catch((err) => {
        res.status(200).json({
          message: "Invalid Phone"
        });
      });
  } else {
    res.status(200).json({
      message: "Invalid Phone"
    });
  }
});

router.get('/lastItem', (req, res, next) => {
      Pharma.find().sort({_id:1}).limit(17).exec().then( sperson => {
        res.status(200).json(sperson);
      })
});

module.exports = router;
