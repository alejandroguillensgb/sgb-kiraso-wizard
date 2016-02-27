
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('kiraso')
        .controller('Controller', Controller);

    Controller.$inject = ['$log', '$scope', '$rootScope', '$http', 'localStorageService', '$uibModal', '$state', 'kirasoFactory'];
    function Controller($log, $scope, $rootScope, $http, localStorageService, $uibModal, $state, kirasoFactory) {

        activate();
        
        ////////////////

        function activate() {

            $scope.username = kirasoFactory.getUsername().username;
            $scope.projects = kirasoFactory.getProjects().projects;

            $scope.goLogin = function(){
                $state.go("base.login");
            };

            $scope.closeModal = function(){
                $scope.modalInstance.close();
            };

            $scope.newProject = function() {
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/views/partials/newAppModal.html',
                    scope: $scope
                });
            };

            $scope.previewActive = false;

            $scope.wizard = function(){
                $scope.previewActive = false;
            } 

            $scope.preview = function(){
                $scope.previewActive = true;
            };

            $scope.new = function(){
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent("create-new", true, true, 'new');
                document.documentElement.dispatchEvent(event);
                localStorageService.clearAll();
            };

            $scope.save = function(){
                $rootScope.$broadcast('save');
            };

            $scope.saveWizard = function(){
                console.log("save")
                $scope.$broadcast("request-graph");
            };
            
            $scope.loadProject = function(project){
                $http
                    .get("http://localhost:8000/mongoose_findApp?app=" + project)
                    .success(function(data){
                        kirasoFactory.setAppModel(data);
                        kirasoFactory.setAppName(data.name);
                        console.log("loadproject<")
                        console.log(data)
                        $state.go("app.wizard", { new: false });
                    })
                    .error(function(){
                        console.log("erro loading project");
                    });
            };

            $scope.code = function(){
                console.log("request code");
                $scope.$broadcast("create-file");
                // var event = document.createEvent('CustomEvent');
                // event.initCustomEvent("create-file", true, true, '');
                // document.documentElement.dispatchEvent(event);
            };

            $scope.load = function(){
                // var event = document.createEvent('CustomEvent');
                // event.initCustomEvent("load-file", true, true, '');
                // document.documentElement.dispatchEvent(event);
            };            

            $scope.download = function(){
                // var event = document.createEvent('CustomEvent');
                // event.initCustomEvent("download-file", true, true, '');
                // document.documentElement.dispatchEvent(event);
            };

            //testing
            $scope.team = function(){
                $http
                    .get("http://localhost:8000/dropDb")
                    .success(function(data){
                        console.log(data)
                    })
                    .error(function(){
                        console.log('DROP error')
                    })
            };

            $scope.nodes = [];
            $scope.edges = [];
            $scope.roots = [];
            $scope.src = [];
            $scope.tgt = [];


            
            $scope.sendInfoFunction = function(event, graph){
                console.log("listen send info")
                var data = JSON.parse(graph);
                $scope.nodes = data.nodes;
                $scope.edges = data.edges;

                _.forEach($scope.edges, function(elem){
                    $scope.src.push(elem.source);
                    $scope.tgt.push(elem.target);
                });
                
                _.forEach(_.uniq($scope.src), function(elem){
                    if(_.uniq($scope.tgt).indexOf(elem) == -1)
                        $scope.roots.push(elem);
                });
                
                var adjMatrix = [];
                console.log($scope.nodes.length);
                for(var i = 1; i < $scope.nodes.length+1; ++i){
                    adjMatrix[i] = []; 
                    for(var j = 1; j < $scope.nodes.length+1; ++j){
                        if(_.filter($scope.edges, function(edge){return edge.source == i && edge.target == j}).length==1)
                            adjMatrix[i][j] = true;
                        else
                            adjMatrix[i][j] = false;
                    };
                };

                function bfs(adjMatrix, node){
                    var queue = [];
                    var mark = [];

                    queue.push(node);
                    mark[node] = true;

                    while(queue.length != 0){
                        var item = queue.shift();
                        for(var i = 1; i < $scope.nodes.length+1; ++i){
                            if(adjMatrix[item][i] && !mark[i]){
                                mark[i] = true;
                                queue.push(i);
                            };
                        };
                    };

                    return mark;
                };

                var reach = bfs(adjMatrix, 3);

                for(var i = 1; i<reach.length+1; i++){
                    if(reach[i])
                        console.log(i)
                }

                //Config files

                var exportfiles = [];

                _.forEach($scope.nodes, function(item){
                    var nodeId = item.id;
                    var screen_obj = item.screenModel;
                    var title = screen_obj.name.toLowerCase();
                    var dataSource = [];

                    if(item.dataModel){
                        var nodeData = item.dataModel;
                        var nodeDataType = nodeData.type;
                        var nodeDataPath = nodeData.path;
                        dataSource = [
                            "\tdataSource: {",
                            "\t\ttype: " + nodeDataType + ",",
                            "\t\tparams: {",
                            "\t\t\tpath: " + nodeDataPath,
                            "\t\t}",
                            "\t},"
                        ];
                    };

                    var params = [];
                    if(item.paramsModel){
                        var nodeParams = item.paramsModel;
                        var eachParam = []; 
                        for (var key in nodeParams){
                            eachParam.push("\t\t" + key + ": " + JSON.stringify(nodeParams[key]) + ",");
                        };
                        params = [
                            "\tparams: {",
                            [eachParam],
                            "\t},",    
                        ];
                    };
                    
                    var file = [
                        "export var " + title + "Screen = {",
                        "\ttype: '" + item.type + "',",
                        params,    
                        dataSource,
                        "}"
                    ];

                    exportfiles.push(file);
                    
                    var reqObj = {
                        path: "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName(),
                        filename: title + ".ts",
                        cont: JSON.stringify(_.flattenDeep(file))
                    };
                    $http
                        .put("http://localhost:8000/setContent", reqObj)
                        .success(function(data){
                            console.log('Save: ' + data);
                        })
                        .error(function(){
                            console.error('Failed on save');
                        });
                });

                //////////////////////////////////////////////////////////////////////////////

                //Screen.ts

                var imports = [];
                var screens = [];
                var nodeObj = [];
                
                // imports
                _.forEach($scope.nodes, function(item){
                    var screenObj = item.screenModel;
                    var name = screenObj.name.toLowerCase();
                    imports.push("import " + name + " = require('./"+ name +"')");    
                });

                // screens
                _.forEach($scope.roots, function(root){
                    var root_name = _.find($scope.nodes, function(node){return node.id == root}).screenModel.name.toLowerCase();
                    screens.push("\t'" + root_name +"': " + root_name + "." + root_name + "Screen,"); 

                    var reacheability = bfs(adjMatrix, root);

                    _.forEach($scope.nodes, function(item){
                        if(reacheability[item.id] && item.id != root){
                            var screenObj = item.screenModel;
                            var name = screenObj.name.toLowerCase();
                            imports.push("import " + name + " = require('./"+ name +"')");
                            screens.push("\t'" + root_name + "." + name + "': " + name + "." + name + "Screen,");
                            nodeObj.push({screenName: name, id: item.id});    
                        };
                        
                    });    
                });

                var line = ['','export var screens : Megazord.ContainerScreenList = {'];
                var end = ["}"];
                var result = _.flattenDeep([imports,line,screens,end]);

                var reqObj = {
                    path: "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName(),
                    filename: "screens.ts",
                    cont: JSON.stringify(result)
                };             
                $http
                    .put("http://localhost:8000/setContent", reqObj)
                    .success(function(data){
                        console.log('success');
                    })
                    .error(function(err){
                        console.error(err);
                    });

                ///////////////////////////////////////////////////////////////////////////

                // Routes.ts

                /*
                    example
                    export var routes : Megazord.RouterConfig = {
                        "root.companies" : {
                            itemClick: 'root.detail'
                        },
                        "root.dashboard" : {
                            news: 'root.news',
                            events: 'root.sessions',
                            companies: 'root.companies',
                            form: 'root.form'
                        },
                        "root.login" : {
                            doLogin: 'root.companies'
                        }
                    };
                */

                // var routes_line = ["export var routes : Megazord.RouterConfig = {"]; 
                // var routes_end = ["};"];
                // var routes = [];

                // _.forEach(localStorageService.keys(), function(elem){
                //     if(elem.indexOf("edge") >= 0){
                //         var src_tgt = elem.split("edge")[1].split("-");
                //         var src = src_tgt[0];
                //         var tgt = src_tgt[1];
                //         _.forEach(nodeObj, function(obj){
                //             if(src == obj.id.toString()){
                //                 var index = _.findIndex(nodeObj, function(obj){
                //                     return obj.id.toString() == tgt
                //                 });
                //                 var event_name = localStorageService.get(elem).event;
                //                 var routes_init = ["\t'" + obj.screenName + "': {", 
                //                                     "\t\t" + event_name + ": '" +
                //                                     nodeObj[index].screenName + "',",
                //                                     "\t},"]
                //                 routes.push(routes_init);
                //             };
                //         });
                //     };
                // });
                // console.log(routes)

                ///////////////////////////////////////////////////////////////////////////

            };
            $scope.$on("send-info", $scope.sendInfoFunction);

        }
    }
})();
