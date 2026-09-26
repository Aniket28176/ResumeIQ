const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
const configuredOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean)
const allowedOrigins = process.env.NODE_ENV === "production"
    ? configuredOrigins
    : [...new Set([...configuredOrigins, "http://localhost:5173"])]

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
            return callback(null, true)
        }

        return callback(new Error("Origin is not allowed by CORS"))
    },
    credentials:true
}))

app.get("/", (req, res) => {
    res.status(200).json({ message: "ResumeIQ backend is running" })
})

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)

module.exports=app