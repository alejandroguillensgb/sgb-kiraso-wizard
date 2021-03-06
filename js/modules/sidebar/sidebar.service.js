(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['$http', '$rootScope'];
    function SidebarLoader($http, $rootScope) {
        this.getMenu = getMenu;
        this.getContent = getContent;

        ////////////////

        function getMenu(path, onReady, onError) {
          var menuJson = 'server/sidebar-menu.json',
              menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            
          onError = onError || function() { alert('Failure loading menu'); };

          $http
            .get($rootScope.url + '/dirTree?path=' + path)
            .success(onReady)
            .error(onError);
        };

        function getContent(path, onReady, onError) {
          
          onError = onError || function() { alert('Failure getting content'); };
          
          $http
            .get($rootScope.url + '/getContent?path=' + path)
            .success(function(data){
              onReady(data,path)
            })
            .error(onError);
        }
    }
})();