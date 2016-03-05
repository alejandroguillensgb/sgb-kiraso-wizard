(function() {
    'use strict';

    angular
        .module('custom.sideb')
        .controller('sidebController', sidebController);

    sidebController.$inject = ['$scope', '$rootScope','PrebuiltLoader', '$uibModal'];
    function sidebController($scope, $rootScope, PrebuiltLoader, $uibModal) {

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

            $scope.createNode = function(item){
                $rootScope.$broadcast("create-node", item); 
            };

            $scope.closeModal = function(){
                $scope.modalInstance.close();
            };

            $scope.openModal = function (item) {
                $scope.type = item.type;
                $scope.description_images = item.description_images;
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/views/partials/modals.html',
                    scope: $scope
                });
            };

            $scope.copyContent = function(item){
                PrebuiltLoader.copyContent(item, reloadController);
            }

            function reloadController(name, path){
                $scope.compItems.push({name: name, path: path})
            }
            
        }
    }
})();
