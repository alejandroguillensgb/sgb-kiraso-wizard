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
              
            $scope.$on("new-app", function(){
                PrebuiltLoader.getApps(prebuiltReady);
                $scope.$apply();
            });

            function prebuiltReady(items) {
                $scope.appItems = items;
            }

            PrebuiltLoader.getComps(compReady);

            $scope.$on("new-component", function(){
                $scope.closeModal;
                PrebuiltLoader.getComps(compReady);
                $scope.$apply();   
            });
              
            $scope.removePrebuilt = function(item){
                $scope.confirm = false;
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/views/partials/confirmRemoveModal.html',
                    scope: $scope,
                    size: "sm"
                });
                $scope.modalInstance.result.then(function(confirm){
                    if(confirm){
                        var reqObj = {
                            path: "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username,
                            filename: "inventario_apps_propios.json",
                            app_name: kirasoFactory.getAppName(),
                            cont: JSON.stringify(item) 
                        };
                        $http
                            .put($rootScope.url + "/removeComp", reqObj)
                            .success(function(){
                                PrebuiltLoader.getApps(prebuiltReady);
                                $scope.$apply();
                            })
                            .error(function(err){
                                console.log(err);
                            })
                    }
                });
                
            };

            function compReady(items) {
                console.log("Controller items")
                console.log(items)
                $scope.compItems = items;
            }

            $scope.closeModal = function(){
                $scope.modalInstance.dismiss(false);
            };

            $scope.confirmChange = function(){
                $scope.modalInstance.close(!$scope.confirm);
            };

            $scope.loadPbApp = function(item){
                $scope.confirm = false;
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/views/partials/confirmPrebuiltModal.html',
                    scope: $scope,
                    size: "sm"
                });
                $scope.modalInstance.result.then(function(confirm){
                    if(confirm){
                        $http
                            .get($rootScope.url + "/mongoose_findGraph?app=" + item.name)
                            .success(function(graph){
                                console.log("event send");
                                $rootScope.$broadcast("load-prebuilt-graph", graph);
                            })
                            .error(function(){
                                console.log("error loading graph");
                            });
                    }
                })    
            };

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
                $scope.confirm = false;
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/views/partials/confirmRemoveModal.html',
                    scope: $scope,
                    size: "sm"
                });
                $scope.modalInstance.result.then(function(confirm){
                    if(confirm){
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
                    }
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
