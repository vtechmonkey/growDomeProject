'use strict';
var volunteerApp = angular.module('volunteers');
// Volunteers controller
volunteerApp.controller('VolunteersController', ['$scope', '$stateParams', 'Authentication', 'Volunteers','$modal', '$log',
	function($scope, $stateParams, Authentication, Volunteers, $modal, $log) {


		this.authentication = Authentication;

		// Find a list of Volunteers
		this.volunteers = Volunteers.query();

        //open a modal window to create a single volunteer record
        this.modalCreate = function (size) {

            var modalInstance = $modal.open({

                templateUrl: 'modules/volunteers/views/create-volunteer.client.view.html',
                controller: function ($scope, $modalInstance) {



                    $scope.ok = function () {

                        $modalInstance.close();


                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                },
                size: size

            });
            modalInstance.result.then(function (selectedItem) {

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

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
			modalInstance.result.then(function (selectedItem) {
				this.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};


        // Remove existing Volunteer
        this.remove = function(volunteer) {
        	if ( volunteer ) {
        		volunteer.$remove();

        		for (var i in this.volunteers) {
        			if (this.volunteers [i] === volunteer) {
        				this.volunteers.splice(i, 1);
        			}
        		}
        	} else {
        		this.volunteer.$remove(function() {

        		});
        	}
        };
	}
]);

volunteerApp.controller('VolunteersCreateController', ['$scope',  'Volunteers',
	function($scope,  Volunteers) {

        // Create new Volunteer
        this.create = function() {
        	// Create new Volunteer object
        	var volunteer = new Volunteers ({
        		firstName: this.firstName,
        		lastName: this.lastName,
        		phone: this.phone,
        		email:this.email
        	});

        	// Redirect after save
        	volunteer.$save(function(response) {


        		// Clear form fields
        		$scope.firstName = '';
        		$scope.lastName = '';
        		$scope.phone = '';
        		$scope.email = '';
        		$scope.availabity = ['less than 20hrs per week', 'over 20hrs per week'];

        	}, function(errorResponse) {
        		$scope.error = errorResponse.data.message;
        	});
        };
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

volunteerApp.directive('volunteerList',[function(){
	return {
		restrict: 'E',
		transclude:true,
		templateUrl: 'modules/volunteers/views/volunteer-list-template.html',
		link:function(scope, element, attrs){

		}
	};
}]);





