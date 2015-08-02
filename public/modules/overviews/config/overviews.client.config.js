'use strict';

// Configuring the Articles module
angular.module('overviews').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Overviews', 'overviews', 'dropdown', '/overviews(/create)?');
		Menus.addSubMenuItem('topbar', 'overviews', 'List Overviews', 'overviews');
		Menus.addSubMenuItem('topbar', 'overviews', 'New Overview', 'overviews/create');
	}
]);