'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'growdome';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('overviews');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('volunteers');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('overviews').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Overview', 'overviews', 'dropdown', '/overviews(/create)?');
		Menus.addSubMenuItem('topbar', 'overviews', 'List Overviews', 'overviews');
		Menus.addSubMenuItem('topbar', 'overviews', 'New Overview', 'overviews/create');
	}
]);

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
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('volunteers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Volunteers', 'volunteers', 'dropdown', '/volunteers(/create)?');
		Menus.addSubMenuItem('topbar', 'volunteers', 'List Volunteers', 'volunteers');
		Menus.addSubMenuItem('topbar', 'volunteers', 'New Volunteer', 'volunteers/create');
	}
]);

'use strict';

//Setting up route
angular.module('volunteers').config(['$stateProvider',
	function($stateProvider) {
		// Volunteers state routing
		$stateProvider.
		state('listVolunteers', {
			url: '/volunteers',
			templateUrl: 'modules/volunteers/views/list-volunteers.client.view.html'
		});
	}
]);

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
                controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {



                    $scope.ok = function () {

                        $modalInstance.close();


                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                }],
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
				controller: ["$scope", "$modalInstance", "volunteer", function ($scope, $modalInstance, volunteer) {

					$scope.volunteer = volunteer;

					$scope.ok = function () {

							$modalInstance.close($scope.volunteer);


					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};

				}],
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

volunteerApp.controller('VolunteersCreateController', ['$scope',  'Volunteers','Notify',
	function($scope,  Volunteers, Notify) {

		$scope.experienceLevel = [
			{id:1, item:'beginner'},
			{id:2, item:'intermediate'},
			{id:3, item:'advanced'}

		];

        // Create new Volunteer
        this.create = function() {
        	// Create new Volunteer object
        	var volunteer = new Volunteers ({
        		firstName: this.firstName,
        		lastName: this.lastName,
        		phone: this.phone,
        		email:this.email,
				experienceLevel:this.experienceLevel
        	});

        	// Redirect after save
        	volunteer.$save(function(response) {

                Notify.sendMsg('NewVolunteer', {'id':response._id});


        		// Clear form fields
        		$scope.firstName = '';
        		$scope.lastName = '';
        		$scope.phone = '';
        		$scope.email = '';
        		$scope.availabity = '';
				$scope.experienceLevel ='';


        	}, function(errorResponse) {
        		$scope.error = errorResponse.data.message;
        	});
        };
	}
]);

volunteerApp.controller('VolunteersEditController', ['$scope',  'Volunteers',
	function($scope,  Volunteers) {

		$scope.experienceLevel = [
			{id:1, item:'beginner'},
			{id:2, item:'intermediate'},
			{id:3, item:'advanced'},

		];

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

volunteerApp.directive('volunteerList',['Volunteers','Notify', function(Volunteers, Notify){
	return {
		restrict: 'E',
		transclude:true,
		templateUrl: 'modules/volunteers/views/volunteer-list-template.html',
		link:function(scope, element, attrs){
            // when a new volunteer is added, update the volunteer list
            Notify.getMsg('NewVolunteer', function(event,data){
                scope.volunteersCtrl.volunteers = Volunteers.query();
            });
		}
	};
}]);






'use strict';

//Volunteers service used to communicate Volunteers REST endpoints
angular.module('volunteers')
	.factory('Volunteers', ['$resource',
		function($resource) {
			return $resource('volunteers/:volunteerId', { volunteerId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}
	])

	.factory('Notify', ['$rootScope',function($rootScope) {
		var notify = {};
		notify.sendMsg = function(msg, data) {
			data = data || {};
			$rootScope.$emit(msg, data);
			console.log ('message sent!');
		};
		notify.getMsg = function(msg, func, scope) {
			var unbind = $rootScope.$on(msg, func);
			if (scope){
				scope.$on('destroy', unbind);
			}
		};
		return notify;
	}
	]);
