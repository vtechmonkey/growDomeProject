'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Overview = mongoose.model('Overview'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, overview;

/**
 * Overview routes tests
 */
describe('Overview CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Overview
		user.save(function() {
			overview = {
				name: 'Overview Name'
			};

			done();
		});
	});

	it('should be able to save Overview instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Overview
				agent.post('/overviews')
					.send(overview)
					.expect(200)
					.end(function(overviewSaveErr, overviewSaveRes) {
						// Handle Overview save error
						if (overviewSaveErr) done(overviewSaveErr);

						// Get a list of Overviews
						agent.get('/overviews')
							.end(function(overviewsGetErr, overviewsGetRes) {
								// Handle Overview save error
								if (overviewsGetErr) done(overviewsGetErr);

								// Get Overviews list
								var overviews = overviewsGetRes.body;

								// Set assertions
								(overviews[0].user._id).should.equal(userId);
								(overviews[0].name).should.match('Overview Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Overview instance if not logged in', function(done) {
		agent.post('/overviews')
			.send(overview)
			.expect(401)
			.end(function(overviewSaveErr, overviewSaveRes) {
				// Call the assertion callback
				done(overviewSaveErr);
			});
	});

	it('should not be able to save Overview instance if no name is provided', function(done) {
		// Invalidate name field
		overview.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Overview
				agent.post('/overviews')
					.send(overview)
					.expect(400)
					.end(function(overviewSaveErr, overviewSaveRes) {
						// Set message assertion
						(overviewSaveRes.body.message).should.match('Please fill Overview name');
						
						// Handle Overview save error
						done(overviewSaveErr);
					});
			});
	});

	it('should be able to update Overview instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Overview
				agent.post('/overviews')
					.send(overview)
					.expect(200)
					.end(function(overviewSaveErr, overviewSaveRes) {
						// Handle Overview save error
						if (overviewSaveErr) done(overviewSaveErr);

						// Update Overview name
						overview.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Overview
						agent.put('/overviews/' + overviewSaveRes.body._id)
							.send(overview)
							.expect(200)
							.end(function(overviewUpdateErr, overviewUpdateRes) {
								// Handle Overview update error
								if (overviewUpdateErr) done(overviewUpdateErr);

								// Set assertions
								(overviewUpdateRes.body._id).should.equal(overviewSaveRes.body._id);
								(overviewUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Overviews if not signed in', function(done) {
		// Create new Overview model instance
		var overviewObj = new Overview(overview);

		// Save the Overview
		overviewObj.save(function() {
			// Request Overviews
			request(app).get('/overviews')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Overview if not signed in', function(done) {
		// Create new Overview model instance
		var overviewObj = new Overview(overview);

		// Save the Overview
		overviewObj.save(function() {
			request(app).get('/overviews/' + overviewObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', overview.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Overview instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Overview
				agent.post('/overviews')
					.send(overview)
					.expect(200)
					.end(function(overviewSaveErr, overviewSaveRes) {
						// Handle Overview save error
						if (overviewSaveErr) done(overviewSaveErr);

						// Delete existing Overview
						agent.delete('/overviews/' + overviewSaveRes.body._id)
							.send(overview)
							.expect(200)
							.end(function(overviewDeleteErr, overviewDeleteRes) {
								// Handle Overview error error
								if (overviewDeleteErr) done(overviewDeleteErr);

								// Set assertions
								(overviewDeleteRes.body._id).should.equal(overviewSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Overview instance if not signed in', function(done) {
		// Set Overview user 
		overview.user = user;

		// Create new Overview model instance
		var overviewObj = new Overview(overview);

		// Save the Overview
		overviewObj.save(function() {
			// Try deleting Overview
			request(app).delete('/overviews/' + overviewObj._id)
			.expect(401)
			.end(function(overviewDeleteErr, overviewDeleteRes) {
				// Set message assertion
				(overviewDeleteRes.body.message).should.match('User is not logged in');

				// Handle Overview error error
				done(overviewDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Overview.remove().exec();
		done();
	});
});