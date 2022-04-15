const fs = require('fs');
const path = require('path');

const Cart = require('./cart')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);
// creates a path to the json data file (holds products)

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    // p = the path to be read, (err, fileContent) = arguments in callback function - error, and data to be read
    if (err) {
      cb([]);
      // if error, return empty array
    } else {
      cb(JSON.parse(fileContent));
      // if no error, parse JSON file (data.js) -it becomes a javascript array - and use it as argument in callback func (below)
    }
  });
  // this function basically reads the JSON data (products existing already) and parses it
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id; 
    // id added as property of Product class. if it exists, it is set as 'id'. 
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
// creates Product class - blueprint with the above properties
  save() {
    getProductsFromFile(products => {
            // gPFF function called with a callback function which takes products as a parameter
        if (this.id) {
       const existingProductIndex = products.findIndex(product =>  product.id === this.id)
       const updatedProducts = [...products]
       updatedProducts[existingProductIndex] = this;
     
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
              console.log(err)
            })
    } else {
        this.id = Math.random().toString();
    // when a new Product is created, a .id property is added  ( a random #)
      // products is the parsed js array (from data.js)
      products.push(this);
      // push new Product (this) created to products array
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
    });
  }// change products array to JSON and rewrite to data file / log error
    })
  }
  // creates save method on Product class.


  static delete(id) {
  getProductsFromFile(products => {
        console.log(id, 'this id')

    const productIndex = products.findIndex(product =>  product.id === id)
    const product = products.find(product => product.id === id)
   products.splice(productIndex, 1)
  //  console.log(updatedProducts, 'up')
            fs.writeFile(p, JSON.stringify(products), err => {
              if (!err) {
               Cart.deleteCartItem(id, product.price)
               console.log('!!')
              }
            })
          })
  }


  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  // static method calls gPFF function and takes another callback function (shop.js - see)

  static findById(id, cb) {
    getProductsFromFile(products => { 
     const product =  products.filter((product) => {
        return id === product.id
      })

    cb(product)

    })
  }
};
