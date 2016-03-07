(function() {
    'use strict';

    angular
        .module('custom.sideb')
        .controller('sidebController', sidebController);

    sidebController.$inject = ['$scope', '$rootScope','PrebuiltLoader', '$uibModal', 'kirasoFactory', '$http'];
    function sidebController($scope, $rootScope, PrebuiltLoader, $uibModal, kirasoFactory, $http) {

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

            $scope.$on("new-component", function(){
                PrebuiltLoader.getComps(compReady);
                $scope.$apply();   
            });
              
            function compReady(items) {
                console.log("Controller items")
                console.log(items)
                $scope.compItems = items;
            }

            $scope.createNode = function(item){
                $rootScope.$broadcast("create-node", item); 
            };

            $scope.closeModal = function(){
                $scope.modalInstance.close();
            };

            $scope.addComp = function() {
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/views/partials/addCompModal.html',
                    scope: $scope
                });
            };

            $scope.removeComp = function(item){
                var reqObj = {
                    path: "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username,
                    filename: "inventario_componentes_propios.json",
                    app_name: kirasoFactory.getAppName(),
                    cont: JSON.stringify(item) 
                };
                $http
                    .put($rootScope.url + "/removeComp", reqObj)
                    .success(function(){
                        PrebuiltLoader.getComps(compReady);
                        $scope.$apply();
                    })
                    .error(function(err){
                        console.log(err);
                    })
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
