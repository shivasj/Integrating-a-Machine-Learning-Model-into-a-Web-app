(function() {
    'use strict';
    angular.module('textsummarizer.app.sentimentanalysis', [])
        .run(function(bsLoadingOverlayService) {
            bsLoadingOverlayService.setGlobalConfig({
                templateUrl: 'components/common/loading-overlay-template.html'
            });
        })
        .config(function ($stateProvider, $urlRouterProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Home
            $stateProvider.state('sentimentanalysis', {
                url: '/sentimentanalysis',
                templateUrl: 'components/sentimentanalysis/sentimentanalysis.html?'+ticks,
                controller: 'SentimentAnalysisController',
                controllerAs: 'sentimentAnalysisCtrl'
            });

        })
        .controller('SentimentAnalysisController',function (DataService,toaster,$state) {
            var self = this;

            self.index = true;
            self.input = false;
            self.output = false;
            self.review = {};
            self.review._id = '';

            self.AddNew = function () {
                self.ResetForm();
                self.index = false;
                self.input = true;
                self.output = false;
            }
            self.ViewReview = function (rev) {
                self.index = false;
                self.input = false;
                self.output = true;
                self.review = rev;
            }
            self.EditReview = function (rev) {
                self.index = false;
                self.input = true;
                self.output = false;
                self.review = rev;
            }
            self.Cancel = function () {
                self.index = true;
                self.input = false;
                self.output = false;
            }
            self.ResetForm = function () {
                self.review._id = '';
                self.review.review_text = '';
            }
            self.Back = function(){
                if(self.index){
                    $state.go('home');
                }else{
                    self.index = true;
                    self.input = false;
                    self.output = false;
                }

            }

            DataService.GetAllReviews()
                .then(function(response){
                    self.all_reviews = response.data.review;
                })
                .catch(function(response){
                    console.dir(response);
                    toaster.pop('error', "Error", "There was an error processing your request");
                });

            self.Save = function () {
                console.log(self.review);

                var update_obj = {};
                update_obj['review_text'] = self.review.review_text;

                if(self.review._id == ''){
                    DataService.AddReview(update_obj)
                        .then(function(response){
                            console.dir(response.data);
                            update_obj['_id'] = response.data;
                            self.all_reviews.push(update_obj);

                            // Classify Review
                            self.ClassifyReview(update_obj['_id'].$oid,update_obj);
                        })
                        .catch(function(response){
                            console.dir(response);
                            toaster.pop('error', "Error", "There was an error processing your request");
                        });
                }else{
                    DataService.UpdateReview(self.review._id.$oid,update_obj)
                        .then(function(response){
                            console.dir(response.data);
                            var row = _.find(self.all_reviews, function(o) { return o._id.$oid == self.review._id.$oid; });
                            row.review_text = self.review.review_text;

                            // Classify Review
                            self.ClassifyReview(self.review._id.$oid,row);
                        })
                        .catch(function(response){
                            console.dir(response);
                            toaster.pop('error', "Error", "There was an error processing your request");
                        });
                }

            }

            self.ClassifyReview = function (_id,row) {
                console.log(_id);

                DataService.ClassifyReview(_id)
                    .then(function(response){
                        console.dir(response.data);
                        var prediction = response.data;
                        row['y'] = prediction['y'];
                        row['proba'] = prediction['proba'];

                        self.ViewReview(row);
                    })
                    .catch(function(response){
                        console.dir(response);
                        toaster.pop('error', "Error", "There was an error processing your request");
                    });
            }
            self.CorrectPrediction = function () {
                DataService.TrainReview(self.review._id.$oid,self.review.y)
                    .then(function(response){
                        console.dir(response.data);
                        self.Save()
                    })
                    .catch(function(response){
                        console.dir(response);
                        toaster.pop('error', "Error", "There was an error processing your request");
                    });
            }
            self.InCorrectPrediction = function () {
                var y = 0;
                if(self.review.y == 1){
                    y = 0;
                }else{
                    y = 1;
                }
                DataService.TrainReview(self.review._id.$oid,y)
                    .then(function(response){
                        console.dir(response.data);
                        self.Save()
                    })
                    .catch(function(response){
                        console.dir(response);
                        toaster.pop('error', "Error", "There was an error processing your request");
                    });
            }

            self.GetSentiment = function (y) {

                if(y == 1){
                    return "possitive";
                }
                return "negative";
            }
        })
})();