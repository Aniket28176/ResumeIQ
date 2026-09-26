const { PDFParse } = require("pdf-parse")
const {generateInterviewReport,generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const mongoose = require("mongoose")

function normalizeInterviewReport(report = {}) {
    const technicalQuestions = (report.technical_questions ?? []).map((item, index) => {
        if (typeof item === "object") {
            return {
                question: item.question || `Technical question ${index + 1}`,
                intention: item.intention || "Explain your understanding, trade-offs, and practical example.",
                answer: item.answer || "A strong answer should clearly explain the core concept, implementation steps, and edge cases."
            }
        }

        return {
            question: item,
            intention: "Explain your understanding, trade-offs, and a practical example.",
            answer: "A strong answer should cover the problem, key steps, constraints, and why the approach is appropriate."
        }
    })

    const behavioralQuestions = (report.behavioral_questions ?? []).map((item, index) => {
        if (typeof item === "object") {
            return {
                question: item.question || `Behavioral question ${index + 1}`,
                intention: item.intention || "Show structured thinking, ownership, and results.",
                answer: item.answer || "Answer with a clear situation, action, and outcome."
            }
        }

        return {
            question: item,
            intention: "Show structured thinking, ownership, and measurable results.",
            answer: "Use STAR: explain the situation, actions you took, and the impact you delivered."
        }
    })

    const skillGaps = (report.skill_gaps ?? []).map((item, index) => {
        const skill = typeof item === "string" ? item : item.skill || `Skill ${index + 1}`
        const severity = typeof item === "object" ? (item.severity || "medium") : ["low", "medium", "high"][index % 3]

        return {
            skill,
            severity: severity.toLowerCase()
        }
    })

    const preparationPlans = (report.preparation_plan ?? []).map((item, index) => {
        const planText = typeof item === "string" ? item : (item.focus || item.tasks?.join(" ") || `Preparation plan ${index + 1}`)

        return {
            day: index + 1,
            focus: planText.split(":")[0] || `Preparation focus ${index + 1}`,
            tasks: [planText]
        }
    })

    return {
        title: report.target_role || report.title || "Software Engineer",
        matchScore: Number(report.match_score ?? report.matchScore ?? 0),
        mathScore: Number(report.math_score ?? report.mathScore ?? 0),
        technicalQuestions,
        behavioralQuestions,
        skillGaps,
        preparationPlans
    }
}

async function generateInterviewReportController(req,res){
    if (!req.file) {
        return res.status(400).json({ message: "Resume file is required" })
    }

    const isPdf = req.file.mimetype === "application/pdf" || req.file.originalname.toLowerCase().endsWith(".pdf")

    if (!isPdf) {
        return res.status(400).json({ message: "Only PDF resume files are allowed" })
    }

    try {
        const parser = new PDFParse({ data: req.file.buffer })
        const pdfResult = await parser.getText()
        const {selfDescription,jobDescription} = req.body

        const interViewReportByAi = await generateInterviewReport({
            resume: pdfResult.text,
            selfDescription,
            jobDescription
        })

        const normalizedReport = normalizeInterviewReport(interViewReportByAi)

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: pdfResult.text,
            selfDescription,
            jobDescription,
            ...normalizedReport
        })

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        console.error("Error generating interview report:", error)

        if (error?.name === "InvalidPDFException") {
            return res.status(400).json({
                message: "Invalid PDF file. Please upload a valid resume PDF."
            })
        }

        return res.status(500).json({
            message: "Failed to generate interview report. Please try again."
        })
    }
}

async function getInterviewReportByIdController(req,res) {
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }
    res.status(200).json({
        message:"Interview report fetched successfully.",
        interviewReport
    })
}

async function getAllInterviewReportsController(req,res) {
    const interviewReports = (await interviewReportModel.find({ user: req.user.id }))
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.status(200).json({
        message:"Interview reports fetched successfully.",
        interviewReports
    })
}

async function generateResumePdfController(req,res) {
    const {interviewReportId} = req.params

    if (!mongoose.isValidObjectId(interviewReportId)) {
        return res.status(400).json({ message: "Invalid interview report ID" })
    }

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id
    })

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }

    const {resume, selfDescription, jobDescription} = interviewReport

    if (!resume || !selfDescription || !jobDescription) {
        return res.status(400).json({ message: "Interview report data is incomplete" })
    }

    try {
        const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription})

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="resume.pdf"'
        })
        return res.send(pdfBuffer)
    } catch (error) {
        console.error("Resume PDF generation failed:", {
            reportId: interviewReportId,
            error: error.message,
            status: error.status || error.code
        })

        const serviceStatus = Number(error.status || error.code)
        if (serviceStatus === 429 || serviceStatus >= 500) {
            return res.status(503).json({ message: "Resume PDF service is temporarily unavailable" })
        }

        return res.status(500).json({ message: "Failed to generate resume PDF" })
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}