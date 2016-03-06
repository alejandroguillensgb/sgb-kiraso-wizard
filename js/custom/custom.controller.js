
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('kiraso')
        .controller('Controller', Controller);

    Controller.$inject = ['$scope', '$rootScope', '$http', '$uibModal', '$state', 'kirasoFactory', '$q'];
    function Controller($scope, $rootScope, $http, $uibModal, $state, kirasoFactory, $q) {

        activate();
        
        ////////////////

        function activate() {

            $rootScope.url = "http://localhost:8000";
            $scope.username = kirasoFactory.getUsername().username;
            $scope.projects = kirasoFactory.getProjects().projects;

            $scope.goLogin = function(){
                $state.go("base.login");
            };

            $scope.goToProjects = function(){
                $state.go("projects");
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

            $scope.deleteProject = function(project){
                console.log(project);
                //alerta 
                $http
                    .delete($rootScope.url + "/mongoose_removeElement?app=" + project + "&username=" +$scope.username)
                    .success(function(){
                        console.log("delete successful")    
                        var pro = _.filter($scope.projects, function(e){
                            return e != project
                        });
                        kirasoFactory.setProjects(pro);
                        $scope.projects = kirasoFactory.getProjects().projects;
                    })
                    .error(function(){
                        console.log("delete error")
                    })
            }; 

            if($state.current.name == "app.preview")
                $scope.previewActive = true;
            else 
                $scope.previewActive = false;

            $scope.wizard = function(){
                $scope.previewActive = false;
                if($scope.pid){
                    console.log("KILL PID")
                    $http
                        .get($rootScope.url + "/killApp?pid=" + $scope.pid)
                        .success(function(data){
                            console.log(data);
                        })
                        .error(function(){
                            console.log("error killing");
                        })
                }
            };

            $scope.preview = function(){
                $scope.previewActive = true;
                $scope.$broadcast("set-graph");
                $scope.$broadcast("create-file");
            };

            $scope.messages = [];
            $scope.$on("files-ready", function(){
                console.log("files ready")
                var path = "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName();

                var socket = io.connect($rootScope.url);
                console.log(socket);
                socket.on("news", function(data) {
                    $scope.messages.push(data);
                    //var output = document.getElementById("output");
                    //output.innerHTML += "<p style='color: white; text-align: left;'> > " + data + "</p>";
                    //output.scrollTop = output.scrollHeight;
                });

                $http
                    .get($rootScope.url + "/exec?path=" + path)
                    .success(function(data){
                        console.log("finish")
                        console.log(data)
                        $scope.$broadcast("gen-dir", path);
                        //$scope.$broadcast("reload-view");
                    })
                    .error(function(){
                        console.log("erro exec");
                    });
                console.log("gen app");
                console.log("gen dir tree");
                console.log("show frame");
            });

            $scope.reload = function(){
                 document.getElementById('frame').src += '';
            };

            $scope.runApp = function(){
                var path = "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName();
                $http
                    .get($rootScope.url + "/runApp?path=" + path)
                    .success(function(data){
                        $scope.pid = data;
                        console.log(data);
                    })
                    .error(function(){
                        console.log("erro exec");
                    });
            };

            // $scope.$on("ace-loaded", function(){
            //     var path = "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName();
            //     $http
            //         .get($rootScope.url + "/exec?path=" + path)
            //         .success(function(data){
            //             console.log(data)
            //             $scope.$broadcast("gen-dir", path);
            //             //$scope.$broadcast("reload-view");
            //         })
            //         .error(function(){
            //             console.log("erro exec");
            //         });
            //     console.log("gen app");
            //     console.log("gen dir tree");
            //     console.log("show frame");
            // });

            $scope.new = function(){
            };

            $scope.save = function(){
                $rootScope.$broadcast('save');
            };

            $scope.saveWizard = function(){
                $scope.$broadcast("save-graph");
            };
            
            $scope.loadProject = function(project){
                $http
                    .get($rootScope.url + "/mongoose_findApp?app=" + project)
                    .success(function(data){
                        kirasoFactory.setAppModel(data);
                        kirasoFactory.setAppName(data.name);
                        console.log(data)
                        $state.go("app.wizard", { new: false });
                    })
                    .error(function(){
                        console.log("error loading project");
                    });
            };

            $scope.code = function(){
                console.log("request code");
                $scope.$broadcast("create-file");
            };

            $scope.load = function(){
            };            

            $scope.download = function(){
                var path = "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName();
                $http
                    .get($rootScope.url + "/generateFolder?path=" + path)
                    .success(function(data){
                        var blob = new Blob([data], {type: "application/x-tar"});
                        saveAs(blob, kirasoFactory.getAppName() + ".tar");
                    })
                    .error(function(){
                        console.log("error");
                    });
            };

            // $scope.websocket = new WebSocket("ws://echo.websocket.org/");
            // console.log($scope.websocket)
            // $scope.websocket.onopen = function() { document.getElementById("output").innerHTML += "<p>> CONNECTED</p>"; };
            // $scope.websocket.onmessage = function(evt) { 
            //     document.getElementById("output").innerHTML += "<p style='color: blue;'>> RESPONSE: " + evt.data + "</p>"; };
            // $scope.websocket.onerror = function(evt) { 
            //     document.getElementById("output").innerHTML += "<p style='color: red;'>> ERROR: " + evt.data + "</p>"; 
            // };

            // var socket = io.connect($rootScope.url);
            // console.log(socket);
            // socket.on("news", function(data) {
            //     console.log(data);
            // });

     
            // handles the callback from the received event
            

            //testing
            $scope.team = function(){
                $http
                    //.get($rootScope.url + "/runServer")
                    .get($rootScope.url + "/dropDb")
                    .success(function(data){
                        console.log(data)
                        

                        
                        //$scope.websocket.send(data)
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
            $scope.request = [];

            $scope.sendInfoFunction = function(event, graph){
                console.log("listen send info")
                //Clear directory
               // $http
                 //   .delete("http://localhost:8000/cleanDir?path=/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName())
                  //  .success(function(){
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

                        //Config files

                        var exportfiles = [];

                        _.forEach($scope.nodes, function(item){
                            var nodeId = item.id;
                            var screen_obj = item.screenModel;
                            var title = screen_obj.name.toLowerCase();
                            var dataSource = [];
                            var dataConnector = [];

                            if(item.dataModel && item.dataModel.type != ""){
                                var nodeData = item.dataModel;
                                var nodeDataType = nodeData.type;
                                var nodeDataPath = nodeData.path;
                                if(nodeDataType == "sgb-datasource-json#1.0"){
                                    dataSource = [
                                        "\tdataSource: {",
                                        "\t\ttype: '" + nodeDataType + "',",
                                        "\t\tparams: {",
                                        "\t\t\tpath: '" + nodeDataPath + "'",
                                        "\t\t}",
                                        "\t},"
                                    ];
                                } else if(nodeDataType == "sgb-datasource-function"){
                                    $http
                                        .get($rootScope.url + "/getContent?path=" + nodeDataPath + "&type=json")
                                        .success(function(data){
                                            dataSource = [
                                                "\tdataSource: {",
                                                "\t\ttype: '" + nodeDataType + "',",
                                                "\t\tparams: {",
                                                "\t\t\tdata: function(){",
                                                "\t\t\t\treturn " + JSON.stringify(data),
                                                "\t\t\t}",
                                                "\t\t}",
                                                "\t},"
                                            ];    
                                        })
                                        .error(function(){
                                            console.log("error retreiving data");
                                        });
                                } else {
                                    dataSource = [
                                        "\tdataSource: {",
                                        "\t\ttype: '" + nodeDataType + "'",
                                        "\t},"
                                    ];
                                };
                            };

                            if(!_.isEmpty(item.dataconnectorModel)){
                                console.log("DATACONNECTOR")
                                console.log(item.dataconnectorModel)
                                var nodeData = item.dataconnectorModel;
                                dataConnector = [
                                    "\tdataConnectors: {",
                                    "\t\t" + nodeData.title + ": {",
                                    "\t\t\ttype: '" + nodeData.type + "',",
                                    "\t\t\tparams: {",
                                    "\t\t\t\tmethod: '" + nodeData.method + "',",
                                    "\t\t\t\turl: '" + nodeData.url + "'",
                                    "\t\t\t},",
                                    "\t\t}",
                                    "\t}"
                                ]
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
                                dataConnector
                            ];

                            if(screen_obj.default){
                                file.push(["\tdefault: true"]);
                            };

                            file.push("}");

                            exportfiles.push(file);
                            
                            var reqObj = {
                                path: "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName() + "_tmp",
                                filename: title + ".ts",
                                cont: JSON.stringify(_.flattenDeep(file))
                            };
                            console.log("archivo")
                            console.log(file)
                            $scope.request.push($http
                                .put($rootScope.url + "/setContent", reqObj))
                                // .success(function(data){
                                //     console.log('Save: ');
                                // })
                                // .error(function(){
                                //     console.error('Failed on save');
                                // });
                        });

                        //////////////////////////////////////////////////////////////////////////////

                        //Screen.ts

                        var imports = [];
                        var screens = [];
                        var nodeObj = [];
                        var reacheability = [];
                        
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
                            nodeObj.push({screenName: root_name, id: root});

                            reacheability = bfs(adjMatrix, root);

                            _.forEach($scope.nodes, function(item){
                                if(reacheability[item.id] && item.id != root){
                                    var screenObj = item.screenModel;
                                    var name = screenObj.name.toLowerCase();
                                    screens.push("\t'" + root_name + "." + name + "': " + name + "." + name + "Screen,");
                                    nodeObj.push({screenName: root_name + "." + name, id: item.id});    
                                }; 
                            }); 
                        });

                        var line = ['','export var screens : Megazord.ContainerScreenList = {'];
                        var end = ["}"];
                        var result = _.flattenDeep([imports,line,screens,end]);

                        var reqObj = {
                            path: "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName() + "_tmp",
                            filename: "screens.ts",
                            cont: JSON.stringify(result)
                        };
                        console.log(JSON.stringify(result));        
                        $scope.request.push($http
                            .put($rootScope.url + "/setContent", reqObj))
                            // .success(function(data){
                            //     console.log('success screens.ts');
                            //     $scope.roots = [];
                            // })
                            // .error(function(err){
                            //     console.error(err);
                            // });

                        ///////////////////////////////////////////////////////////////////////////

                        // Routes.ts
                        var routes_export_init = ["export var routes : Megazord.RouterConfig = {"]; 
                        var routes_export_end = ["};"];
                        var routes = [];

                        _.forEach(nodeObj, function(node){
                            var edges_same_src = _.filter($scope.edges, function(edge){
                                return edge.source == node.id 
                            });

                            if(edges_same_src.length != 0){
                                var node_routes = [];
                                _.forEach(edges_same_src, function(edge){
                                    if(edge.eventModel){
                                        var target_name = _.find(nodeObj, {id: edge.target}).screenName;
                                        var routes_intern = [
                                                            "\t\t" + edge.eventModel.event + ": '" +
                                                            target_name + "',"
                                                        ];
                                        node_routes.push(routes_intern);
                                    };
                                });
                                if(node_routes.length != 0){
                                    var routes_init = ["\t'" + node.screenName + "': {"]
                                    var routes_end = ["\t},"]
                                    routes.push(routes_init.concat(node_routes).concat(routes_end));
                                };
                            };
                        });
                        
                        var reqObj = {
                            path: "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName() + "_tmp",
                            filename: "routes.ts",
                            cont: JSON.stringify(_.flattenDeep([routes_export_init, routes, routes_export_end]))
                        };             
                        $scope.request.push($http
                            .put($rootScope.url + "/setContent", reqObj))
                            // .success(function(data){
                            //     console.log('success');
                            // })
                            // .error(function(err){
                            //     console.error(err);
                            // });

                    //}//)
                    //.error(function(){
                    //    console.log("error");
                    //};

                    $q.all($scope.request)
                        .then(function(){
                            console.log("ready")
                            $scope.$emit("files-ready");
                            $scope.request = [];
                            $scope.roots = [];
                        });
                ///////////////////////////////////////////////////////////////////////////
            };
            $scope.$on("send-info", $scope.sendInfoFunction);

        }
    }
})();
