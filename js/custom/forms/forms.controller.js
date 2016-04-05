(function() {
    'use strict';

    angular
        .module('custom.forms')
        .controller('formsController', formsController);

    formsController.$inject = ['$scope', '$state', 'FormsLoader', '$http', '$rootScope', 'kirasoFactory', 'API', '$uibModal'];

    function formsController($scope, $state, FormsLoader, $http, $rootScope, kirasoFactory, API, $uibModal) {
        
        activate();
        
        ////////////////

        function activate() {

            // Upload resources function
            $scope.uploadResources = function(resourcesFile) {
                API.uploadResources(resourcesFile)
                    .success(function (uploadResponse) {
                        console.log(uploadResponse);
                        var path = "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName();
                        $rootScope.$broadcast("gen-dir", path);
                        $rootScope.$broadcast("close-modal");
                    }).error(function (error) {
                        $scope.modalInstance = $uibModal.open({
                            animation: true,
                            template: '<p> Error uploading file </p>',
                            size: "sm"
                        });
                        $rootScope.$broadcast("close-modal");
                    });
            };

            // Log In

            $scope.loginSchema = {
                type: "object",
                properties: {
                    username: { 
                        type: "string", 
                        minLength: 4, 
                        title: "Username", 
                        description: "Username or alias"
                    },
                    password: { 
                        type: "string", 
                        minLength:6, 
                        title: "Password"
                    }
                },
                required: ["username", "password"]
            };

            $scope.onSubmitLogin = function(form){
                $scope.$broadcast('schemaFormValidate');
                if(form.$valid){
                    var reqObj = {
                        username: form.username.$viewValue,
                        password: form.password.$viewValue
                    };
                    $http
                        .post($rootScope.url + "/loginUser", reqObj)
                        .success(function(resObj){
                            console.log('logged in');
                            $rootScope.$broadcast('login', resObj);
                            kirasoFactory.setUsername(resObj.username);
                            kirasoFactory.setProjects(resObj.projects);
                            console.log(resObj.projects)
                            $rootScope.isAuthenticated = true;
                            $state.go('projects');
                        })
                        .error(function(error){
                            $scope.modalInstance = $uibModal.open({
                                animation: true,
                                template: '<p>' + error + '</p>',
                                size: "sm"
                            });
                        });
                };       
            };

            $scope.loginForm = [
                {
                    key: "username",
                    feedback:false   
                },
                {
                    key: "password",
                    type: "password",
                    feedback:false
                },
                {
                    type: "submit",
                    style: "btn-success",
                    fieldHtmlClass: "width",
                    title: "Login"
                },
                {
                    type: "button",
                    style: "width black",
                    title: "Sign Up",
                    onClick: "goTo('base.signup')"
                }
            ];

            $scope.loginModel = {};

            $scope.goTo = function(path){
                $state.go(path)
            }

            // Sign Up

            $scope.onSubmitSignup = function(form){
                $scope.$broadcast('schemaFormValidate');
                
                if(form.$valid){
                    if(form.password.$viewValue == form.confirmPassword.$viewValue){
                        var reqObj = {
                            username: form.username.$viewValue,
                            password: form.password.$viewValue
                        };
                        $http
                            .post($rootScope.url + "/createUser", reqObj)
                            .success(function(data){
                                console.log('success create user');
                                $state.go('base.login');
                            })
                            .error(function(err){
                                $scope.modalInstance = $uibModal.open({
                                    animation: true,
                                    template: '<p>' + err + '</p>',
                                    size: "sm"
                                });
                            });
                    } else{
                        $scope.modalInstance = $uibModal.open({
                            animation: true,
                            template: "<p> Password doesn't match! </p>",
                            size: "sm"
                        });
                    };    
                };              
            };

            $scope.signupSchema = {
                type: "object",
                properties: {
                    username: { 
                        type: "string", 
                        minLength: 4, 
                        title: "Username", 
                        description: "Username or alias" 
                    },
                    password: { 
                        type: "string", 
                        minLength:6, 
                        title: "Password"
                    },
                    confirmPassword: { 
                        type: "string",
                        minLength:6, 
                        title: "Confirm password"
                    }
                },
                required: ["username", "password", "confirmPassword"]
            };
              
            $scope.signupForm = [
                {
                    key: "username",
                    feedback: false 
                },
                {
                    key: "password",
                    type: "password",
                    feedback: false
                },
                {
                    key: "confirmPassword",
                    type: "password",
                    feedback: false
                },
                {
                    type: "submit",
                    fieldHtmlClass: "width",
                    style: "btn-success",
                    title: "Sign Up"
                },
                {
                    type: "button",
                    style: "width black",
                    title: "Already have an account?",
                    onClick: "goTo('base.login')"
                }
            ];

            $scope.signupModel = {};


            ////////////////////////////////////////

            //Add component
            $scope.addCompSchema = {
                type: "object",
                properties: {
                    name: {
                        title: "Component name",
                        type: "string"
                    },
                    type: {
                        title: "Component type",
                        type: "string",
                        description: "Must be '@' plus repository name, Ex: @sgb-screen-calendar"
                    },
                    path: {
                        title: "Github repo url",
                        type: "string",
                        description: "(https url)"
                    }
                },
                required: ["name", "type", "path"]
            };
              
            $scope.addCompForm = [
                {
                    key: "name",
                    feedback: false

                },
                {
                    key: "type",
                    feedback: false
                },
                {
                    key: "path",
                    feedback: false
                },
                {
                    type: "submit",
                    title: "Save"
                }
            ];

            $scope.addCompModel = {};

            $scope.submitAddComp = function(form){
                $scope.$broadcast('schemaFormValidate');
                
                if(form.$valid){    
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        template: "<p> Clonning repository </p>",
                        size: "sm"
                    });
                    $scope.addCompModel.own = true;
                    var reqObj = {
                        path: "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/screens/" + _.tail($scope.addCompModel.type).join(""),
                        repo: $scope.addCompModel.path
                    };
                    $http
                        .post($rootScope.url + "/cloneRepo", reqObj)
                        .success(function(){
                            $scope.modalInstance.close();
                            var reqObj = {
                                path: "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username,
                                filename: "inventario_componentes_propios.json",
                                cont: JSON.stringify($scope.addCompModel)
                            };
                            $http
                                .put($rootScope.url + "/setInventario", reqObj)
                                .success(function(){
                                    console.log("file added");
                                    $rootScope.$broadcast("new-component");
                                })
                                .error(function(){
                                    console.log("error setting file")
                                });
                        })
                        .error(function(){
                            $scope.modalInstance.close();
                            $scope.modalInstance = $uibModal.open({
                                animation: true,
                                template: "<p> Errror clonning your repo </p>",
                                size: "sm"
                            });
                        })
                    
                };
            };

            ////////////////////////////////////////

            // App options form

            $scope.screens = [];
            $scope.appSchema = {
                type: "object",
                properties: {
                    name: { 
                        type: "string", 
                        minLength: 1, 
                        title: "App name" 
                    }
                },
                required: ["name"]
            };

            $scope.appForm = [
                {
                    key: "name",
                    feedback: false
                },
                {
                    type: "submit",
                    title: "Save"
                }
            ];

            $scope.appModelNew = {};

            if(kirasoFactory.getAppModel().appModel.name)
                $scope.appModel = kirasoFactory.getAppModel().appModel;
            else
                $scope.appModel = {};


            $scope.submitApp = function(form, flag_new){
                $scope.$broadcast('schemaFormValidate');
                console.log("submit app")
                if(form.name.$viewValue != ""){
                    if(!flag_new && kirasoFactory.getAppName() != $scope.appModel.name){
                        var reqObj = {
                            username: kirasoFactory.getUsername().username,
                            old_name: kirasoFactory.getAppName(),
                            model: $scope.appModel
                        };
                        $http
                            .put($rootScope.url + "/mongoose_updateProject", reqObj)
                            .success(function(){
                                var old_name = kirasoFactory.getAppName();
                                kirasoFactory.setAppName($scope.appModel.name);
                                var projects = kirasoFactory.getProjects().projects;
                                var index = projects.indexOf(old_name);
                                projects.splice(index, 1, $scope.appModel.name);
                                kirasoFactory.setProjects(projects);
                                $scope.modalInstance = $uibModal.open({
                                    animation: true,
                                    template: "<p> App updated </p>",
                                    size: "sm"
                                });
                            })
                            .error(function(){
                                $scope.modalInstance = $uibModal.open({
                                    animation: true,
                                    template: "<p> App update failed </p>",
                                    size: "sm"
                                });
                            })
                    }else if(!flag_new && kirasoFactory.getAppName() == $scope.appModel.name){
                        $scope.modalInstance = $uibModal.open({
                            animation: true,
                            template: "<p> App updated </p>",
                            size: "sm"
                        });
                    }else{
                        $http
                            .post($rootScope.url + "/mongoose_createProject", $scope.appModelNew)
                            .success(function(){
                                kirasoFactory.setAppModel($scope.appModelNew);
                                kirasoFactory.setAppName($scope.appModelNew.name);
                                console.log('app_mongoose_success');
                                if(flag_new){
                                    var reqObj = {
                                        username: kirasoFactory.getUsername().username,
                                        project: kirasoFactory.getAppModel().appModel.name
                                    };
                                    $http
                                        .post($rootScope.url + "/mongoose_setProjects", reqObj)
                                        .success(function(){
                                            var projects = kirasoFactory.getProjects().projects;
                                            projects.push($scope.appModelNew.name);
                                            kirasoFactory.setProjects(projects);
                                            console.log("success setting projects");
                                            $state.go("app.wizard", {new: flag_new});
                                        })
                                        .error(function(err){
                                            $scope.modalInstance = $uibModal.open({
                                                animation: true,
                                                template: "<p> Error setting projects </p>",
                                                size: "sm"
                                            });
                                        });
                                };
                            })
                            .error(function(err){
                                if(err == "Bad request"){
                                    $scope.modalInstance = $uibModal.open({
                                        animation: true,
                                        template: "<p> Application already exists</p>",
                                        size: "sm"
                                    });
                                } else {
                                    $scope.modalInstance = $uibModal.open({
                                        animation: true,
                                        template: "<p> Service error </p>",
                                        size: "sm"
                                    });
                                }
                                
                            });
                        }
                } else {
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        template: "<p> App name is required </p>",
                        size: "sm"
                    });
                };                
            };

            // Dynamic forms
            $scope.$on("select-node", selectNodeFunction);

            function selectNodeFunction(event, node_data){
                console.log(node_data);
                $scope.show_event = false;
                $scope.nodeId = node_data.id;
                $scope.app_name = kirasoFactory.getAppModel().name;

                if(!_.isEmpty(node_data.paramsModel)){
                    $scope.paramsModel = node_data.paramsModel;
                }else{
                    $scope.paramsModel = {};
                }

                if(node_data.type[0] == "@"){
                    var path = "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName() + "/screens"
                    var name = _.tail(node_data.type).join("");
                    FormsLoader.getFormParams(path +"/"+name, checkParams);
                } else {
                    FormsLoader.getFormParams(node_data.path, paramsReady);    
                }

                function checkParams(data){
                    if(data.length>0){
                        paramsReady(data);
                    } else{
                        var path = "/home/alejandro/kiraso-wizard/service_data/"+ kirasoFactory.getUsername().username + "/screens"
                        var name = _.tail(node_data.type).join("");
                        FormsLoader.getFormParams(path +"/"+name, paramsReady);
                    };
                };         
      
                function paramsReady(data){

                    $scope.show = true;
                    $scope.params = data;
                    $scope.properties = {};
                    if($scope.params.params){
                        $scope.show = true
                        console.log("params")
                        _.forEach($scope.params.params, function(value,key){
                            if ('options' in value){
                                $scope.properties[value.name] = {
                                    title: value.title,
                                    type: value.type,
                                    description: value.description,
                                    enum: value.options.concat("")
                                };
                            } else if('elements' in value){
                                $scope.properties = {
                                    menu: {
                                        title: "Menu",
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                "title": {
                                                    title: value.elements[0],
                                                    type: "string"
                                                },
                                                "screen": {
                                                    title: value.elements[1],
                                                    type: "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            }else{
                                $scope.properties[value.name] = {
                                    title: value.title,
                                    type: value.type,
                                    description: value.description
                                }
                            }
                        });
                        $scope.paramsSchema ={
                            type: "object",
                            properties: $scope.properties  
                        };

                        $scope.paramsForm = [                  
                            "*",
                            {
                                type: "submit",
                                title: "Save"
                            },
                            {
                                feedback: false
                            }
                            
                        ];
                    } else {
                        $scope.show = false;
                    };

                    $scope.screenSchema = {
                        type: "object",
                        properties: {
                            name: {
                                title: "Screen name",
                                type: "string"
                            },
                            default: {
                                title: "Default screen",
                                type: "boolean"
                            }
                        },
                        required: ["name"]
                    };

                    
                };

                $scope.submitParams = function(){
                    $rootScope.$broadcast("push-paramsModel", $scope.nodeId, $scope.paramsModel);
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        template: "<p> Params added </p>",
                        size: "sm"
                    });
                };

                //////////////////

                $scope.dataSchema = {
                    type: "object",
                    properties: {
                        type: {
                            title: "Select type of data source",
                            type: "string"
                        },
                        path: {
                            title: "Path",
                            type: 'string'
                        }
                    }
                };

                $scope.dataForm = [
                    {
                        key: "type",
                        type: "select",
                        titleMap: [
                            {
                                value: "sgb-datasource-json#1.0",
                                name: "JSON"
                            },
                            {
                                value: "sgb-datasource-function",
                                name: "Function"
                            },
                            {
                                value: "sgb-datasource-param",
                                name: "Param"
                            },
                            {
                                value: "",
                                name: "None"
                            }
                        ],
                        feedback: false
                    },
                    {
                        type: "conditional",
                        condition: "dataModel.type == 'sgb-datasource-json#1.0' || dataModel.type == 'sgb-datasource-function'",
                        items: [
                            {
                                key: "path",
                                type: "string",
                                feedback: false
                            }
                        ]
                    },
                    {
                        type: "submit",
                        title: "Save"
                    }
                ];

                if(node_data.dataModel)
                    $scope.dataModel = node_data.dataModel;
                else
                    $scope.dataModel = {};

                $scope.submitData = function(){
                    $rootScope.$broadcast("push-dataModel", $scope.nodeId, $scope.dataModel);
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        template: "<p> Data added </p>",
                        size: "sm"
                    });
                };

                ////////////////////////////////////////////////////

                $scope.screenForm =  [
                    {
                        key: "name",
                        feedback: false
                    },
                    {
                        key: "default",
                        feedback: false
                    },
                    {
                        type: "submit",
                        title: "Save"
                    }
                ];

                if(node_data.screenModel)
                    $scope.screenModel = node_data.screenModel;
                else
                    $scope.screenModel = {};
                
                $scope.submitScreen = function(){
                    $rootScope.$broadcast("push-screenModel", $scope.nodeId, $scope.screenModel);
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        template: "<p> Screen added </p>",
                        size: "sm"
                    });
                };

                ///////////////////////////////////////////////////////

                $scope.dataconnectorModel = node_data.dataconnectorModel;

                $scope.dataconnectorSchema = {
                    type: "object",
                    properties: {
                        title: {
                            title: "Event name",
                            type: "string"
                        },
                        type: {
                            title: "Select type of data connector",
                            type: "string"
                        },
                        url: {
                            title: "Url",
                            type: 'string'
                        },
                        method: {
                            title: "Method http",
                            type: "string"
                        }
                    }
                };

                $scope.dataconnectorForm = [
                    {
                        key: "title",
                        feedback: false
                    },
                    {
                        key: "type",
                        type: "select",
                        feedback: false,
                        titleMap: [
                            {
                                value: "sgb-dataconnector-http",
                                name: "http"
                            },
                            {
                                value: "",
                                name: "None"
                            }
                        ]
                    },
                    {
                        key: "url",
                        feedback: false
                    },
                    {
                        key: "method",
                        type: "select",
                        feedback: false,
                        titleMap: [
                            {
                                value: "GET",
                                name: "get"
                            },
                            {
                                value: "POST",
                                name: "post"
                            },
                            {
                                value: "PUT",
                                name: "put"
                            },
                            {
                                value: "DELETE",
                                name: "delete"
                            },
                            {
                                value: "",
                                name: "None"
                            }
                        ]
                    },
                    {
                        type: "submit",
                        title: "Save"
                    }
                ];

                $scope.submitDataconnector = function(){
                    $rootScope.$broadcast("push-dataconnectorModel", $scope.nodeId, $scope.dataconnectorModel);
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        template: "<p> Dataconnector added </p>",
                        size: "sm"
                    });
                };
            };


            $scope.show_event = false;
            
            $scope.$on("select-edge", selectEdgeFunction);
            function selectEdgeFunction(event, edge_data){
                $scope.show_event = true;
                $scope.$apply();
                $scope.edge = edge_data;
                $scope.edgeSrcId = $scope.edge.source.id;
                $scope.edgeTgtId = $scope.edge.target.id;

                if(edge_data.eventModel){
                    $scope.eventModel = edge_data.eventModel;
                    $scope.$apply();
                } else {
                    $scope.eventModel = {};
                    $scope.$apply();
                };

                $scope.eventSchema = {
                    type: "object",
                    properties: {
                        event: {
                            title: "Event name",
                            type: "string"
                        }
                    }
                };

                $scope.eventForm = [
                    {
                        key: "event",
                        feedback: false
                    },
                    {
                        type: "submit",
                        title: "Save"
                    }
                ];
                
                $scope.submitEvent = function(){
                    $rootScope.$broadcast("push-eventModel", $scope.edgeSrcId, $scope.edgeTgtId, $scope.eventModel);
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        template: "<p> Event added </p>",
                        size: "sm"
                    });
                };
            };
        };
    };
})();
