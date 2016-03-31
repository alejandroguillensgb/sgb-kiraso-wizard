// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom.ace')
        .controller('aceController', Controller);

    Controller.$inject = ['$scope', '$rootScope','$http', 'kirasoFactory', '$uibModal'];
    function Controller($scope, $rootScope, $http, kirasoFactory, $uibModal) {

        activate();
        
        ////////////////

        function activate() {

            $scope.$on("$viewContentLoaded", function(){
                $scope.$emit("ace-loaded");
            });
            
            $scope.code = "<h1>Kiraso.io</h1>";

            $scope.mode = "html";
        
            $scope.aceLoaded = function(_editor) {
                $scope.aceSession = _editor.getSession();
                $scope.aceRenderer = _editor.renderer;
            };

            $scope.$on('aceChange', function(event, content, path){
                $scope.aceSession.setValue(content);
                $scope.path = path;
                var split_path = path.split(".");
                if(split_path[split_path.length-1] == "js" || split_path[split_path.length-1] == "json" || split_path[split_path.length-1] == "ts")
                    $scope.mode = "javascript"
                else if(split_path[split_path.length-1] == "html")
                    $scope.mode = "html"
                else if(split_path[split_path.length-1] == "xml")
                    $scope.mode = "xml"
                else
                    $scope.mode = "javascript"
            });

            $scope.updateGraph = function(data){
                var thisGraph = JSON.parse(kirasoFactory.getGraph())
                var data_key;
                var screenName;

                for(var key in data){
                    data_key = key;
                    screenName = key.split("Screen")[0];
                };

                var update_node = _.find(thisGraph.nodes, function(node){
                    return node.screenModel.name.toLowerCase() == screenName;
                });

                for(var key in data[data_key]){
                    if(key == "dataSource"){
                        update_node.dataModel = {type: data[data_key][key].type, path:data[data_key][key].params.path};
                    } else if(key == "params") {
                        update_node.paramsModel = data[data_key][key];
                    } else if(key == "default") {
                        update_node.screenModel = {name: screenName, default: data[data_key][key]};
                    } else if(key == "dataConnectors") {
                        update_node.dataconnectorModel = data[data_key][key];
                    }
                };
                console.log(thisGraph.nodes);
                kirasoFactory.setGraph(JSON.stringify({"nodes": thisGraph.nodes, "edges": thisGraph.edges}));
                var reqObj = {
                    graph: JSON.stringify({"nodes": thisGraph.nodes, "edges": thisGraph.edges})
                };
                $http
                    .post($rootScope.url + "/mongoose_setGraph?app=" + kirasoFactory.getAppName(), reqObj)
                    .success(function(){
                        $scope.modalInstance = $uibModal.open({
                            animation: true,
                            template: '<p>Your app was saved</p>',
                            size: "sm"
                        });
                    })
                    .error(function(){
                        $scope.modalInstance = $uibModal.open({
                            animation: true,
                            template: '<p>Error saving your app</p>',
                            size: "sm"
                        });
                    });
            };

            $scope.$on('save', function(event){
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    template: '<p>Saving file</p>',
                    size: "sm"
                });
                var split_path = $scope.path.split("/");
                var filename = split_path[split_path.length -1];
                split_path.splice(split_path.length -1, 1); 
                var reqObj = {
                    path: split_path.join("/"),
                    filename: filename,
                    cont: JSON.stringify($scope.aceSession.getValue().split('\n'))
                };
                var split_filename = filename.split(".");
                if(split_filename[1] == "ts" && 
                    !(split_filename[0]=="screens" || split_filename[0]=="routes" || 
                        split_filename[0]=="languages" || split_filename[0]=="settings")){
                    console.log("config file");
                    $http
                        .put($rootScope.url + '/setContentConfig', reqObj)
                        .success(function(data){
                            console.log('Save: ');
                            console.log(data);
                            $scope.updateGraph(data);
                            $scope.modalInstance.close();
                            $scope.modalInstance = $uibModal.open({
                                animation: true,
                                template: '<p>File saved</p>',
                                size: "sm"
                            });
                        })
                        .error(function(){
                            $scope.modalInstance.close();
                            $scope.modalInstance = $uibModal.open({
                                animation: true,
                                template: '<p>Failed on save</p>',
                                size: "sm"
                            });
                        });
                } else if(filename == "metadata.json") {
                    reqObj.screens_path = "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName() + "/screens"
                    $http
                        .put($rootScope.url + "/setMetadata", reqObj)
                        .success(function(){
                            $scope.modalInstance.close();
                            $scope.modalInstance = $uibModal.open({
                                animation: true,
                                template: '<p>Metadata saved</p>',
                                size: "sm"
                            });
                        })
                        .error(function(){
                            $scope.modalInstance.close();
                            $scope.modalInstance = $uibModal.open({
                                animation: true,
                                template: '<p>Error saving metadata</p>',
                                size: "sm"
                            });
                        })
                } else {
                    $http
                        .put($rootScope.url + '/setContent', reqObj)
                        .success(function(data){
                            $scope.modalInstance.close();
                            $scope.modalInstance = $uibModal.open({
                                animation: true,
                                template: '<p>File saved</p>',
                                size: "sm"
                            });
                        })
                        .error(function(){
                            $scope.modalInstance.close();
                            $scope.modalInstance = $uibModal.open({
                                animation: true,
                                template: '<p>Failed on save</p>',
                                size: "sm"
                            });
                        });
                };
            });
        }
    }
})();
