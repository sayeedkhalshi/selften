const mongoose = require('mongoose');
const { stringify } = require('uuid');
const schema = mongoose.Schema;

const topupOrderSchema = new schema({
    accountType: {
        type: String,
        enum: ['facebook', 'gmail']
    },
    gmailOrFacebook: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },

    securityCode: {
        type: String,
    },
    selectRecharge: {
        type: mongoose.Schema.ObjectId,
        ref: 'RechargePackage',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    topupGameId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topup',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // requestedTopupForGame: {
    //     type: String,
    // },
    status: {
        type: String,
        enum: ['cancelled', 'pending', 'completed'],
        default: 'pending',
    },
    assignedTo:{
        type: mongoose.Schema.ObjectId,
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

})

module.exports = mongoose.model("TopupOrder", topupOrderSchema);