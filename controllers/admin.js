const Product = require('../models/product');

const Cart = require('../models/cart')


exports.getAddProduct = (req, res, next) => {
  
  res.render('admin/edit-product', {
    // renders the edit-product view, but with different properties 
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
    // editing set to false when adding product
  });
};


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  // creates new product out of entered info on add product page - id is set to null here as it does not have one yet - it will be generated
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  // variable editMode is a boolean which represents whether or not 'edit' query is set (this is done in url and checked in if/else statmenet in view)
  if (!editMode) {
    return res.redirect('/');
    // will always be false - will always be in editMode if on edit-product page.
  }
  const prodId = req.params.productId;
//  sets prodId as variable representing the productId value from hidden input on view (product.id). this will be the id of the product we are currently editing.
  Product.findById(prodId, product => {
  res.render('admin/edit-product', {
    // renders edit-product page 
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    // path is edit, rather than add product. this means getEditProduct will execute rather than getAddProduct
    editing: editMode,
    // editing will be set to true when editing an item as the query will be set
    product: product[0]
    // the product property is set to the 1st (and only) array item returned by findById (the id of the product we want to edit)
  });
  })

};

exports.postEditProduct = (req, res, next) => {
const prodId = req.body.productId;
// the id returned by the hidden input in edit-product view (the same id as before editing)
const updatedTitle = req.body.title;
const updatedPrice = req.body.price;
const updatedimageUrl = req.body.imageUrl;
const updatedDescription = req.body.description;
// the updated properties which have been entered into the text inputs
const updatedProduct = new Product(prodId, updatedTitle, updatedimageUrl, updatedDescription, updatedPrice)
// new Product created iwth the existing id and the updated properties
updatedProduct.save();
// save method called on updated product; old product with same index in products array overwritten
res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) => {
const prodId = req.body.productId;
console.log(req.body.productId, 'prodid')
 Product.findById(prodId, product => {
Product.delete(prodId)
 })
   res.redirect('/admin/products');
}


exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
      // displays all products on admin-products page
    });
  });
};
