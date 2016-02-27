
(function() {
    'use strict';

    angular
        .module('custom.forms')
        .controller('formsController', formsController);

    formsController.$inject = ['$log','$scope', '$state', 'FormsLoader', 'localStorageService', '$http', '$rootScope', 'kirasoFactory'];

    function formsController($log,$scope,$state,FormsLoader,localStorageService, $http, $rootScope, kirasoFactory) {
        
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
                if(form.$valid){
                    var reqObj = {
                        username: form.username.$viewValue,
                        password: form.password.$viewValue
                    };
                    $http
                        .post("http://localhost:8000/loginUser", reqObj)
                        .success(function(resObj){
                            console.log('logged in');
                            $rootScope.$broadcast('login', resObj);
                            kirasoFactory.setUsername(resObj.username);
                            kirasoFactory.setProjects(resObj.projects);
                            console.log(resObj.projects)
                            $state.go('projects');
                        })
                        .error(function(err){
                            alert(err);
                        });
                };       
            };

            $scope.loginForm = [
                "username",
                {
                    key: "password",
                    type: "password"
                },
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
                
                if(form.$valid){
                    if(form.password.$viewValue == form.confirmPassword.$viewValue){
                        var reqObj = {
                            username: form.username.$viewValue,
                            password: form.password.$viewValue
                        };
                        $http
                            .post("http://localhost:8000/createUser", reqObj)
                            .success(function(data){
                                console.log('success create user');
                                $state.go('base.login');
                            })
                            .error(function(err){
                                alert(err);
                            });
                    } else{
                        alert("Password doesn't match!");
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
                "username",
                {
                    key: "password",
                    type: "password"
                },
                {
                    key: "confirmPassword",
                    type: "password"
                },
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
                    }
                },
                required: ["name"]
            };

            $scope.appForm = [
                "name",
                "backgroundImage",
                "appLogo",
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
                console.log("submit app")
                if(form.name.$viewValue != ""){
                    if(!flag_new && kirasoFactory.getAppName() != $scope.appModel.name){
                        var reqObj = {
                            username: kirasoFactory.getUsername().username,
                            old_name: kirasoFactory.getAppName(),
                            model: $scope.appModel
                        };
                        $http
                            .put("http://localhost:8000/mongoose_updateProject", reqObj)
                            .success(function(){
                                console.log("successful operation");
                            })
                            .error(function(){
                                console.log("operation failed");
                            })
                    }else{
                        $http
                            .post("http://localhost:8000/mongoose_test", $scope.appModelNew)
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
                                        .post("http://localhost:8000/mongoose_setProjects", reqObj)
                                        .success(function(){
                                            console.log("success setting projects");
                                            $state.go("app.wizard", {new: flag_new});
                                        })
                                        .error(function(err){
                                            alert(err);
                                            console.log("error setting projects");
                                        });
                                };
                            })
                            .error(function(){
                                console.log('app_mongoose_error');
                            });
                        }
                } else {
                    alert("App name is required");
                };                
            };

            // Params form
            $scope.$on("select-node", selectNodeFunction);

            function selectNodeFunction(event, node_data){
                $scope.show_event = false;
                $scope.nodeId = node_data.id;
                $scope.app_name = kirasoFactory.getAppModel().name;

                if(node_data.paramsModel)
                    $scope.paramsModel = node_data.paramsModel;
                else
                    $scope.paramsModel = {};

                FormsLoader.getFormParams(node_data.path, paramsReady);
      
                function paramsReady(data){
                    $scope.params = data;
                    $scope.versions = $scope.params.versions;
                    $scope.properties = {};
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

                    $scope.paramsForm = [                  
                        "*",
                        {
                            type: "submit",
                            style: "btn-info",
                            title: "OK"
                        }
                    ];
                };

                $scope.submitParams = function(){
                    $rootScope.$broadcast("push-paramsModel", $scope.nodeId, $scope.paramsModel);
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

                if(node_data.dataModel)
                    $scope.dataModel = node_data.dataModel;
                else
                    $scope.dataModel = {};
                $scope.submitData = function(){
                    $rootScope.$broadcast("push-dataModel", $scope.nodeId, $scope.dataModel);
                };

                ////////////////////////////////////////////////////

                $scope.screenForm =  [
                    "*",
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
                };

                ///////////////////////////////////////////////////////
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
                    "*",
                    {
                        type: "submit",
                        title: "Save"
                    }
                ];
                
                $scope.submitEvent = function(){
                    $rootScope.$broadcast("push-eventModel", $scope.edgeSrcId, $scope.edgeTgtId, $scope.eventModel);
                };
            };
        };
    };
})();
