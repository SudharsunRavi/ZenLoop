const router=require('express').Router();
const { getChatResponse } = require('../controllers/chat.controller');

router.post('/chat', getChatResponse)

module.exports = router
