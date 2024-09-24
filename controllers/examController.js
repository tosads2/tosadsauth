require('dotenv').config()
const examModel = require("../models/examModel.js")
const jwt = require('jsonwebtoken')

const createExam = async (req, res) => {
    const {name, group, timeInMinutes, language, catagory, questions} = req.body;
    const newExam = await examModel.create(
        {name, group, timeInMinutes, language, catagory, questions, addedBy: req.addedBy}
    )
    return res.json(newExam)
}


const getAllExams = async (req, res) => {
    const allExams = await examModel.find()
    return res.json(allExams)
}

const updateExam = async (req, res) => {
    const {examId} = req.params
    const {name, group, timeInMinutes, language, catagory, questions} = req.body
    const updatedExam = await examModel.findByIdAndUpdate(examId, {name, group, timeInMinutes, language, catagory, questions, lastEdit: req.addedBy}, {new: true})
    return res.json(updatedExam)
}

const getSingleExam = async (req, res) => {
    const {examId} = req.params
    const findExam = await examModel.findById(examId)
    return res.json(findExam)
}

const deleteExam = async (req, res) => {
    const {examId} = req.params
    const deletedExam = await examModel.findByIdAndUpdate(examId, {working: false, deletedBy: req.addedBy})
    return res.json(deletedExam)
}


function getTokenFromHeader(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            let tokendata = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)  
            if (tokendata["authenticate"] == false) {
                return res.status(400).json({message: "please atuhinticate your account"})
            } else {
                req.token = token;
                req.addedBy = tokendata['username'];
                next();
            }
        } catch {                
            return res.status(400).json({message: "please login"})
        }

    } else {
        console.log('no token')
        return res.status(400).json({message: "please login"})
    }
}


module.exports = {
    createExam,
    getAllExams,
    updateExam,
    getSingleExam,
    deleteExam,
    
    getTokenFromHeader
}


