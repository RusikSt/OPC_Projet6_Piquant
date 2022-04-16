const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middlware/auth');
const multer = require('../middlware/multer-config');


router.get('/', sauceCtrl.get);
router.post('/', multer, sauceCtrl.save);
router.get('/:id', sauceCtrl.getOne);
router.put('/:id', multer, sauceCtrl.modifySauce);
router.delete('/:id', sauceCtrl.deleteSauce);
router.post('/:id/like', sauceCtrl.likeSauce)





module.exports = router;