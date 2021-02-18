const routes = require('next-routes')();

routes
    .add('/game/new', '/game/new')
    .add('/game/:address', '/game/show'); // :address will be returned as props by Next in the show.js file

module.exports = routes;
