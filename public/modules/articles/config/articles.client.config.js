'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Proposals', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Proposals', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Proposals', 'articles/create');
	}
]);