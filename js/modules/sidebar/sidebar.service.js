(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['$http'];
    function SidebarLoader($http) {
        this.getMenu = getMenu;
        this.getContent = getContent;

        ////////////////

        function getMenu(onReady, onError) {
          var menuJson = 'server/sidebar-menu.json',
              menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            
          onError = onError || function() { alert('Failure loading menu'); };

          $http
            .get('http://localhost:8000/dirTree')
            .success(onReady)
            .error(onError);
        };

        function getContent(path, onReady, onError) {
          
          onError = onError || function() { alert('Failure getting content'); };

          
          $http
            .get('http://localhost:8000/getContent?path=' + path)
            .success(function(data){
              onReady(data,path)
            })
            .error(onError);

          // $http
          //   .get('http://localhost:8000/getContent?path=/home/alejandro/kiraso-wizard/sgb-kiraso-wizard/bower.json&type=json')
          //   .success(onReady)
          //   .error(onError);
        }
    }
})();