const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const fileFilter = function (req, file, cb) {

    const allowedTypes = [
        ".pdf",
        ".doc",
        ".docx"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(extension)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, DOC and DOCX files are allowed."));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;