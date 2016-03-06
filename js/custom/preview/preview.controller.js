
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom.preview')
        .controller('previewController', previewController);

    previewController.$inject = ['$scope', '$state', '$rootScope', 'kirasoFactory'];
    function previewController($scope, $state, $rootScope, kirasoFactory) {

        activate();
        
        ////////////////

        function activate() {
            console.log("preview controller!!!!!!!!!!!!!!!!!!!!!!!!");

        }
    }
})();
