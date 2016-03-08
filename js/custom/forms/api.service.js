(function() {
    'use strict';

    angular
        .module('custom.forms')
        .service('API', API);

    API.$inject = ['$http', '$rootScope', 'kirasoFactory'];
    function API($http, $rootScope, kirasoFactory) {
        this.uploadResources = uploadResources;

        ////////////////

        function uploadResources(resources) {
            
            var formData = new FormData();
            formData.append("file", resources);
            return $http.post($rootScope.url + '/uploadFile?path=/home/alejandro/kiraso-wizard/service_data/'+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName(), formData, {
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            });
        };

    }
})();