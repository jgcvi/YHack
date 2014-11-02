'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Proposals', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List of Policy Proposals', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'Create a New Proposal', 'articles/create');
	}
]);