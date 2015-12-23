
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
                console.log('Entre 2')
                $rootScope.$broadcast('save');
                $scope.$on('aceSave', function(event, cont, path){
                    console.log('entre 4'+ cont)
                    $http
                        .get('http://localhost:8000/setContent?path=' + path + '&cont=' + cont)
                        .success(function(){
                            console.log('Save success data = ')
                        })
                        .error(function(){
                            console.error('Failed on save')
                        });
                })
            };
                        
        }
    }
})();
