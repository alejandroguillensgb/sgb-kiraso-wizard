
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

            // $scope.$on("load-project", function(event, app_name){
            //     console.log("entre load project")
            //     $rootScope.app_name = app_name;
            //     console.log(app_name);
            //     $http
            //         .get("http://localhost:8000/mongoose_findApp?app="+ $scope.app_name)
            //         .success(function(data){
            //             console.log('success finding app');
            //             if(data == ""){
            //                 $scope.appModel = {};
            //             } else {
            //                 $scope.appModel = data;    
            //             };
            //             console.log($scope.appModel);
            //         })
            //         .error(function(){
            //             $scope.appModel = {};
            //             console.log("error");
            //         });
            // });
            $scope.appModel = {};

            $scope.submitApp = function(form, flag_new){
                if(form.name.$viewValue != ""){
                    $http
                        .post("http://localhost:8000/mongoose_test", $scope.appModel)
                        .success(function(){
                            kirasoFactory.setAppName($scope.appModel.name);
                            console.log('app_mongoose_success');
                            if(flag_new){
                                var reqObj = {
                                    username: kirasoFactory.getUsername(),
                                    project: kirasoFactory.getAppName()
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
                } else {
                    alert("App name is required");
                };                
            };

            //// Prepare wizard

            function prepareWizard(app_name){
                $state.go("app.wizard");
                // load models
                // load graph
                $http
                    .get("http://localhost:8000/mongoose_findGraph?app="+app_name)
                    .success(function(graph){
                        console.log(graph);
                    })
                    .error(function(){
                        console.log("error retrieving graph");
                    });
            };

            //////////////////


            // Params form
            $scope.$on("select-node", selectNodeFunction);

            function selectNodeFunction(event, node_data){
                $scope.show_event = false;
                $scope.nodeId = node_data.id.toString();
                $scope.app_name = kirasoFactory.getAppName().app_name;

                $http
                    .get("http://localhost:8000/mongooseFind?app="+ $scope.app_name + "&id=" + $scope.nodeId + "&type=params")
                    .success(function(data){
                        console.log('success params find');
                        if(data == ""){
                            $scope.paramsModel = {};
                        } else {
                            $scope.paramsModel = data;    
                        };
                        console.log($scope.paramsModel)
                        FormsLoader.getFormParams(node_data.path, paramsReady);
                    })
                    .error(function(){
                        $scope.paramsModel = {};
                        console.log("error");
                    });

                
      
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
                    console.log($scope.nodeId);
                    $scope.paramsModel.elementId = $scope.nodeId;
                    var reqObj = {
                        model_type: "params",
                        model: $scope.paramsModel
                    };
                    $http
                        .post("http://localhost:8000/mongoose_setModels?app="+$scope.app_name, reqObj)
                        .success(function(){
                            console.log('params_mongoose_success')
                        })
                        .error(function(){
                            console.log('params_mongoose_error');
                        });
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

                $http
                    .get("http://localhost:8000/mongooseFind?app="+ $scope.app_name + "&id=" + $scope.nodeId + "&type=data")
                    .success(function(data){
                        console.log('success data find');
                        if(data == ""){
                            $scope.dataModel = {};
                        } else {
                            $scope.dataModel = data;    
                        };
                    })
                    .error(function(){
                        $scope.dataModel = {};
                        console.log("error");
                    });

                $scope.submitData = function(){
                    console.log($scope.nodeId);
                    $scope.dataModel.elementId = $scope.nodeId;
                    var reqObj = {
                        model_type: "data",
                        model: $scope.dataModel
                    };
                    console.log($scope.dataModel);
                    $http
                        .post("http://localhost:8000/mongoose_setModels?app="+$scope.app_name, reqObj)
                        .success(function(){
                            console.log('data_mongoose_success')
                        })
                        .error(function(){
                            console.log('data_mongoose_error');
                        });
                };

                ////////////////////////////////////////////////////
                
                
                $scope.screenForm =  [
                    "*",
                    {
                        type: "submit",
                        title: "Save"
                    }
                ];

                $http
                    .get("http://localhost:8000/mongooseFind?app="+ $scope.app_name + "&id=" + $scope.nodeId + "&type=screen")
                    .success(function(data){
                        console.log('success screen find');
                        if(data == ""){
                            $scope.screenModel = {};
                        } else {
                            $scope.screenModel = data;    
                        };
                    })
                    .error(function(){
                        $scope.screenModel = {};
                        console.log("error");
                    });
                
                $scope.submitScreen = function(){
                    console.log($scope.nodeId);
                    console.log($scope.screenModel);
                    $scope.screenModel.elementId = $scope.nodeId;
                    console.log($scope.screenModel);
                    var reqObj = {
                        model_type: "screen",
                        model: $scope.screenModel
                    };
                    $http
                        .post("http://localhost:8000/mongoose_setModels?app="+$scope.app_name, reqObj)
                        .success(function(){
                            console.log('screen_mongoose_success')
                        })
                        .error(function(){
                            console.log('screen_mongoose_error');
                        });
                };

                ///////////////////////////////////////////////////////
            };


            $scope.show_event = false;
            
            $scope.$on("select-edge", selectEdgeFunction);
            // window.addEventListener("select-edge", function(event){
            function selectEdgeFunction(event, edge_data){
                $scope.show_event = true;
                $scope.$apply();
                $scope.edge = edge_data;
                $scope.edgeSrcId = $scope.edge.source.id.toString();
                $scope.edgeTgtId = $scope.edge.target.id.toString();

                $http
                    .get("http://localhost:8000/mongooseFind?app="+ $scope.app_name + "&id=" + $scope.edgeSrcId + "-" + $scope.edgeTgtId + "&type=event")
                    .success(function(data){
                        console.log('success event find');
                        if(data == ""){
                            $scope.eventModel = {};
                        } else {
                            $scope.eventModel = data;
                        };
                    })
                    .error(function(){
                        $scope.eventModel = {};
                       // $scope.$apply();
                        console.log("error");
                    });

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
                    console.log('event submmited');
                    $scope.eventModel.elementId = $scope.edgeSrcId + "-" +$scope.edgeTgtId;
                    var reqObj = {
                        model_type: "event",
                        model: $scope.eventModel
                    };
                    $http
                        .post("http://localhost:8000/mongoose_setModels?app="+$scope.app_name, reqObj)
                        .success(function(){
                            console.log('screen_mongoose_success')
                        })
                        .error(function(){
                            console.log('screen_mongoose_error');
                        });
                };
            };

            // $scope.$on("delete-node", deleteNodeFunction);
            // $scope.$on("delete-edge", deleteEdgeFunction);

            function deleteNodeFunction(){
                $http
                    .delete("http://localhost:8000/mongoose_removeNode?app=" + $scope.app_name + "&id=" + $scope.nodeId)
                    .success(function(){
                        console.log("delete success")
                    })
                    .error(function(){
                        console.log("delete error")
                    });
            };
            function deleteEdgeFunction(){
                $http
                    .delete("http://localhost:8000/mongoose_removeEdge?app=" + $scope.app_name + "&id=" + $scope.edgeSrcId + edgeTgtId)
                    .success(function(){
                        console.log("delete success")
                    })
                    .error(function(){
                        console.log("delete error")
                    });
            };
        };
    };
})();
