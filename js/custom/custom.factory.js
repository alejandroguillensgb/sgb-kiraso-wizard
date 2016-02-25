(function() {
    'use strict';

    angular
        .module('kiraso')
        .factory('kirasoFactory', kirasoFactory);

    kirasoFactory.$inject = [];
    function kirasoFactory() {
        var app_name = "";
        var username = "";
        var projects = [];
        function setAppName(name){
            app_name = name;
        };
        function setUsername(name){
            username = name;
        };
        function setProjects(project_list){
            projects = project_list;
        };

        return {
            getAppName: function(){
                return {
                    app_name: app_name
                }
            },
            getUsername: function(){
                return {
                    username: username
                }
            },
            getProjects: function(){
                return {
                    projects: projects
                }
            },
            setAppName: setAppName,
            setUsername: setUsername,
            setProjects: setProjects
        };          
    }
})();

