(function() {
    'use strict';

    angular
        .module('custom.sideb')
        .controller('sidebController', sidebController);

    sidebController.$inject = ['$log','$scope', 'PrebuiltLoader'];
    function sidebController($log,$scope, PrebuiltLoader) {

        activate();
        
        ////////////////

        function activate() {
            // Load menu from json file
            // ----------------------------------- 

            PrebuiltLoader.getApps(prebuiltReady);
              
            function prebuiltReady(items) {
                $scope.appItems = items;
            }

            PrebuiltLoader.getComps(compReady);
              
            function compReady(items) {
                $scope.compItems = items;
            }
            
        }
    }
})();
