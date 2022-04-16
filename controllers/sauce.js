// in controllers

const Sauce = require('../models/sauce');
const fs = require('fs');

exports.get = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({
      error
    }));
};
exports.save = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    like: 0,
    dislike: 0
  });
  sauce.save()
    .then(() => res.status(201).json({
      message: 'Sauce enregistré !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};
exports.getOne = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({
      error
    }));
};
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {
    ...req.body
  };
  Sauce.updateOne({
      _id: req.params.id
    }, {
      ...sauceObject,
      _id: req.params.id
    })
    .then(() => res.status(200).json({
      message: 'Sauce modifié !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({
            _id: req.params.id
          })
          .then(() => res.status(200).json({
            message: 'Sauce supprimé !'
          }))
          .catch(error => res.status(400).json({
            error
          }));
      });
    })
    .catch(error => res.status(500).json({
      error
    }));
};
exports.likeSauce = async (req, res, next) => {
  try {


    const sauce = await Sauce.findOne({
      _id: req.params.id
    });
    if (!sauce) {
      res.status(404).json({
        message: 'not found !'
      })
      return;
    }
    switch (req.body.like) {
      case 1:

        await Sauce.updateOne({
          _id: req.params.id
        }, {
          $inc: {
            likes: 1
          },
          $push: {
            usersLiked: req.body.userId
          },
          _id: req.params.id
        });
        res.status(201).json({
          message: 'Tu aime'
        });

        break;
      case -1:
        await Sauce.updateOne({
          _id: req.params.id
        }, {
          $inc: {
            dislikes: 1
          },
          $push: {
            usersDisliked: req.body.userId
          },
          _id: req.params.id
        })
        res.status(201).json({
          message: 'Tu n`aime pas'
        });


        break;
      case 0:
        const like = sauce.usersLiked.find(value => value === req.body.userId);
        if (like) {
          await Sauce.updateOne({
            _id: req.params.id
          }, {
            $inc: {
              likes: -1
            },
            $pull: {
              usersLiked: req.body.userId
            },
            _id: req.params.id
          })
        } else {
          await Sauce.updateOne({
            _id: req.params.id
          }, {
            $inc: {
              dislikes: -1
            },
            $pull: {
              usersDisliked: req.body.userId
            },
            _id: req.params.id
          });
        }
        res.status(201).json({

        });
        break;
      default:
        break;
    }
  } catch (error) {
    res.status(400).json({
      error
    });
  }

};