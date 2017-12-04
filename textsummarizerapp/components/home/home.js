(function() {
    'use strict';
    angular.module('textsummarizer.app.home', [])
        .run(function(bsLoadingOverlayService) {
            bsLoadingOverlayService.setGlobalConfig({
                templateUrl: 'components/common/loading-overlay-template.html'
            });
        })
        .config(function ($stateProvider, $urlRouterProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Home
            $stateProvider.state('home', {
                url: '/',
                templateUrl: 'components/home/home.html?'+ticks,
                controller: 'HomeController',
                controllerAs: 'homeCtrl'
            });


            $urlRouterProvider.otherwise('/');

        })
        .service('DataService',function ($http, $q, $timeout,AppConfig) {
            var self = this;

            var now = function () { return new Date(); };
            var ticks = now().getTime();
            var cache = {}

            // Summarize Text
            self.SummarizeText = function (_id,word_limit) {
                return $http.get(AppConfig.Settings.mongodb_service_url + '/summarize_text?_id=' + _id + "&word_limit="+word_limit  + "&" + now().getTime(), { cache: false });
            }

            // Classify Review
            self.ClassifyReview = function (_id) {
                return $http.get(AppConfig.Settings.mongodb_service_url + '/classify_review?_id=' + _id  + "&" + now().getTime(), { cache: false });
            }
            // Train Review
            self.TrainReview = function (_id,y) {
                return $http.get(AppConfig.Settings.mongodb_service_url + '/train_review?_id=' + _id + "&y="+ y  + "&" + now().getTime(), { cache: false });
            }

            // Content
            self.GetAllContent = function () {
                var q = {};
                return $http.get(AppConfig.Settings.mongodb_service_url + '/content?' + "q=" + JSON.stringify(q) + "&" + now().getTime(), { cache: false });
            }
            self.GetContent = function (id) {
                return $http.get(AppConfig.Settings.mongodb_service_url + '/content/' + id + "?" + now().getTime(), { cache: false });
            }
            self.AddContent = function(obj){
                return $http.post(AppConfig.Settings.mongodb_service_url + '/content', obj);
            }
            self.UpdateContent = function(_id,updateFields){
                return $http.post(AppConfig.Settings.mongodb_service_url + '/content/'+_id, updateFields);
            }
            self.DeleteContent = function(_id){

            }

            // Reviews
            self.GetAllReviews = function () {
                var q = {};
                return $http.get(AppConfig.Settings.mongodb_service_url + '/review?' + "q=" + JSON.stringify(q) + "&" + now().getTime(), { cache: false });
            }
            self.GetReview = function (id) {
                return $http.get(AppConfig.Settings.mongodb_service_url + '/review/' + id + "?" + now().getTime(), { cache: false });
            }
            self.AddReview = function(obj){
                return $http.post(AppConfig.Settings.mongodb_service_url + '/review', obj);
            }
            self.UpdateReview = function(_id,updateFields){
                return $http.post(AppConfig.Settings.mongodb_service_url + '/review/'+_id, updateFields);
            }
            self.DeleteReview = function(_id){

            }

        })
        .controller('HomeController',function (DataService,toaster,$state) {
            var self = this;

        })
})();