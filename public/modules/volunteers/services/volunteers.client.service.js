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
