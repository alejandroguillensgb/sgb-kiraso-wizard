
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('kiraso')
        .controller('Controller', Controller);

    Controller.$inject = ['$log', '$scope', '$rootScope', '$http'];
    function Controller($log, $scope, $rootScope, $http) {

        activate();
        
        ////////////////

        function activate() {
            $scope.save = function(){
                $rootScope.$broadcast('save');
            };

            $scope.code = function(){
                $rootScope.$broadcast('code');
            };
                        
        }
    }
})();
