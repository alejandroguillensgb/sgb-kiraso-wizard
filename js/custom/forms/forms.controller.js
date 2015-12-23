
(function() {
    'use strict';

    angular
        .module('custom.forms')
        .controller('formsController', formsController);

    formsController.$inject = ['$log','$scope'];
    function formsController($log,$scope) {

        activate();
        
        ////////////////

        function activate() {
            
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

              $scope.paramsSchema ={
                "type": "object",
                "properties": {
                  "select": {
                    "title": "Select your template",
                    "type": "string",
                    "enum": [
                      "Compact left",
                      "Compact right",
                      "Large"
                    ]
                  },
                  "select2": {
                    "title": "Show search",
                    "type": "string",
                    "enum": [
                      "Yes",
                      "No"
                    ]
                  },
                  "name": { 
                    "type": "string", 
                    "minLength": 2, 
                    "title": "Icon", 
                    "description": "Use de name of a valid icon" 
                  }
                }
              };

              $scope.paramsForm = [
                "select",
                "select2",
                "name",
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
