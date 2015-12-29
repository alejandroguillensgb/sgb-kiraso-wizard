
(function() {
    'use strict';

    angular
        .module('custom.forms')
        .controller('formsController', formsController);

    formsController.$inject = ['$log','$scope', '$state', 'FormsLoader'];
    function formsController($log,$scope,$state,FormsLoader) {

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
                      style: "btn-info",
                      title: "Sing Up",
                      onClick: ""
                    }
              ]}];

              $scope.loginModel = {};








            $scope.appSchema = {
                type: "object",
                properties: {
                  name: { type: "string", minLength: 1, title: "Name", description: "Name or alias" }
                },
                required: ["name"]
              };

              $scope.appForm = [
                "*",
                {
                  type: "submit",
                  title: "Save"
                }
              ];

              $scope.appModel = {};

              FormsLoader.getFormParams(paramsReady)

              function paramsReady(data){
                $scope.params = data;
                
                $scope.properties = {}

                _.forEach($scope.params.params, function(value,key){
                  if ('options' in value){
                    $scope.properties[value.name] = {
                      "title": value.title,
                      "type": value.type,
                      "description": value.description,
                      "enum": value.options
                    }
                  }else{
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
                  type: "submit",
                  title: "Save"
                }
              ];

              $scope.paramsModel = {};



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
