/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/base/login');

        // 
        // Application Routes
        // -----------------------------------   
        $stateProvider
        
        .state('app', {
            url: '/app',
            templateUrl: helper.basepath('app.html'),
            controller: "Controller",
            resolve: helper.resolveFor('modernizr', 'icons')
        })

        .state('base', {
            url: '/base',
            abstract: true,
            templateUrl: helper.basepath('base.html'),
            controller: "Controller",
            resolve: helper.resolveFor('modernizr', 'icons')
        })

        .state('base.login', {
            url: '/login',
            title: 'Login',
            views:{
                "loginview":{
                    templateUrl: helper.basepath('partials/login.html')
                }
            }
        })

        .state('base.signup', {
            url: '/signup',
            title: 'Sign Up',
            views:{
                "signupview":{
                    templateUrl: helper.basepath('partials/signup.html')
                }
            } 
        })

        .state('projects', {
            url: '/projects',
            title: 'My projects',
            templateUrl: helper.basepath('partials/projectsview.html'),
            controller: "Controller"
        })

        .state('app.preview', {
            url: '/preview',
            title: 'Preview',
            views:{
                "view":{
                    templateUrl: helper.basepath('partials/preview.html'),
                    controller:"aceController"
                },
                "sidebar":{
                    templateUrl: helper.basepath('partials/directory.html'),
                    controller: "SidebarController"
                }
            }
        })
        
        .state('app.wizard', {
            url: '/wizard/:new',
            title: 'Wizard',
            views:{
                "view":{
                    templateUrl: helper.basepath('partials/graphicview.html'),
                    controller: "graphController"
                },
                "offsidebar":{
                    templateUrl: helper.basepath('partials/offsidetabs.html'),
                    controller: "formsController"
                },
                "sidebar":{
                    templateUrl: helper.basepath('partials/sidebar.html'),
                    controller: "sidebController"
                }
            }
        })
          
          
          // 
          // CUSTOM RESOLVES
          //   Add your own resolves properties
          //   following this object extend
          //   method
          // ----------------------------------- 
          // .state('app.someroute', {
          //   url: '/some_url',
          //   templateUrl: 'path_to_template.html',
          //   controller: 'someController',
          //   resolve: angular.extend(
          //     helper.resolveFor(), {
          //     // YOUR RESOLVES GO HERE
          //     }
          //   )
          // })
          ;

    } // routesConfig

})();

