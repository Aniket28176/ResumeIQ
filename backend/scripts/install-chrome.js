const path = require("path")

process.env.PUPPETEER_SKIP_DOWNLOAD = "false"
process.env.PUPPETEER_CACHE_DIR = path.resolve(__dirname, "../.puppeteer-cache")

import("puppeteer/internal/node/install.js")
    .then(({ downloadBrowsers }) => downloadBrowsers())
    .catch((error) => {
        console.error("Puppeteer Chrome installation failed:", error.message)
        process.exitCode = 1
    })
