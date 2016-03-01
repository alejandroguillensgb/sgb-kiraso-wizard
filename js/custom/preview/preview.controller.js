
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom.preview')
        .controller('previewController', previewController);

    previewController.$inject = ['$log', '$scope', '$rootScope', '$http', 'localStorageService', '$uibModal', '$state', 'd3Factory', '$stateParams', 'kirasoFactory'];
    function previewController($log, $scope, $rootScope, $http, localStorageService, $uibModal, $state, d3Factory, $stateParams, kirasoFactory) {

        activate();
        
        ////////////////

        function activate() {
            console.log("preview controller!!!!!!!!!!!!!!!!!!!!!!!!");
            $scope.$on("reload-view",function(){
                console.log("reload-view")
                document.getElementById('frame').contentWindow.location.reload()
                //$state.reload("app.preview");
            });
        }
    }
})();
