const alimeRoute = require('./animeRoutes')

const routes = (app) => {
    app.use("/anime", alimeRoute)
}

module.exports = routes;