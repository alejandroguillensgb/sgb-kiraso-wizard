(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('PrebuiltLoader', PrebuiltLoader);

    PrebuiltLoader.$inject = ['$http', '$rootScope', '$q', 'kirasoFactory'];
    function PrebuiltLoader($http, $rootScope, $q, kirasoFactory) {
        this.getApps = getApps;
        this.getComps = getComps;
        this.copyContent = copyContent;

        ////////////////

        function getApps(onReady, onError) {
          
          onError = onError || function() { alert('Failure loading prebuilt apps'); };
          var requests = [];
          requests.push($http.get($rootScope.url + '/getContent?path=/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/server/inventario_apps.json&type=json'));
          requests.push($http.get($rootScope.url + '/getContent?path=/home/alejandro/kiraso-wizard/service_data/'+ kirasoFactory.getUsername().username + "/inventario_apps_propios.json&type=json"))
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
          requests.push($http.get($rootScope.url + '/getContent?path=/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/server/inventario_componentes.json&type=json'))
          requests.push($http.get($rootScope.url + '/getContent?path=/home/alejandro/kiraso-wizard/service_data/'+ kirasoFactory.getUsername().username + "/inventario_componentes_propios.json&type=json"))
          $q.all(requests)
            .then(function(res){
                console.log(res)
                var items = [];
                items.push(res[0].data, res[1].data);
                onReady(_.flattenDeep(items));
            })
        }

        function copyContent(item , onReady, onError) {

            onError = onError || function() { alert('Failure copying'); };

            $http
                .get($rootScope.url + '/copyContent?path_src='+item.path+'&path_dst='+item.path+'-copy')
                .success(function(){
                    onReady(item.name+'-copy', item.path+'-copy')
                })
                .error(onError);
        } 
    }
})();