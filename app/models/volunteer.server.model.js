'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Volunteer Schema
 */
var VolunteerSchema = new Schema({
	firstName: {
		type: String,
		default: '',
		required: 'Please fill in first name',
		trim: true
	},
	lastName: {
		type: String,
		default: '',
		required: 'Please fill in last name',
		trim: true
	},
	phone: {
		type: String,
		default: '',
		trim: true

	},
	email: {
		type: String,
		default: '',
		required: 'Please fill in email',
		trim: true
	},
	full_time: {
		type: Boolean
	},

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}

});

mongoose.model('Volunteer', VolunteerSchema);
