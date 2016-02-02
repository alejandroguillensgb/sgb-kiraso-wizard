
(function() {
    'use strict';

    angular
        .module('custom.forms')
        .controller('formsController', formsController);

    formsController.$inject = ['$log','$scope', '$state', 'FormsLoader', 'localStorageService'];

    function formsController($log,$scope,$state,FormsLoader,localStorageService) {
        
        activate();
        
        ////////////////

        function activate() {
            
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
                if (form.$valid) $state.go('app.wizard')        
            }

            $scope.loginForm = [
                "*",
                {
                    type: "submit",
                    title: "Login"
                },
                {
                    type: "section",
                    htmlClass: "row",
                    items: [
                        {
                            type: "button",
                            htmlClass: "col-md-6",
                            style: "btn-info",
                            title: "Forgot password?"
                        },
                        {
                            type: "button",
                            htmlClass: "col-md-4",
                            title: "Sing Up",
                            onClick: "goTo('base.signup')"
                        }
                    ]
                }
            ];

            $scope.loginModel = {};

            $scope.goTo = function(path){
                $state.go(path)
            }

            // Sign Up

            $scope.onSubmitSignup = function(form){
                $scope.$broadcast('schemaFormValidate');
                if (form.$valid) $state.go('base.login')              
            }

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
                "*",
                {
                    type: "submit",
                    title: "Sign Up"
                },
                {
                    type: "section",
                    htmlClass: "row",
                    items: [
                        {
                            type: "button",
                            htmlClass: "col-md-6",
                            style: "btn-info",
                            title: "Already have an account?",
                            onClick: "goTo('base.login')"
                        }
                    ]
                }
            ];

            $scope.signupModel = {};

            // App options form

            $scope.screens = [];
            $scope.appSchema = {
                type: "object",
                properties: {
                    name: { 
                        type: "string", 
                        minLength: 1, 
                        title: "App name" 
                    },
                    backgroundImage: {
                        title: "Background Image",
                        type: "string"
                    },
                    appLogo: {
                        title: "App logo",
                        type: "string"
                    },
                    directory: {
                        title: "Directory Url",
                        type: "string",
                        description: "Workspace directory"
                    }
                },
                required: ["name"]
            };

            window.addEventListener("node-added", function(event) {
                var node = event.detail;
                $scope.screens.push(node.title);
                console.log($scope.screens);
            }, false);

            $scope.appForm = [
                "name",
                "backgroundImage",
                "appLogo",
                "directory",
                {
                    type: "submit",
                    title: "Save"
                }
            ];

            $scope.appModel = {};

            $scope.submitApp = function(){
                console.log($scope.appModel);
                localStorageService.set('app'+$scope.nodeId, $scope.paramsModel);
            }

            // Params form

            window.addEventListener("select-node", function(event) {
                $scope.nodeId = event.detail.id.toString();
                //localStorageService.clearAll();

                if(localStorageService.keys().indexOf('params'+$scope.nodeId) != -1)
                    $scope.paramsModel = localStorageService.get('params'+$scope.nodeId);
                else
                    $scope.paramsModel = {}

                FormsLoader.getFormParams(event.detail.path, paramsReady)
                
                function paramsReady(data){                  
                    $scope.params = data;
                    $scope.properties = {};

                    _.forEach($scope.params.params, function(value,key){
                        if ('options' in value){
                            $scope.properties[value.name] = {
                                title: value.title,
                                type: value.type,
                                description: value.description,
                                enum: value.options.concat("")
                            }
                        }
                        else if('elements' in value){
                            $scope.properties = {
                                array: {
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
                    }
                };
              
                $scope.paramsForm = [                  
                    "*",
                    {
                        type: "submit",
                        style: "btn-info",
                        title: "OK"
                    }
                ];

                $scope.submitParams = function(){
                    console.log($scope.paramsModel);
                    localStorageService.set('params'+$scope.nodeId, $scope.paramsModel);
                }

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
                                value: "sgb-datasource-json",
                                name: "JSON"
                            },
                            {
                                value: "sgb-datasource-param",
                                name: "Param"
                            }
                        ]
                    },
                    {
                        key: "path",
                        type: "string"
                    },
                    {
                        type: "submit",
                        title: "Save"
                    }
                ];

                if(localStorageService.keys().indexOf('data'+$scope.nodeId) != -1)
                    $scope.dataModel = localStorageService.get('data'+$scope.nodeId);
                else
                    $scope.dataModel = {}

                $scope.submitData = function(){
                    console.log($scope.dataModel);
                    localStorageService.set('data'+$scope.nodeId, $scope.dataModel);
                };

                ////////////////////

            }, false);
       

            window.addEventListener("delete-node", function(event){
                if(localStorageService.keys().indexOf('params'+$scope.nodeId) >= 0){
                    localStorageService.remove('params'+$scope.nodeId);
                };
                if(localStorageService.keys().indexOf('data'+$scope.nodeId) >= 0){
                    localStorageService.remove('data'+$scope.nodeId);
                };
            }, false);

            // Data form


        }
    }
})();
