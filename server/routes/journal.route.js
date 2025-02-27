const router = require('express').Router();
const { addEntry, getMyEntry, getAllMyEntries, getMyEntryCount } = require('../controllers/journal.controller');

router.post('/entry', addEntry);
router.get('/entry/:walletAddress/:index', getMyEntry);
router.get('/entries/:walletAddress', getAllMyEntries);
router.get('/count/:walletAddress', getMyEntryCount);

module.exports = router;