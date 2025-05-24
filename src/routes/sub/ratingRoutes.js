const express = require('express');
const router = express.Router();
const { getRatingByAnime, } = require('../../controllers/ratingController');

router.get('/', getRatingByAnime);


module.exports = router;