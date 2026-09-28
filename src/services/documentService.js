const Document = require("../models/Document");

const replaceResumeChunks = async ({
  title,
  source,
  chunks,
  metadata = {},
}) => {
  if (!chunks || chunks.length === 0) {
    throw new Error("No document chunks provided");
  }

  // Delete the previous resume
  await Document.deleteMany({
    documentType: "resume",
  });

  // Create new resume chunks
  const documents = chunks.map((content, index) => ({
    title,
    content,
    source,
    documentType: "resume",
    metadata: {
      ...metadata,
      chunkIndex: index,
    },
  }));

  return await Document.insertMany(documents);
};

module.exports = {
  replaceResumeChunks,
};