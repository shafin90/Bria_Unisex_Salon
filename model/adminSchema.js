const mongoose = require("mongoose");

// creating schema
const adminSchema =  mongoose.Schema({
    email:{
        type: String
    },
    password:{
        type: String
    },
    role: {
        type: String,
        enum: ['Owner', 'Manager', 'Stylist'],
        default: 'Owner'
    },
    stylistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stylist'
    }
})


// creating model
const Admin = new mongoose.model("Admin", adminSchema);

module.exports = Admin;