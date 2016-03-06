(function() {
    'use strict';

    angular
        .module('kiraso')
        .directive('scroll', scroll);

    scroll.$inject = ['$timeout'];
    function scroll ($timeout) {

        var directive = {
          restrict: 'A',
          link: function(scope, element, attr) {
            scope.$watchCollection(attr.scroll, function(newVal) {
              $timeout(function() {
                element[0].scrollTop = element[0].scrollHeight;
              });
            });
          } 
        }
        return directive;
    }

})();