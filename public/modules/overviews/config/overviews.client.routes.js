'use strict';

//Setting up route
angular.module('overviews').config(['$stateProvider',
	function($stateProvider) {
		// Overviews state routing
		$stateProvider.
		state('listOverviews', {
			url: '/overviews',
			templateUrl: 'modules/overviews/views/list-overviews.client.view.html'
		}).
		state('createOverview', {
			url: '/overviews/create',
			templateUrl: 'modules/overviews/views/create-overview.client.view.html'
		}).
		state('viewOverview', {
			url: '/overviews/:overviewId',
			templateUrl: 'modules/overviews/views/view-overview.client.view.html'
		}).
		state('editOverview', {
			url: '/overviews/:overviewId/edit',
			templateUrl: 'modules/overviews/views/edit-overview.client.view.html'
		});
	}
]);