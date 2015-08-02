'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Overview = mongoose.model('Overview'),
	_ = require('lodash');

/**
 * Create a Overview
 */
exports.create = function(req, res) {
	var overview = new Overview(req.body);
	overview.user = req.user;

	overview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overview);
		}
	});
};

/**
 * Show the current Overview
 */
exports.read = function(req, res) {
	res.jsonp(req.overview);
};

/**
 * Update a Overview
 */
exports.update = function(req, res) {
	var overview = req.overview ;

	overview = _.extend(overview , req.body);

	overview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overview);
		}
	});
};

/**
 * Delete an Overview
 */
exports.delete = function(req, res) {
	var overview = req.overview ;

	overview.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overview);
		}
	});
};

/**
 * List of Overviews
 */
exports.list = function(req, res) { 
	Overview.find().sort('-created').populate('user', 'displayName').exec(function(err, overviews) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overviews);
		}
	});
};

/**
 * Overview middleware
 */
exports.overviewByID = function(req, res, next, id) { 
	Overview.findById(id).populate('user', 'displayName').exec(function(err, overview) {
		if (err) return next(err);
		if (! overview) return next(new Error('Failed to load Overview ' + id));
		req.overview = overview ;
		next();
	});
};

/**
 * Overview authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.overview.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
