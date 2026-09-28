const extractTextFromPDF = require("../utils/pdfParser");
const chunkText = require("../utils/chunkText");
const { replaceResumeChunks } = require("../services/documentService");
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Document title is required",
      });
    }

    const extractedText = await extractTextFromPDF(req.file.path);

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from the PDF",
      });
    }

    const chunks = chunkText(extractedText);

    const savedDocuments = await replaceResumeChunks({
      title,
      source: req.file.originalname,
      chunks,
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        title,
        source: req.file.originalname,
        chunksCreated: savedDocuments.length,
      },
    });
  } catch (error) {
    console.error("Document upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process document",
    });
  }
};

module.exports = {
  uploadDocument,
};
