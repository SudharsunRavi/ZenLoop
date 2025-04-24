const router=require('express').Router();
const { getChatResponse, getChatHistory } = require('../controllers/chat.controller');

router.post('/chats', getChatResponse);
router.get('/history', getChatHistory);

module.exports = router