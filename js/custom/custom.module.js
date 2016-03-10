(function() {
    'use strict';

    angular
        .module('kiraso', [
            // request the the entire framework
            'angle',
            // or just modules
            'app.core',
            'app.colors',
            'app.routes',
            'app.sidebar',
            'custom.ace',
            'custom.sideb',
            'custom.forms',
            'custom.graph'
            /*...*/
        ]);
})();