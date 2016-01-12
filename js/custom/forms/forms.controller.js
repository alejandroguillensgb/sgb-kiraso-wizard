
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
                    defaultScreen: {
                        title: "Default screen",
                        type: "string",
                        enum: ["screen1", "screen2"]
                    }
                },
                required: ["name"]
            };

            $scope.appForm = [
                "name",
                "backgroundImage",
                {
                    type: "button",
                    title: "add"
                }, 
                "appLogo", 
                "defaultScreen"    
            ];

            $scope.appModel = {};

            // Params form

            window.addEventListener("select-node", function(event) {
                $scope.nodeId = event.detail.id.toString();
                //localStorageService.clearAll()

                if(localStorageService.keys().indexOf($scope.nodeId) != -1)
                    $scope.paramsModel = localStorageService.get($scope.nodeId);
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
                                enum: value.options
                            }
                        }
                        else if('elements' in value){
                            $scope.properties = {
                                "Menu": {
                                    title: value.title,
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
                    localStorageService.set($scope.nodeId, $scope.paramsModel)
                }
            }, false);

            window.addEventListener("delete-node", function(event){
                if(localStorageService.keys().indexOf($scope.nodeId) != -1)
                    localStorageService.remove($scope.nodeId)
            }, false);

            // Data form

            $scope.dataSchema = {
                type: "object",
                properties: {
                    select: {
                        title: "Select type of data source",
                        type: "string",
                        enum: [
                            "JSON",
                            "Params"
                        ]   
                    },
                    archivo: {
                        title: 'Archivo',
                        type: 'string',
                        format: 'file',
                        description: 'This is a upload element'
                    }
                }
            };

            $scope.dataForm = [
                "select",
                {
                    key: "archivo",
                    type: "fileUpload",
                    options: {
                        onReadFn: "showContent"
                    }
                },
                {
                    type: "submit",
                    title: "Save"
                }
            ];

            $scope.dataModel = {};
        }
    }
})();
