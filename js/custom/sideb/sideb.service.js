(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('PrebuiltLoader', PrebuiltLoader);

    PrebuiltLoader.$inject = ['$http'];
    function PrebuiltLoader($http) {
        this.getApps = getApps;
        this.getComps = getComps;
        ////////////////

        function getApps(onReady, onError) {
          
          onError = onError || function() { alert('Failure loading menu'); };

          $http
            .get('http://localhost:8000/getContent?path=/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/server/inventario_apps.json&type=json')
            .success(onReady)
            .error(onError);
        }

        function getComps(onReady, onError) {
            
          onError = onError || function() { alert('Failure loading menu'); };

          $http
            .get('http://localhost:8000/getContent?path=/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/server/inventario_componentes.json&type=json')
            .success(onReady)
            .error(onError);
        }
    }
})();