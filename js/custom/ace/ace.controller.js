
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom.ace')
        .controller('aceController', Controller);

    Controller.$inject = ['$log','$scope'];
    function Controller($log,$scope) {

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
        }
    }
})();
