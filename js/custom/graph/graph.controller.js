
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom.graph')
        .controller('graphController', graphController);

    graphController.$inject = ['$scope', '$rootScope', '$http', 'd3Factory', 'kirasoFactory'];
    function graphController($scope, $rootScope, $http, d3Factory, kirasoFactory) {

        activate();
        
        ////////////////

        function activate() {

            console.log("graphController");
            $scope.app_name = kirasoFactory.getAppModel().appModel.name;
             
            var stateChangeSuccessListener = $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options){ 
                if(toState.name == "app.wizard" && toParams.new=="false"){
                    console.log("antes del servicio")
                    $scope.$on("directiveReady", function(){
                        $http
                            .get($rootScope.url + "/mongoose_findGraph?app="+$scope.app_name)
                                .success(function(graph){
                                    console.log("event send");
                                    $scope.$emit("load-graph", graph);
                                })
                                .error(function(){
                                    console.log("error loading graph");
                                });    
                    });                    
                } else{
                    $scope.$on("directiveReady", function(){
                        if(fromState.name == "app.preview"){
                            console.log("reload");
                            $scope.$emit("reload-graph", kirasoFactory.getGraph());
                        } else {
                            console.log("nuevo");
                            $scope.$emit("new-graph");
                        }; 
                    });
                };
            });
        }
    }
})();
