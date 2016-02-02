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
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent("create-node", true, true, item);
                document.documentElement.dispatchEvent(event);
            }

            $scope.closeModal = function(){
                $scope.modalInstance.close();
            };

            $scope.openModal = function (item) {
                console.log(item);
                $scope.type = item.type;
                $scope.images_url = item.images_url;
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
