const express = require("express")
const {createAccount,login,cryptPassword,decryptPassword, checkToken} = require("../controllers/accountController")
const router = express.Router()



/* exams */
router.route("/signup").post(cryptPassword,createAccount)
router.route("/login").post(login)
router.route("/checkToken").post(checkToken)

module.exports = router