const { redirect } = require('express/lib/response');
const Product = require('../models/product');

// imports Product class , saves as varaible Product

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
     res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Products',
      path: '/products'
  })}
  ).catch(err => console.log(err))
};

// defines variables for product-list page.
// in fetchAll callback, products is the stringified JSON data fetched in the getProductsFromFile method. it becomes the property 'prods' on the locals object here.

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
Product.findByPk(prodId)
.then(product => {
res.render('shop/product-detail', {
      prod: product,
      pageTitle: product.title,
           path: '/products'
    })
}).catch(err => console.log(err))
};
// defines variable pointing to id product id route to be used ___
// productId is accessible because it is the name used after the colon in routes - the name with which you can extract the data on the req.params object


exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
       res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
  })}
  ).catch(err => console.log(err))
};

// does the same thing as  the top function -- except for the index page (also displays all products)

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    return cart.getProducts()
    .then(products => {
     res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        totalPrice: products.totalPrice 

      });
    })  .catch(err => console.log(err))
    })
  .catch(err => console.log(err))
};
// renders 'cart' page /defines pageTitle

exports.postCart = (req,res,next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  req.user.getCart()
  .then(cart=> {
    fetchedCart = cart;
    console.log(cart)
    return cart.getProducts({where: {id: prodId}})
  }).then(products=> {
    let product;
    if (products.length > 0) {
      product = products[0]
    }
    let newQuantity = 1;
    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
    }
    return Product.findByPk(prodId).then(product => {
      return fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
    }).catch(err => console.log(err))

  }).then(() => {
      res.redirect('/cart');
  }).catch(err => console.log(err))
}


exports.postDeleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: {id: prodId}})
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(result => {
         res.redirect('/cart');

  })
  .catch(err => console.log(err))
  }

exports.postOrder = (req, res, next) => {
  let fetchedCart;
req.user.getCart()
.then(cart => {
fetchedCart = cart;
return cart.getProducts();
}).then(products => {
req.user.createOrder()
.then(order => {
  order.addProducts(products.map((product => {
    console.log(product, 'PROD')
    product.orderItem = {quantity: product.cartItem.quantity}
    return product
  })))
})
.catch(err=>console.log(err))
})
.then(result=> {
  fetchedCart.setProducts(null)
})
.then(result=> {
  res.redirect('/orders')
})
.catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
    .then(orders => {
     res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
      orders: orders
      });
    }).catch(err => console.log(err))
};
// same as cart

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
// same as last 2

