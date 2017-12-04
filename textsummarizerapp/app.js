(function() {
    'use strict';
    angular.module('textsummarizer.app', [
        'ui.router'
        ,'ui.bootstrap'
        ,'ngSanitize'
        ,'LocalStorageModule'
        ,'toaster'
        ,'bsLoadingOverlay'
        ,'ui'
        ,'ui.grid'
        ,'ui.grid.pinning'
        ,'ui.grid.exporter'
        ,'ui.grid.resizeColumns'
        ,'ui.grid.edit'
        ,'ui.select'
        ,'ui.utils.masks'
        ,'textsummarizer.app.config'
        ,'textsummarizer.app.common'
        ,'textsummarizer.app.navbar'
        ,'textsummarizer.app.menu'
        ,'textsummarizer.app.home'
        ,'textsummarizer.app.textsummarizer'
        ,'textsummarizer.app.sentimentanalysis'
    ])
        .service('AppService',function($window){
            var self = this;

            self.CurrentUser = {};

            self.GetScreenWidth = function () {
                return $window.innerWidth;
            }
            self.IsMobile = function(){
                if($window.innerWidth < 700){
                    return true;
                }else{
                    return false;
                }
            }
        })
        .controller('appController', function ($state,AppService) {
            var self = this;
            console.log("appController");

        })

})();

