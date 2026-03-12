const express = require("express");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {

        type: String
    },
    isRepeat: {
        type: Boolean,
        default: false
    },
    howMuchRepeat: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    lastAppearenceDate: {
        Date: {
            type: String
        },
        time:{
            type: String
        }
    },
    points: {
        type: Number,
        default: 0
    },
    tier: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        default: 'Bronze'
    },
    membershipExpireDate: {
        type: Date
    }
})


const User = new  mongoose.model("User", userSchema);

module.exports = User;