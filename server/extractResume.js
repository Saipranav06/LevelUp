const fs = require("fs");
const { PDFParse } = require("pdf-parse");

async function extractResumeText(filePath) {

    let parser;

    try {

        const pdfBuffer = fs.readFileSync(filePath);

        parser = new PDFParse({
            data: pdfBuffer
        });

        const result = await parser.getText();

        return result.text;

    } catch (error) {

        console.error("Resume extraction error:", error);

        throw new Error("Failed to extract resume text");

    } finally {

        if (parser) {
            await parser.destroy();
        }

    }
}

module.exports = extractResumeText;