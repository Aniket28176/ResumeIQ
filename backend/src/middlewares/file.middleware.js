const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 3 * 1024 * 1024 // 3 MB
    },
    fileFilter: (req, file, cb) => {
        const isPdf = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")

        if (!isPdf) {
            return cb(new Error("Only PDF resume files are allowed"))
        }

        cb(null, true)
    }
})

module.exports = upload

function handleUploadError(error, req, res, next) {
    if (!error) return next()

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Resume file must be 3 MB or smaller" })
    }

    if (error.message === "Only PDF resume files are allowed") {
        return res.status(400).json({ message: error.message })
    }

    return next(error)
}

module.exports.handleUploadError = handleUploadError