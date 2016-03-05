(function() {
    'use strict';

    angular
        .module('custom.forms')
        .service('FormsLoader', FormsLoader);

    FormsLoader.$inject = ['$http', '$rootScope'];
    function FormsLoader($http, $rootScope) {
        this.getFormParams = getFormParams;

        ////////////////

        function getFormParams(path, onReady, onError) {
            
          onError = onError || function() { alert('Failure loading metadata'); };

          $http
            .get($rootScope.url + '/getContent?path='+ path +'/metadata.json&type=json')
            .success(onReady)
            .error(onError);
        };

    }
})();