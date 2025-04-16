const router = require('express').Router();
const { addSurvey, getSurvey, updateSurvey } = require('../controllers/survey.controller');
const authenticateUser = require('../middlewares/authenticateUser');

router.post('/', authenticateUser, addSurvey);
router.get('/:userid', authenticateUser, getSurvey);
router.put('/:userid', authenticateUser, updateSurvey);

module.exports = router;