const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
      data: fileBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text.trim();
  } catch (error) {
    console.error("PDF text extraction failed:", error.message);
    throw new Error("Failed to extract text from PDF");
  }
};

module.exports = extractTextFromPDF;