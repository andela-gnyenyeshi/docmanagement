var Document = require('../models/document'),
  Role = require('../models/role'),
  passport = require('passport'),
  Type = require('../models/doc-type');

module.exports = {
  create: function(req, res, next) {
    if (req.session.user) {
      var document = new Document();
      document.ownerId = req.session.user._id;
      document.title = req.body.title;
      document.content = req.body.content;
      document.dateCreated = Date.now();
      document.accessType = req.body.accessType;
      document.lastModified = Date.now();
    }


    Role.find({
      title: req.body.access || 'Viewer'
    }).exec(function(err, access) {
      if (err) {
        res.status(500).send(err.errormessage || err);
      } else {
        document.accessId = access[0]._id;
        console.log('ROLE', document);

        Type.find({
          type: req.body.type || 'General'
        }).exec(function(err, type) {
          if (err)
           return res.status(500).send(err.errormessage || err);
          document.typeId = type[0]._id;
          console.log('TYPE', document);

          document.save(function(err, doc){
            console.log('SAVE', document);
            console.log(document.ownerId);
            if (err)
              return res.status(500).send(err.errormessage || err);
            res.json(document);
          });
        });
      }
    });

  },

  session: function(req, res, next) {
    if (req.session.user) {
      //console.log(req.session);
        next();
    } else {
      return res.status(401).json({
        error: 'You are not logged in'
      });
    }
  },

  find: function(req, res) {
      Document.find(function(err, document) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else {
          return res.json(document);
        }
      });
  }
};
