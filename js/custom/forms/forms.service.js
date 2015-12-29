(function() {
    'use strict';

    angular
        .module('custom.forms')
        .service('FormsLoader', FormsLoader);

    FormsLoader.$inject = ['$http'];
    function FormsLoader($http) {
        this.getFormParams = getFormParams;

        ////////////////

        function getFormParams(onReady, onError) {
            
          onError = onError || function() { alert('Failure loading metadata'); };

          $http
            .get('http://localhost:8000/getContent?path=/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/server/metadata.json&type=json')
            .success(onReady)
            .error(onError);
        };

    }
})();