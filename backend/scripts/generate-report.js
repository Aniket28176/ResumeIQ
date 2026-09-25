require("dotenv").config()

const { generateInterviewReport } = require("../src/services/ai.service")
const { resume, selfDescription, jobDescription } = require("../src/services/temp")

generateInterviewReport({ resume, selfDescription, jobDescription })
    .then((report) => {
        console.log("Interview report generated:")
        console.log(JSON.stringify(report, null, 2))
    })
    .catch((error) => {
        console.error("Interview report generation failed:", error.message)
        process.exitCode = 1
    })
