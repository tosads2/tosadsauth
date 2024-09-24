const mongoose = require("mongoose")
const accountShcema = mongoose.Schema(
    {
        "username":{
            type: String,
            required: true
        },
        "email":{
            type: String,
            required: true
        },
        "password":{
            type: String,
            required: true
        },
        "authenticate": {
            type: Boolean,
            default: false
        }
    }
);

const model = mongoose.model("accounts", accountShcema)

module.exports = model;
