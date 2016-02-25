
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
                kirasoFactory.setAppName(project);
                $state.go("app.wizard", { new: false });
            };

            $scope.code = function(){
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

            window.addEventListener("send-info", function(event) {
                var data = JSON.parse(event.detail);
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
                
                //Config files

                var exportfiles = [];

                _.forEach($scope.nodes, function(item){
                    var nodeId = item.id.toString();
                    var screen_obj = localStorageService.get('screen'+nodeId);
                    var title = screen_obj.name.toLowerCase();
                    var dataSource = [];

                    if(localStorageService.get('data'+nodeId)){
                        var nodeData = localStorageService.get('data'+nodeId);
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
                    if(localStorageService.get('params'+nodeId)){
                        var nodeParams = localStorageService.get('params'+nodeId);
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
                        path: "/home/alejandro/kiraso-wizard/files/"+title+".ts",
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

                _.forEach($scope.nodes, function(item){
                    var screenObj = localStorageService.get('screen'+item.id.toString());
                    var name = screenObj.name.toLowerCase();
                    imports.push("import " + name + " = require('./"+ name +"')");
                    if($scope.roots.indexOf(item.id) >= 0 || 
                        ($scope.src.indexOf(item.id) < 0 && $scope.tgt.indexOf(item.id) < 0)){
                        screens.push("\t'" + name +"': " + name + "." + name + "Screen,");    
                    }else{
                        screens.push("\t'root." + name + "': " + name + "." + name + "Screen,");
                        nodeObj.push({screenName: name, id: item.id});                               
                    }    
                });

                var line = ['','export var screens : Megazord.ContainerScreenList = {'];
                var end = ["}"];
                var result = _.flattenDeep([imports,line,screens,end]);

                var reqObj = {
                    path: "/home/alejandro/kiraso-wizard/files/screens.ts",
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

                var routes_line = ["export var routes : Megazord.RouterConfig = {"]; 
                var routes_end = ["};"];
                var routes = [];

                _.forEach(localStorageService.keys(), function(elem){
                    if(elem.indexOf("edge") >= 0){
                        var src_tgt = elem.split("edge")[1].split("-");
                        var src = src_tgt[0];
                        var tgt = src_tgt[1];
                        _.forEach(nodeObj, function(obj){
                            if(src == obj.id.toString()){
                                var index = _.findIndex(nodeObj, function(obj){
                                    return obj.id.toString() == tgt
                                });
                                var event_name = localStorageService.get(elem).event;
                                var routes_init = ["\t'" + obj.screenName + "': {", 
                                                    "\t\t" + event_name + ": '" +
                                                    nodeObj[index].screenName + "',",
                                                    "\t},"]
                                routes.push(routes_init);
                            };
                        });
                    };
                });
                console.log(routes)

                ///////////////////////////////////////////////////////////////////////////

            }, false);

        }
    }
})();
