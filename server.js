require('dotenv').config();
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require('cors')

const examRouter = require("./routes/examRoutes.js")
const accountRouter = require("./routes/accountRoutes.js")

app.use(express.json())
app.use(cors())

app.use("/exams", examRouter)
app.use("/accounts", accountRouter)


mongoose.connect(process.env.DB_URL)
.then(()=>console.log("connected"))
.catch((error)=>console.log(error))

const port = process.env.PORT || 4000;
app.listen(port,()=> console.log("listening at port:" + port))

