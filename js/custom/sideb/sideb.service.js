(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('PrebuiltLoader', PrebuiltLoader);

    PrebuiltLoader.$inject = ['$http', '$rootScope', '$q', 'kirasoFactory'];
    function PrebuiltLoader($http, $rootScope, $q, kirasoFactory) {
        this.getApps = getApps;
        this.getComps = getComps;

        ////////////////

        function getApps(onReady, onError) {
          
          onError = onError || function() { alert('Failure loading prebuilt apps'); };
          var requests = [];
          requests.push($http.get($rootScope.url + '/getContent?path=/home/alejandro/kiraso-wizard/service_data/inventario_apps.json&type=json')); // Company metadata
          requests.push($http.get($rootScope.url + '/getContent?path=/home/alejandro/kiraso-wizard/service_data/'+ kirasoFactory.getUsername().username + "/inventario_apps_propios.json&type=json")) // User metadata
          $q.all(requests)
            .then(function(res){
                console.log(res)
                var items = [];
                items.push(res[0].data, res[1].data);
                onReady(_.flattenDeep(items));
            })
        }

        function getComps(onReady, onError) {

          onError = onError || function() { alert('Failure loading components'); };
          var requests = [];
          requests.push($http.get($rootScope.url + '/getContent?path=/home/alejandro/kiraso-wizard/service_data/inventario_componentes.json&type=json')) // Company apps
          requests.push($http.get($rootScope.url + '/getContent?path=/home/alejandro/kiraso-wizard/service_data/'+ kirasoFactory.getUsername().username + "/inventario_componentes_propios.json&type=json")) // User apps
          $q.all(requests)
            .then(function(res){
                console.log(res)
                var items = [];
                items.push(res[0].data, res[1].data);
                onReady(_.flattenDeep(items));
            })
        }
    }
})();