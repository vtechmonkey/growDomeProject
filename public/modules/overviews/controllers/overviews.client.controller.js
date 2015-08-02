'use strict';

// Overviews controller
angular.module('overviews').controller('OverviewsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Overviews',
	function($scope, $stateParams, $location, Authentication, Overviews) {
		$scope.authentication = Authentication;

		// Create new Overview
		$scope.create = function() {
			// Create new Overview object
			var overview = new Overviews ({
				name: this.name
			});

			// Redirect after save
			overview.$save(function(response) {
				$location.path('overviews/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Overview
		$scope.remove = function(overview) {
			if ( overview ) { 
				overview.$remove();

				for (var i in $scope.overviews) {
					if ($scope.overviews [i] === overview) {
						$scope.overviews.splice(i, 1);
					}
				}
			} else {
				$scope.overview.$remove(function() {
					$location.path('overviews');
				});
			}
		};

		// Update existing Overview
		$scope.update = function() {
			var overview = $scope.overview;

			overview.$update(function() {
				$location.path('overviews/' + overview._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Overviews
		$scope.find = function() {
			$scope.overviews = Overviews.query();
		};

		// Find existing Overview
		$scope.findOne = function() {
			$scope.overview = Overviews.get({ 
				overviewId: $stateParams.overviewId
			});
		};
	}
]);