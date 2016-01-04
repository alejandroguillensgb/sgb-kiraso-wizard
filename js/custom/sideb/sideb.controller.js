(function() {
    'use strict';

    angular
        .module('custom.sideb')
        .controller('sidebController', sidebController);

    sidebController.$inject = ['$log','$scope', '$rootScope','PrebuiltLoader'];
    function sidebController($log,$scope,$rootScope,PrebuiltLoader) {

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


            $scope.prueba = function(item){
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent("create-node", true, true, item);
                document.documentElement.dispatchEvent(event);
            }
            
        }
    }
})();
