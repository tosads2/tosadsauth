const express = require("express")
const { createExam, getAllExams, updateExam, getSingleExam, deleteExam,   getTokenFromHeader } = require("../controllers/examController")
const router = express.Router()



/* exams */
router.route("/").get(getAllExams).post(getTokenFromHeader, createExam)
router.route("/:examId").get(getSingleExam).put(getTokenFromHeader, updateExam).delete(getTokenFromHeader, deleteExam)

module.exports = router