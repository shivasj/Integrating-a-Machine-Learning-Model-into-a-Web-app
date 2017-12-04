(function() {
    'use strict';
    angular.module('textsummarizer.app.config', [])
        .service('AppConfig', function () {
            this.Settings = {
                app_version: 1.0,
                app_id: "textsummarizer",
                service_url: "http://localhost:5010",
                mongodb_service_url: "http://localhost:5010",
                authentication_url: ""
            };
        });

})();
