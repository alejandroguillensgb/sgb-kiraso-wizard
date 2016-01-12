
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
            
            $scope.loginSchema = {
                type: "object",
                properties: {
                  username: { type: "string", minLength: 4, title: "Username", description: "Username or alias" },
                  password: { type: "string", minLength:6, title: "Password"}
                },
                required: ["username", "password"]
              };

              $scope.onSubmitLogin = function(form){
                $scope.$broadcast('schemaFormValidate');
                if (form.$valid){
                  $state.go('app.wizard')  
                }                
              }

              $scope.loginForm = [
                "*",
                {
                      type: "submit",
                      title: "Login"
                },
                {
                  "type": "section",
                  "htmlClass": "row",
                  "items": [
                    {
                      type: "button",
                      "htmlClass": "col-md-6",
                      style: "btn-info",
                      title: "Forgot password?"
                    },
                    {
                      type: "button",
                      "htmlClass": "col-md-4",
                      title: "Sing Up",
                      onClick: "goTo('base.signup')"
                    }
              ]}];

              $scope.loginModel = {};

              $scope.goTo = function(path){
                localStorageService.set("hola", {name: "test"})
                console.log(localStorageService.get("hola"))
                console.log(localStorageService.keys())
                localStorageService.remove("hola")
                localStorageService.clearAll()
                $state.go(path)
              }

              $scope.onSubmitSignup = function(form){
                $scope.$broadcast('schemaFormValidate');
                if (form.$valid){
                  $state.go('base.login')
                }                
              }

              $scope.signupSchema = {
                type: "object",
                properties: {
                  username: { type: "string", minLength: 4, title: "Username", description: "Username or alias" },
                  password: { type: "string", minLength:6, title: "Password"},
                  confirmPassword: { type: "string", minLength:6, title: "Confirm password"}
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
                  "type": "section",
                  "htmlClass": "row",
                  "items": [
                    {
                      type: "button",
                      "htmlClass": "col-md-6",
                      style: "btn-info",
                      title: "Already have an account?",
                      onClick: "goTo('base.login')"
                    }
              ]}];

              $scope.signupModel = {};

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
                  // backgroundImage: { 
                  //   title: 'Content',
                  //   type: 'object',
                  //   format: 'file_upload'
                  // }
                },
                required: ["name"]
              };

  // $scope.appModel = { backgroundImage: { file: { placeholder: 'somephoto.jpg' }} };
  // $scope.success = function($flow, $file, message){
  //   $scope.appModel.backgroundImage = message.id;
  //   console.log($scope.appModel);
  // }
  // $scope.uploadStarted = function() {
  //   console.log('started');
  // }
  // $scope.changeSource = function() {
  //   $scope.appModel.backgroundImage.file.placeholder = 'data:image/jpeg;base64,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'
  // }


              $scope.appForm = [
                "name",
                "backgroundImage",
                {
                  type: "button",
                  title: "add"
                }, 
                "appLogo", 
                "defaultScreen"
                //"*",
                // {
                //   key: "backgroundImage",
                //   type: "button",
                //   onClick: ""
                //  }//,
                // {
                //   type: "submit",
                //   title: "Submit"
                // }

     //            {
     //   key: 'backgroundImage',
     //   uploadOptions: {
     //     backdrop: true,
     //     modal: {
     //       uploadStarted: $scope.uploadStarted,
     //       flow: {
     //         imageOnly: true,
     //         dropEnabled: true,
     //         fileSuccess: 'success'
     //       }
     //     }
     //   }
     // }
              ];

              $scope.appModel = {};

              window.addEventListener("select-node", function(event) {
                FormsLoader.getFormParams(event.detail.path, paramsReady)

                function paramsReady(data){
                $scope.params = data;
                
                $scope.properties = {};

                _.forEach($scope.params.params, function(value,key){
                  if ('options' in value){
                    $scope.properties[value.name] = {
                      "title": value.title,
                      "type": value.type,
                      "description": value.description,
                      "enum": value.options
                    }
                  }
                  else if('elements' in value){
                    $scope.properties = {
                      "Menu": {
                        "title": value.title,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "title": {
                              "title": value.elements[0],
                              "type": "string"
                            },
                            "screen": {
                              "title": value.elements[1],
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                  else{
                    $scope.properties[value.name] = {
                      "title": value.title,
                      "type": value.type,
                      "description": value.description
                    }
                  }
                })

                $scope.paramsSchema ={
                  "type": "object",
                  "properties": $scope.properties  
                }
              }

              
                $scope.paramsForm = [
                  
                  "*",
                  {
                    "type": "submit",
                    "style": "btn-info",
                    "title": "OK"
                  }
                ]
              

              $scope.paramsModel = {};
              }, false);
              

              









              $scope.dataSchema = {
                type: "object",
                properties: {
                  "select": {
                    "title": "Select type of data source",
                    "type": "string",
                    "enum": [
                      "JSON",
                      "Params"
                    ]
                  },
                  "archivo": {
                    "title": 'Archivo',
                    "type": 'string',
                    "format": 'file',
                    "description": 'This is a upload element'
                  }
                }
              };

              $scope.dataForm = [
                "select",
                {
                  "key": "archivo",
                  "type": "fileUpload",
                  "options": {
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
