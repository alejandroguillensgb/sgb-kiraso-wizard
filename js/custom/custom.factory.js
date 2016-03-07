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
        var graph = "";
        function setAppModel(model){
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
        function setGraph(g){
            graph = g;
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
            getAppName: function(){
                return app_name
            },
            getGraph: function(){
                return graph
            },
            setAppModel: setAppModel,
            setUsername: setUsername,
            setProjects: setProjects,
            setAppName: setAppName,
            setGraph: setGraph
        };          
    }
})();

