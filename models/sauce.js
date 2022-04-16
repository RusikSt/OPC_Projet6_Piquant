// schema pour les objet en ligne//

const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },//identefiant unique//
  name: { type: String, required: true },//nom de la sauce//
  manufacturer: { type: String, required: true },//fabricant//
  description: { type: String, required: true },//descrioption//
  mainPepper: { type: String, required: true },//les ingrediant//
  imageUrl: { type: String, required: true },//image de la sauce//
  heat: { type: Number, required: true },//nombre entre 1 et 10//
  likes: { type: Number, required: false, default: 0 },//nombre des utilisateur qui aime//
  dislikes: { type: Number, required: false, default: 0 },//nombre des utilisateur qui n'aime pas//
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false },
});

module.exports = mongoose.model('Sauce', sauceSchema);