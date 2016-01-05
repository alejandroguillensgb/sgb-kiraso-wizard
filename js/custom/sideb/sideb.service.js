(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('PrebuiltLoader', PrebuiltLoader);

    PrebuiltLoader.$inject = ['$http'];
    function PrebuiltLoader($http) {
        this.getApps = getApps;
        this.getComps = getComps;
        this.copyContent = copyContent;
        ////////////////

        function getApps(onReady, onError) {
          
          onError = onError || function() { alert('Failure loading prebuilt apps'); };

          $http
            .get('http://localhost:8000/getContent?path=/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/server/inventario_apps.json&type=json')
            .success(onReady)
            .error(onError);
        }

        function getComps(onReady, onError) {
            
          //path = path || '/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/server/inventario_componentes.json';  

          onError = onError || function() { alert('Failure loading components'); };

          $http
            .get('http://localhost:8000/getContent?path=/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/server/inventario_componentes.json&type=json')
            .success(onReady)
            .error(onError);
        }

        function copyContent(item , onReady, onError) {

            onError = onError || function() { alert('Failure copying'); };

            $http
                .get('http://localhost:8000/copyContent?path_src='+item.path+'&path_dst='+item.path+'-copy')
                .success(function(){
                    onReady(item.name+'-copy', item.path+'-copy')
                })
                .error(onError);
        } 
    }
})();