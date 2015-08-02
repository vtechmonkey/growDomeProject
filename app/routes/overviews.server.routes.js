'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var overviews = require('../../app/controllers/overviews.server.controller');

	// Overviews Routes
	app.route('/overviews')
		.get(overviews.list)
		.post(users.requiresLogin, overviews.create);

	app.route('/overviews/:overviewId')
		.get(overviews.read)
		.put(users.requiresLogin, overviews.hasAuthorization, overviews.update)
		.delete(users.requiresLogin, overviews.hasAuthorization, overviews.delete);

	// Finish by binding the Overview middleware
	app.param('overviewId', overviews.overviewByID);
};
