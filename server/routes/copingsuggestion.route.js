const router=require('express').Router();
const { getCopingSuggestion } = require('../controllers/copingsuggestion.controller');

router.post('/', getCopingSuggestion);

module.exports = router;
