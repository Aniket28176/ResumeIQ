const { Router } = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const aiController = require("../controllers/ai.controller")

const aiRouter = Router()

aiRouter.post(
    "/interview-report",
    authMiddleware.authUser,
    aiController.generateInterviewReportController
)

module.exports = aiRouter
