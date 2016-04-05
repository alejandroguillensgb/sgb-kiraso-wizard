// Upload file service

(function() {
    'use strict';

    angular
        .module('custom.forms')
        .service('API', API);

    API.$inject = ['$http', '$rootScope', 'kirasoFactory', '$uibModal'];
    function API($http, $rootScope, kirasoFactory, $uibModal) {
        this.uploadResources = uploadResources;

        ////////////////

        // Upload resources function
        function uploadResources(resources) {
            var ext = resources.name.split(".")[resources.name.split(".").length - 1];
            if(ext == "zip" || ext == "tar"){
                var formData = new FormData();
                formData.append("file", resources);
                return $http.post($rootScope.url + '/uploadFile?path=/home/alejandro/kiraso-wizard/service_data/'+ kirasoFactory.getUsername().username + "/" + kirasoFactory.getAppName(), formData, {
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                });
            } else{
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    template: '<p>Incorrect input format</p>',
                    size: "sm"
                });
            }
        };

    }
})();