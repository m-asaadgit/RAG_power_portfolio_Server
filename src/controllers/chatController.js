const { chatWithResume } = require("../services/chatService");

const chat = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const result = await chatWithResume(question);

    return res.status(200).json({
      success: true,
      data: {
        question,
        answer: result.answer,
        sources: result.sources,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate answer",
    });
  }
};

module.exports = {
  chat,
};
