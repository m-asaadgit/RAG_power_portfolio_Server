const Document = require("../models/Document");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retries the aggregation when the embedding provider is rate limited
const runWithRetry = async (pipeline, retries = 3) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await Document.aggregate(pipeline);
    } catch (err) {
      const rateLimited = /rate limit/i.test(err.message || "");
      if (!rateLimited || attempt === retries) throw err;
      await sleep(1000 * 2 ** attempt); // waits 1s, 2s, 4s
    }
  }
};

const searchDocuments = async (query, limit = 5, minScore = 0.35) => {
  if (!query || typeof query !== "string") {
    throw new Error("Search query is required");
  }

  const results = await runWithRetry([
    {
      $vectorSearch: {
        index: "autoembed_index",
        path: "content",
        query: { text: query },
        numCandidates: 100,
        limit,
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        source: 1,
        documentType: 1,
        metadata: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
    {
      $match: { score: { $gte: minScore } },
    },
  ]);

  // Temporary debug log: remove once retrieval works
  console.log(
    "vector results:",
    results.map((r) => ({ title: r.title, score: r.score }))
  );

  return results;
};

module.exports = {
  searchDocuments,
};