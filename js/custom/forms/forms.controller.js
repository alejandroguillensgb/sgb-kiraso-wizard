
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
            
            $scope.schema = {
                type: "object",
                properties: {
                  name: { type: "string", minLength: 2, title: "Name", description: "Name or alias" },
                  title: {
                    type: "string",
                    enum: ['dr','jr','sir','mrs','mr','NaN','dj']
                  }
                }
              };

              $scope.form = [
                "*",
                {
                  type: "submit",
                  title: "Save"
                }
              ];

              $scope.model = {};
        }
    }
})();
