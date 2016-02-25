(function() {
    'use strict';

    angular
        .module('kiraso')
        .factory('kirasoFactory', kirasoFactory);

    kirasoFactory.$inject = [];
    function kirasoFactory() {
        var appModel = {};
        var app_name = "";
        var username = "";
        var projects = [];
        function setAppModel(model){
            console.log("got called")
            console.log(model)
            appModel = model;
        };
        function setUsername(name){
            username = name;
        };
        function setProjects(project_list){
            projects = project_list;
        };
        function setAppName(name){
            app_name = name;
        };

        return {
            getAppModel: function(){
                console.log("get model")
                console.log(appModel)
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
            getAppName: function(){
                return app_name
            },
            setAppModel: setAppModel,
            setUsername: setUsername,
            setProjects: setProjects,
            setAppName: setAppName
        };          
    }
})();

