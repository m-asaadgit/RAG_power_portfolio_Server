const express = require("express");

const { uploadDocument } = require("../controllers/documentController");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDocument);

module.exports = router;