const { searchDocuments } = require("../services/vectorSearchService");

const search = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = await searchDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        query,
        results,
      },
    });
  } catch (error) {
    console.error("Search error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search documents",
    });
  }
};

module.exports = {
  search,
};