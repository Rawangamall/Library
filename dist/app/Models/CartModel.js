"use strict";
const { Schema, model } = require('mongoose');
const cartItemSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }
});
const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema]
}, { timestamps: true });
const CartModel = model('Cart', cartSchema);
module.exports = CartModel;
