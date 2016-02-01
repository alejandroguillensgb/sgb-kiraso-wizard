
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

            $scope.new = function(){
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent("create-new", true, true, 'new');
                document.documentElement.dispatchEvent(event);
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

            window.addEventListener("send-info", function(event) {
                var data = JSON.parse(event.detail);

                console.log(data);

                // var event = document.createEvent('CustomEvent');
                // event.initCustomEvent("req-models", true, true, '');
                // document.documentElement.dispatchEvent(event);
                
                console.log("Claves"+localStorageService.keys());
                var exportfiles = [];
                _.forEach(data.nodes, function(item){
                    var nodeId = item.id.toString();
                    var title = item.title.toLowerCase();

                    if(!localStorageService.get('data'+nodeId)
                        || !localStorageService.get('params'+nodeId)){
                        alert('Incomplete data or params configuration');
                        return false
                    }

                    var nodeData = localStorageService.get('data'+nodeId);
                    var nodeParams = localStorageService.get('params'+nodeId);
                    var params = [];
                    for (var key in nodeParams){
                        params.push("\t\t" + key + ": " + JSON.stringify(nodeParams[key]) + ",");
                    };
                    var nodeDataType = nodeData.type;
                    var nodeDataPath = nodeData.path;
                    var file = [
                        "export var " + title + "Screen = {",
                        "\ttype: '" + item.type + "',",
                        "\tparams: {",
                        [params],
                        "\t},",
                        "\tdataSource: {",
                        "\t\ttype: " + nodeDataType + ",",
                        "\t\tparams: {",
                        "\t\t\tpath: " + nodeDataPath,
                        "\t}",
                        "}"
                    ];
                    exportfiles.push(file);
                    console.log("file: "+_.flattenDeep(file));
                    $http
                        .get('http://localhost:8000/setContent?path=/home/alejandro/kiraso-wizard/files/'+title+'.ts&cont=' + JSON.stringify(_.flattenDeep(file)))
                        .success(function(data){
                            console.log('Save: ' + data)
                        })
                        .error(function(){
                            console.error('Failed on save')
                        });
                });
                $http
                    .get('http://localhost:8000/getFiles?path=/home/alejandro/kiraso-wizard/files')
                    .success(function(data){
                        var imports = [];
                        var screens = [];
                        _.forEach(data, function(file){
                            var name = file.slice(0, file.indexOf("."));
                            imports.push("import " + name + " = require('./"+ name +"')");
                            screens.push("\t"+"'root." + name + "': " + name + "." + name + "Screen");
                        });
                        var line = ['','export var screens : Megazord.ContainerScreenList = {'];
                        var end = ["}"];
                        var result = _.flattenDeep([imports,line,screens,end]);
                        console.log(result);
                        $http
                            .get('http://localhost:8000/setContent?path=/home/alejandro/kiraso-wizard/files/screens.ts&cont='+JSON.stringify(result))
                            .success(function(data){
                                console.log('success');
                            })
                            .error(function(err){
                                console.error(err);
                            });
                    })
                    .error(function(err){
                        console.error(err);
                    });
            }, false);

        }
    }
})();
