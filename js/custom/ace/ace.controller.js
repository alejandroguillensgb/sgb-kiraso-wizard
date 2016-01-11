
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom.ace')
        .controller('aceController', Controller);

    Controller.$inject = ['$log','$scope','$rootScope', '$http'];
    function Controller($log,$scope,$rootScope,$http) {

        activate();
        
        ////////////////

        function activate() {
            
            $scope.code = "<h1>Kiraso.io</h1>";
            $scope.iframe = document.getElementById('frame');

            $scope.aceLoaded = function(_editor) {
                $scope.aceSession = _editor.getSession();
                $scope.aceRenderer = _editor.renderer;
            };

            $scope.aceChanged = function(e) {
                $scope.iframe.contentWindow.document.open("text/html", "replace");
                $scope.iframe.contentWindow.document.write($scope.aceSession.getValue());
                $scope.iframe.contentWindow.document.close();
            };

            $scope.$on('aceChange', function(event, content, path){
                console.log('CONTENT:'+ content)
                $scope.aceSession.setValue(content);
                $scope.path = path;
            });

            $scope.$on('save', function(event){
                $http
                    .get('http://localhost:8000/setContent?path=' + $scope.path + '&cont=' + JSON.stringify($scope.aceSession.getValue().split('\n')))
                    .success(function(data){
                        console.log('Save: ' + data)
                    })
                    .error(function(){
                        console.error('Failed on save')
                    });
            });    
        }
    }
})();
