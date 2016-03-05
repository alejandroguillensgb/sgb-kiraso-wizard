
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom.preview')
        .controller('previewController', previewController);

    previewController.$inject = ['$scope'];
    function previewController($scope) {

        activate();
        
        ////////////////

        function activate() {
            console.log("preview controller!!!!!!!!!!!!!!!!!!!!!!!!");
            // $scope.$on("reload-view",function(){
            //     console.log("reload-view")
            //     document.getElementById('frame').contentWindow.location.reload(true);

            //     //$state.reload("app.preview");
            // });
            // $scope.online = function(){console.log("ONLINE")}
        }
    }
})();
