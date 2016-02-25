(function() {
    'use strict';

    angular
        .module('kiraso')
        .factory('kirasoFactory', kirasoFactory);

    kirasoFactory.$inject = [];
    function kirasoFactory() {
        var appModel = {};
        var username = "";
        var projects = [];
        function setAppModel(model){
            appModel = model;
        };
        function setUsername(name){
            username = name;
        };
        function setProjects(project_list){
            projects = project_list;
        };

        return {
            getAppModel: function(){
                return {
                    appModel: appModel
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
            setAppModel: setAppModel,
            setUsername: setUsername,
            setProjects: setProjects
        };          
    }
})();

