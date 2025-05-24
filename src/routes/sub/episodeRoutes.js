const express = require('express');
const router = express.Router();
const { getEpisode, } = require('../../controllers/episodeController');

router.get('/', getEpisode);


module.exports = router;