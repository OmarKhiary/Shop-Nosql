const {getDb} =require('../util/database');
const {ObjectId} = require('mongodb');

class User {
    constructor(username, email, cart, id){
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);

    }
    // Add To Cart Model
    addToCart(product){
        // Find Index Need To Update
        const cartProductIndex = this.cart.items.findIndex(callback => {
            return callback.productId.toString() === product._id.toString();
        });
        // Counting the Quantity
        let newQuantity = 1;
        // copy The cart Items
        const updatedCartItems = [...this.cart.items];
        
        if(cartProductIndex >= 0){ // maybe -1 
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId : new ObjectId(product._id),
                quantity: newQuantity
            })
        }
        const updatedCart = {items:updatedCartItems};
        const db = getDb();
        return  db.collection('users').updateOne(
            {_id: new ObjectId(this._id)},
            {$set : {cart: updatedCart}}
        )
    }
    static findById(userId){
        const db = getDb();
       return db
                .collection('users')
                .findOne({_id:new ObjectId(userId)})
                .then(user => {
                    console.log(user);
                    return user;
                }).
                catch(err => console.log(err));
    }
}

module.exports = User;