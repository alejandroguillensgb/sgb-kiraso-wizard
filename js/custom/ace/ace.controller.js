
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom.ace')
        .controller('aceController', Controller);

    Controller.$inject = ['$log','$scope','$rootScope'];
    function Controller($log,$scope,$rootScope) {

        activate();
        
        ////////////////

        function activate() {
            
            $scope.code = "<h1>Kiraso.io</h1>";
            $scope.iframe = document.getElementById('frame');
            $scope.editor = ace.edit("aceEditor");
            console.log($scope.editor)

            $scope.aceLoaded = function(_editor) {
                $scope.aceSession = _editor.getSession();
                $scope.aceRenderer = _editor.renderer;
            };

            $scope.aceChanged = function(e) {
                $scope.iframe.contentWindow.document.open("text/html", "replace");
                $scope.iframe.contentWindow.document.write($scope.aceSession.getValue());
                $scope.iframe.contentWindow.document.close();
                $scope.code = $scope.aceSession.getValue();
                console.log('CHANGED: '+$scope.code);
            };

            $scope.$on('aceChange', function(event, content, path){
                $scope.code = content;
                $scope.path = path;
            });

            $scope.$on('save', function(event){
                console.log('entre 3'+ $scope.path);
                $rootScope.$broadcast('aceSave', $scope.code.toString(), $scope.path);   
            })
            
        }
    }
})();
