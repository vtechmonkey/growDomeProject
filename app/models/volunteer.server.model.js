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
		required: 'Please fill in phone number',
		trim: true

	},
	email: {
		type: String,
		default: '',
		required: 'Please fill in email',
		trim: true
	},
	availability: {
		type: ['less than 20hrs per week', 'over 20hrs per week'],
		default: 'less than 20hrs per week'
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
