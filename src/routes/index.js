const alimeRoute = require('./sub/animeRoutes');
const ratingRoute = require('./sub/ratingRoutes');
const episodeRoute = require('./sub/episodeRoutes');
const commentRoute = require('./sub/commentRoute');

const routes = (app) => {
    app.use("/anime", alimeRoute),
    app.use("/rating", ratingRoute),
    app.use("/episode", episodeRoute),
    app.use("/comment", commentRoute)
}

module.exports = routes;