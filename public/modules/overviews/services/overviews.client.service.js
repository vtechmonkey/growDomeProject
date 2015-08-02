'use strict';

//Overviews service used to communicate Overviews REST endpoints
angular.module('overviews').factory('Overviews', ['$resource',
	function($resource) {
		return $resource('overviews/:overviewId', { overviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);