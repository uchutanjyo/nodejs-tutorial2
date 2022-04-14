const { redirect } = require('express/lib/response');
const Product = require('../models/product');
const Cart = require('../models/cart')
// imports Product class , saves as varaible Product

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};
// defines variables for product-list page.
// in fetchAll callback, products is the stringified JSON data fetched in the getProductsFromFile method. it becomes the property 'prods' on the locals object here.

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
Product.findById(prodId, product => {
  console.log(product[0])
  res.render('shop/product-detail', {

      prod: product[0],
      pageTitle: 'Product Details',
           path: '/products'
    });
})
};
// defines variable pointing to id product id route to be used ___
// productId is accessible because it is the name used after the colon in routes - the name with which you can extract the data on the req.params object


exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

// does the same thing as  the top function -- except for the index page (also displays all products)

exports.getCart = (req, res, next) => {
  Cart.fetchCart(cart => {
    Product.fetchAll(products => {
      console.log(cart, 'produs')
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      console.log(cartProducts)
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};
// renders 'cart' page /defines pageTitle

exports.postCart = (req,res,next) => {
  const prodId = req.body.productId;
  console.log(prodId);
Product.findById(prodId, (product) => {
  console.log(prodId, product[0].price, 'price')
Cart.addProduct(prodId, product[0].price)
})
  console.log(prodId, 'pid')
  res.redirect('/cart');
};

exports.postDeleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId)
  Product.findById(prodId, (product) => {

Cart.deleteCartItem(prodId, product.price)
  })
     res.redirect('/');
}


exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};
// same as cart

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
// same as last 2

