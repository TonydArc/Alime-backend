const express = require('express');
const router = express.Router();
const { getAnimeList, getAimeDetail, getAnimeBySerie } = require('../../controllers/animeController');

router.get('/', getAnimeList);
router.get('/detail', getAimeDetail);
router.get('/serie', getAnimeBySerie);


module.exports = router;