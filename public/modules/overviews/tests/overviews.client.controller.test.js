'use strict';

(function() {
	// Overviews Controller Spec
	describe('Overviews Controller Tests', function() {
		// Initialize global variables
		var OverviewsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Overviews controller.
			OverviewsController = $controller('OverviewsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Overview object fetched from XHR', inject(function(Overviews) {
			// Create sample Overview using the Overviews service
			var sampleOverview = new Overviews({
				name: 'New Overview'
			});

			// Create a sample Overviews array that includes the new Overview
			var sampleOverviews = [sampleOverview];

			// Set GET response
			$httpBackend.expectGET('overviews').respond(sampleOverviews);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.overviews).toEqualData(sampleOverviews);
		}));

		it('$scope.findOne() should create an array with one Overview object fetched from XHR using a overviewId URL parameter', inject(function(Overviews) {
			// Define a sample Overview object
			var sampleOverview = new Overviews({
				name: 'New Overview'
			});

			// Set the URL parameter
			$stateParams.overviewId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/overviews\/([0-9a-fA-F]{24})$/).respond(sampleOverview);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.overview).toEqualData(sampleOverview);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Overviews) {
			// Create a sample Overview object
			var sampleOverviewPostData = new Overviews({
				name: 'New Overview'
			});

			// Create a sample Overview response
			var sampleOverviewResponse = new Overviews({
				_id: '525cf20451979dea2c000001',
				name: 'New Overview'
			});

			// Fixture mock form input values
			scope.name = 'New Overview';

			// Set POST response
			$httpBackend.expectPOST('overviews', sampleOverviewPostData).respond(sampleOverviewResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Overview was created
			expect($location.path()).toBe('/overviews/' + sampleOverviewResponse._id);
		}));

		it('$scope.update() should update a valid Overview', inject(function(Overviews) {
			// Define a sample Overview put data
			var sampleOverviewPutData = new Overviews({
				_id: '525cf20451979dea2c000001',
				name: 'New Overview'
			});

			// Mock Overview in scope
			scope.overview = sampleOverviewPutData;

			// Set PUT response
			$httpBackend.expectPUT(/overviews\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/overviews/' + sampleOverviewPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid overviewId and remove the Overview from the scope', inject(function(Overviews) {
			// Create new Overview object
			var sampleOverview = new Overviews({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Overviews array and include the Overview
			scope.overviews = [sampleOverview];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/overviews\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOverview);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.overviews.length).toBe(0);
		}));
	});
}());