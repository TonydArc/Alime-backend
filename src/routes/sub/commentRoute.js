const express = require('express');
const router = express.Router();
const { getCommentByEpisode, } = require('../../controllers/commentController');

router.get('/', getCommentByEpisode);


module.exports = router;