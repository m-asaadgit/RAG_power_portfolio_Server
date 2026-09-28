const { searchDocuments } = require("./vectorSearchService");
const { generateAnswer } = require("./openaiService"); // change to your Gemini file name if different

const chatWithResume = async (question) => {
  if (!question || typeof question !== "string" || !question.trim()) {
    throw new Error("Question is required");
  }

  // 1. Retrieve relevant documents from MongoDB Atlas Vector Search
  let results = [];
  try {
    results = (await searchDocuments(question, 5)) || [];
  } catch (err) {
    console.error("Vector search failed:", err.message);
    return {
      answer: "I'm a bit busy right now. Please try again in a moment.",
      sources: [],
    };
  }

  // 2. Build context (can be empty for greetings or identity questions)
  const context = results.map((result) => result.content).join("\n\n");

  // 3. Always let Gemini answer, even with empty context
  let answer;
  try {
    answer = await generateAnswer(question, context);
  } catch (err) {
    console.error("Answer generation failed:", err.message);
    return {
      answer: "I'm having trouble answering right now. Please try again shortly.",
      sources: [],
    };
  }

  // 4. Return answer + retrieved sources
  const sources = results.map((result) => ({
    id: result._id,
    title: result.title,
    source: result.source,
    score: result.score,
    content: result.content,
  }));

  return {
    answer,
    sources,
  };
};

module.exports = {
  chatWithResume,
};