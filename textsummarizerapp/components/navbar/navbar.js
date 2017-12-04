(function() {
    'use strict';
    angular.module('textsummarizer.app.navbar', [])
        .directive('appHeader', function () {
            var now = new Date();
            var ticks = now.getTime();

            // <app-navbar></app-navbar>
            return {
                restrict: 'E',
                templateUrl: 'components/navbar/header.html?'+ticks
            };
        })
        .controller('HeaderController', function () {
            var self = this;

        })

})();
