const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const { MongoClient } = require("mongodb");

const testVectorSearch = async () => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    console.log("1. Connecting to MongoDB...");

    await client.connect();

    console.log("2. MongoDB connected.");

    // Explicitly use the test database
    const db = client.db("test");
    const collection = db.collection("documents");

    console.log("Database:", db.databaseName);
    console.log("Collection:", collection.collectionName);

    // Check that the resume document exists
    const document = await collection.findOne({
      documentType: "resume",
    });

    console.log("Resume found directly:", !!document);

    if (document) {
      console.log("Resume title:", document.title);
      console.log("Resume content length:", document.content.length);
    }

    // Check Atlas Search indexes
    console.log("3. Checking Atlas Search indexes...");

    const searchIndexes = await collection
      .listSearchIndexes()
      .toArray();

    console.dir(searchIndexes, {
      depth: 10,
    });

    // Run Vector Search
    console.log("4. Running Vector Search...");

    const results = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            query: {
              text: "What programming languages does Asaad know?",
            },
            path: "content",
            numCandidates: 100,
            limit: 10,
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
            score: {
              $meta: "vectorSearchScore",
            },
          },
        },
      ])
      .toArray();

    console.log("5. Vector Search completed.");
    console.log("Results found:", results.length);

    console.dir(results, {
      depth: 2,
    });
  } catch (error) {
    console.error("Vector Search failed:");
    console.error(error);
  } finally {
    await client.close();

    console.log("6. Connection closed.");
  }
};

testVectorSearch();