const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/edit-product', adminController.getAddProduct);
// actually routes controller function (getAddProduct from adminController (controllsres page)) to the add-product view.


// /admin/products => GET
router.get('/products', adminController.getProducts);
// does same thing for getproducts page


// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);
// routes controller function (POST request for adding product to list) to add=product views page

router.get('/edit-product/:productId', adminController.getEditProduct)

router.get('edit-product')
module.exports = router;
