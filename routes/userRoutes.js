const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const User = require("../models/user");

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
              subject: "Thank you for regestering with Medicento!",
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
                subject: "Thank you for regestering with Medicento!",
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
              "<table border=\"1\"><tr><td colspan=\"2\">Login Details</td></tr>"+
              "<tr><td>SalesId/Username</td><td>"+req.body.salesId+"</td></tr>"+
              "<tr><td>Password</td><td>"+req.body.password+"</td></tr>"+
              "Url to download the <b>Medicento Sales App!</b>"+
              "https://play.google.com/store/apps/details?id=com.medicento.salesappmedicento<br/>"+
              "Contact Details <br/>"+
              "<table border=\"1\"><tr><td>Salesman Email</td><td>"+req.body.pharma_name+"</td></tr>"+
              "<tr><td>Phone No.</td><td>"+req.body.phone+"</td></tr>"+
              "<tr><td>Email Id</td><td>"+req.body.email+"</td></tr>"+
              "<tr><td>State</td><td>"+req.body.state+"</td></tr>"+
              "<tr><td>City</td><td>"+req.body.city+"</td></tr>"+
              "Warm Regards, <br/>"+
              "Team Medicento<br/>"+
              "<p>This is an auto-generated mail.If you wish to communicatewith us, Please mail us at contact.medicento@gmail.com.</p>"
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
              "<table style=\"border-collapse: collapse;\"><tr style=\"background-color: lightgray;\"><td colspan=\"2\" style=\"border: 1px solid #ddd;padding: 8px;\">Login Details</td></tr>"+
              "<tr><td style=\"border: 1px solid #ddd;padding: 8px;\">SalesId/Username</td><td style=\"border: 1px solid #ddd;padding: 8px;\">"+req.body.salesId+"</td></tr>"+
              "<tr style=\"background-color: lightgray;\"><td style=\"border: 1px solid #ddd;padding: 8px;\">Password</td><td style=\"border: 1px solid #ddd;padding: 8px;\">"+req.body.password+"</td></tr></table>"+
              "Url to download the <b>Medicento Sales App!</b>"+
              "https://play.google.com/store/apps/details?id=com.medicento.salesappmedicento<br/>"+
              "Contact Details <br/>"+
              "<table style=\"border-collapse: collapse;\"><tr style=\"background-color: lightgray;\"><td style=\"border: 1px solid #ddd;padding: 8px;\">Salesman Email</td><td style=\"border: 1px solid #ddd;padding: 8px;\">"+req.body.pharma_name+"</td></tr>"+
              "<tr><td>Phone No.</td><td style=\"border: 1px solid #ddd;padding: 8px;\">"+req.body.phone+"</td></tr>"+
              "<tr style=\"background-color: lightgray;\"><td>Email Id</td><td style=\"border: 1px solid #ddd;padding: 8px;\">"+req.body.email+"</td></tr>"+
              "<tr><td style=\"border: 1px solid #ddd;padding: 8px;\">State</td><td style=\"border: 1px solid #ddd;padding: 8px;\">"+req.body.state+"</td></tr>"+
              "<tr style=\"background-color: lightgray;\"><td style=\"border: 1px solid #ddd;padding: 8px;\">City</td><td style=\"border: 1px solid #ddd;padding: 8px;\">"+req.body.city+"</td></tr></table>"+
              "Warm Regards, <br/>"+
              "Team Medicento<br/>"+
              "<p>This is an auto-generated mail.If you wish to communicatewith us, Please mail us at contact.medicento@gmail.com.</p>"
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
    User.find({
        phone: req.query.phone
      })
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

module.exports = router;