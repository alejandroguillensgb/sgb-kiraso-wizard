(function() {
    'use strict';

    angular
        .module('custom.sideb')
        .controller('sidebController', sidebController);

    sidebController.$inject = ['$log','$scope', '$rootScope','PrebuiltLoader', '$uibModal'];
    function sidebController($log,$scope,$rootScope,PrebuiltLoader, $uibModal) {

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
                var event = new CustomEvent("create-node", {detail: item});
                window.dispatchEvent(event);
            }

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
