
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('kiraso')
        .controller('Controller', Controller);

    Controller.$inject = ['$log', '$scope', '$rootScope', '$http', 'localStorageService'];
    function Controller($log, $scope, $rootScope, $http, localStorageService) {

        activate();
        
        ////////////////

        function activate() {

            $scope.preview = function(){
                console.log("Preview function");
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

            $scope.code = function(){
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent("create-file", true, true, '');
                document.documentElement.dispatchEvent(event);
            };

            $scope.load = function(){
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent("load-file", true, true, '');
                document.documentElement.dispatchEvent(event);
            };            

            $scope.download = function(){
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent("download-file", true, true, '');
                document.documentElement.dispatchEvent(event);
            };            

            $scope.nodes = [];
            $scope.edges = [];
            $scope.roots = [];

            window.addEventListener("send-info", function(event) {
                var data = JSON.parse(event.detail);
                $scope.nodes = data.nodes;
                $scope.edges = data.edges;
                
                var src = [];
                var tgt = [];

                _.forEach($scope.edges, function(elem){
                    src.push(elem.source);
                    tgt.push(elem.target);
                });
                
                _.forEach(_.uniq(src), function(elem){
                    if(_.uniq(tgt).indexOf(elem) == -1)
                        $scope.roots.push(elem);
                });
                
                var exportfiles = [];

                _.forEach($scope.nodes, function(item){
                    var nodeId = item.id.toString();
                    var title = item.title.toLowerCase();

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
                        
                    $http
                        .get('http://localhost:8000/setContent?path=/home/alejandro/kiraso-wizard/files/'+title+'.ts&cont=' + JSON.stringify(_.flattenDeep(file)))
                        .success(function(data){
                            console.log('Save: ' + data)
                        })
                        .error(function(){
                            console.error('Failed on save')
                        });
                });

                var imports = [];
                var screens = [];
                _.forEach($scope.nodes, function(item){
                    var name = item.title.toLowerCase();
                    imports.push("import " + name + " = require('./"+ name +"')");
                    if($scope.roots.indexOf(item.id) >= 0){
                        screens.push("\t"+"'root': " + name + "." + name + "Screen,");    
                    }else{
                        screens.push("\t"+"'root." + name + "': " + name + "." + name + "Screen,");
                    }    
                });

                var line = ['','export var screens : Megazord.ContainerScreenList = {'];
                var end = ["}"];
                var result = _.flattenDeep([imports,line,screens,end]);
                $http
                    .get('http://localhost:8000/setContent?path=/home/alejandro/kiraso-wizard/files/screens.ts&cont='+JSON.stringify(result))
                    .success(function(data){
                        console.log('success');
                    })
                    .error(function(err){
                        console.error(err);
                    });
            }, false);

        }
    }
})();
