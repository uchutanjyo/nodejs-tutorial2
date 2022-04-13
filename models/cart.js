const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
static addProduct(id, productPrice) {
    // fetch the previos cart
fs.readFile(p, (err, fileContent) => {
//   p is the path set above. err, fileContent are arguments in the callback -- fileContent is the unparsed JSON data found under the specified path
    let cart = {products : [], totalPrice: 0}
// cart defined as variable with empty array property and totalPrice property
    if(!err) {
        cart = JSON.parse(fileContent);
    
                  // if no error, cart becomes parsed JSON
    }
    // analyze cart   - check for already-existing products
 
    const existingProductIndex = cart.products.findIndex(product =>  product.id === id)
//   defines variable which contains the index of the product found in the products array in the shopping cart which has the same id as the current product being added to the cart (if it exists)
     const existingProduct = cart.products[existingProductIndex]; 
    //  defines variable which points to the actual product which meets the above condition in the cart
    let updatedProduct; 
    if (existingProduct) {
        updatedProduct = {...existingProduct};
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct
    // if the product being added to the cart is already there, the variable updatedProduct first takes all the properties of that existing product (spread operator)
    // the qty property has 1 added to it
    // the cart variable's products array is re-updated with all of the pre-existing cart products. then, the product which is being updated's index is targeted and replaced with the updatedProduct
    }
    else { 
        updatedProduct = {id: id, qty: 1}
            cart.products.push(updatedProduct)
            // if there is no existing product in the cart for the item about to be added, updatedProduct simply becomes a brand new object w/ a quantity of 1,  and this new product is pushed to the products array
    }

    cart.totalPrice = cart.totalPrice + +productPrice
    fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err)
        // the cart's totalPrice property is then updated to include the new additions. the JSON file is then overwritten with the updated info.
    })

})


}

static deleteCartItem(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
        let cart = {products : [], totalPrice: 0}
// cart defined as variable with empty array property and totalPrice property
    if(!err) {
        cart = JSON.parse(fileContent);
    }
    console.log(cart.products, 'CP')
    const productIndex = cart.products.findIndex(product =>  product.id === id)
     const itemToDelete = cart.products[productIndex]; 

     cart.totalPrice = cart.qty * productPrice

  cart.products.splice(itemToDelete, 1)
  //  console.log(updatedProducts, 'up')
            fs.writeFile(p, JSON.stringify(cart.products), err => {
              console.log(err)
            })
       

    })
}

}