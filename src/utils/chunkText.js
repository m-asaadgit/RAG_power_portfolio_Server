const chunkText = (text, chunkSize = 500, overlap = 100) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  const words = text.trim().split(/\s+/);

  if (words.length === 0) {
    return [];
  }

  const chunks = [];

  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);

    const chunk = words.slice(start, end).join(" ");

    chunks.push(chunk);

    if (end === words.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
};

module.exports = chunkText;
