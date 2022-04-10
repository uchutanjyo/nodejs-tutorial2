const fs = require('fs');
const path = require('path');

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
      console.log(fileContent)
      cb(JSON.parse(fileContent));
      // if no error, parse JSON file (data.js) -it becomes a javascript array - and use it as argument in callback func (below)
    }
  });
  // this function basically reads the JSON data (products existing already) and parses it
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
// creates Product class - blueprint with the above properties
  save() {
    this.id = Math.random().toString();
    // when a new Product is created, a .id property is added  ( a random #)
    getProductsFromFile(products => {
      // gPFF function called with a callback function which takes products as a parameter
      console.log(products)
      // products is the parsed js array (from data.js)
      products.push(this);
      // push new Product (this) created to products array
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
      // change products array to JSON and rewrite to data file / log error
    });
  }
  // creates save method on Product class.

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
