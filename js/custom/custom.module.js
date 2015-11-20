(function() {
    'use strict';

    angular
        .module('kiraso', [
            // request the the entire framework
            'angle',
            // or just modules
            'app.core',
            'app.routes',
            'app.sidebar',
            'ui.ace'
            /*...*/
        ]);
})();