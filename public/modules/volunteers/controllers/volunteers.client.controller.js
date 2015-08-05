'use strict';
var volunteerApp = angular.module('volunteers');
// Volunteers controller
volunteerApp.controller('VolunteersController', ['$scope', '$stateParams', 'Authentication', 'Volunteers','$modal', '$log',
	function($scope, $stateParams, Authentication, Volunteers, $modal, $log) {


		this.authentication = Authentication;

		// Find a list of Volunteers
		this.volunteers = Volunteers.query();

		//open a modal window to update a single volunteer record
		this.modalUpdate = function (size, selectedVolunteer) {

			var modalInstance = $modal.open({

				templateUrl: 'modules/volunteers/views/edit-volunteer.client.view.html',
				controller: function ($scope, $modalInstance, volunteer) {

					$scope.volunteer = volunteer;

					$scope.ok = function () {

							$modalInstance.close($scope.volunteer);


					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};

				},
				size: size,
				resolve: {
					volunteer: function () {
						return selectedVolunteer;
					}

				}
			});
			modalInstance.result.then(function (selectedVolunteer) {
				this.selected = selectedVolunteer;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};
	}
]);

volunteerApp.controller('VolunteersCreateController', ['$scope',  'Volunteers',
	function($scope,  Volunteers) {
	}
]);

volunteerApp.controller('VolunteersEditController', ['$scope',  'Volunteers',
	function($scope,  Volunteers) {

		 //Update existing Volunteer
		this.update = function(editedVolunteer) {
			var volunteer = editedVolunteer;

			volunteer.$update(function() {

			},function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);



        //
		//// Create new Volunteer
		//$scope.create = function() {
		//	// Create new Volunteer object
		//	var volunteer = new Volunteers ({
		//		firstName: this.firstName,
		//		lastName: this.lastName,
		//		phone: this.phone,
		//		email:this.email
		//	});
        //
		//	// Redirect after save
		//	volunteer.$save(function(response) {
		//		$location.path('volunteers/' + response._id);
        //
		//		// Clear form fields
		//		$scope.firstName = '';
		//		$scope.lastName = '';
		//		$scope.phone = '';
		//		$scope.email = '';
		//		$scope.availabity = ['less than 20hrs per week', 'over 20hrs per week'];
        //
		//	}, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};
        //
		//// Remove existing Volunteer
		//$scope.remove = function(volunteer) {
		//	if ( volunteer ) {
		//		volunteer.$remove();
        //
		//		for (var i in $scope.volunteers) {
		//			if ($scope.volunteers [i] === volunteer) {
		//				$scope.volunteers.splice(i, 1);
		//			}
		//		}
		//	} else {
		//		$scope.volunteer.$remove(function() {
		//			$location.path('volunteers');
		//		});
		//	}
		//};
        //
		//// Update existing Volunteer
		//$scope.update = function() {
		//	var volunteer = $scope.volunteer;
        //
		//	volunteer.$update(function() {
		//		$location.path('volunteers/' + volunteer._id);
		//	}, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};
        //
        //
        //
		//// Find existing Volunteer
		//$scope.findOne = function() {
		//	$scope.volunteer = Volunteers.get({
		//		volunteerId: $stateParams.volunteerId
		//	});
		//};
        //
