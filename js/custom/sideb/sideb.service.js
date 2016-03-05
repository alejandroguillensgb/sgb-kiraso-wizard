(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('PrebuiltLoader', PrebuiltLoader);

    PrebuiltLoader.$inject = ['$http', '$rootScope'];
    function PrebuiltLoader($http, $rootScope) {
        this.getApps = getApps;
        this.getComps = getComps;
        this.copyContent = copyContent;

        ////////////////

        function getApps(onReady, onError) {
          
          onError = onError || function() { alert('Failure loading prebuilt apps'); };

          $http
            .get($rootScope.url + '/getContent?path=/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/server/inventario_apps.json&type=json')
            .success(onReady)
            .error(onError);
        }

        function getComps(onReady, onError) {

          onError = onError || function() { alert('Failure loading components'); };

          $http
            .get($rootScope.url + '/getContent?path=/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/server/inventario_componentes.json&type=json')
            .success(onReady)
            .error(onError);
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