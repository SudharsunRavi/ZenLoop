const router = require("express").Router();
const { saveMetadata, getMetadata } = require("../controllers/journal.controller");

router.post("/entry", saveMetadata);
router.get("/entries/:wallet", getMetadata);

module.exports = router;
