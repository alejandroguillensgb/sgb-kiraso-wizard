(function() {
    'use strict';

    angular
        .module('custom.forms')
        .service('FormsLoader', FormsLoader);

    FormsLoader.$inject = ['$http'];
    function FormsLoader($http) {
        this.getFormParams = getFormParams;

        ////////////////

        function getFormParams(path, onReady, onError) {
            
          onError = onError || function() { alert('Failure loading metadata'); };

          $http
            .get('http://localhost:8000/getContent?path='+ path +'/metadata.json&type=json')
            .success(onReady)
            .error(onError);
        };

    }
})();