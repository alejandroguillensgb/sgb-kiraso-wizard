
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom.graph')
        .controller('graphController', graphController);

    graphController.$inject = ['$log', '$scope', '$rootScope', '$http', 'localStorageService', '$uibModal', '$state'];
    function graphController($log, $scope, $rootScope, $http, localStorageService, $uibModal, $state) {

        activate();
        
        ////////////////

        function activate() {

            console.log("controller")
            var e = new EventEmitter();
            // e.addListener("event", function(){
            //     console.log("EventEmitter")
            // })
    

            
            $scope.$on('$viewContentLoaded', function(){
                e.emitEvent("event");
                console.log("$viewContentLoaded")
            });
            
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options){ 
                console.log(toState.name == "app.wizard");
                if(toState.name == "app.wizard" && toParams.new){
                    console.log("nuevo");
                    // $scope.$on('$viewContentLoaded', function(){
                    // });                    
                } else if(toState.name == "app.wizard" && !toParams.new){
                    
                    $http
                        .get("http://localhost:8000/mongoose_findGraph?app="+$rootScope.app_name)
                            .success(function(graph){
                                console.log("event send");
                                var event = new CustomEvent("load-graph", { detail: graph, cancelable: true});
                                window.dispatchEvent(event);
                            })
                            .error(function(){
                                console.log("error loading graph");
                            });
                };
            });
        }
    }
})();
