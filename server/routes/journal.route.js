const router = require("express").Router();
const { saveMetadata, getMetadata, getUserMoods } = require("../controllers/journal.controller");

router.post("/entry", saveMetadata);
router.get("/entries/:wallet", getMetadata);
router.get("/moods/:wallet", getUserMoods);

module.exports = router;
