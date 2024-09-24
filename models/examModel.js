const mongoose = require("mongoose")
const examShcema = mongoose.Schema(
    {
        "working": {
            type: Boolean, 
            required:true,
            default: true
        },
        "name":{
            type: String,
            required: true
        },
        "group": {
            type: Array,
            required: true
        },
        "timeInMinutes": {
            type: Number,
            required: true
        }, 
        "language": {
            type: String,
            required: true
        },
        "catagory":{
            type: String,
            required: true
        },
        "questions": {
            type: Object,
            required: true
        },
        "addedBy": {
            type: String,
            required: true
        },
        "lastEdit": String,
        "deletedBy": String
        
    }
);

const model = mongoose.model("exams", examShcema)

module.exports = model;
