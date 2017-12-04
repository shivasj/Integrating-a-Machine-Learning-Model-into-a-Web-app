(function() {
    'use strict';
    angular.module('textsummarizer.app.textsummarizer', [])
        .run(function(bsLoadingOverlayService) {
            bsLoadingOverlayService.setGlobalConfig({
                templateUrl: 'components/common/loading-overlay-template.html'
            });
        })
        .config(function ($stateProvider, $urlRouterProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Home
            $stateProvider.state('textsummarizer', {
                url: '/textsummarizer',
                templateUrl: 'components/textsummarizer/textsummarizer.html?'+ticks,
                controller: 'TextSummarizerController',
                controllerAs: 'textSummarizerCtrl'
            });

        })
        .controller('TextSummarizerController',function (DataService,toaster,$state) {
            var self = this;

            self.index = true;
            self.input = false;
            self.output = false;
            self.content = {};
            self.content._id = '';
            self.content.word_limit = 150;

            self.AddNew = function () {
                self.ResetForm();
                self.index = false;
                self.input = true;
                self.output = false;
            }
            self.ViewContent = function (cnt) {
                self.index = false;
                self.input = false;
                self.output = true;
                self.content = cnt;
            }
            self.EditContent = function () {
                self.index = false;
                self.input = true;
                self.output = false;
            }
            self.Cancel = function () {
                self.index = true;
                self.input = false;
                self.output = false;
            }
            self.ResetForm = function () {
                self.content._id = '';
                self.content.content_title = '';
                self.content.content_text = '';
                self.content.word_limit = 150;
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

            DataService.GetAllContent()
                .then(function(response){
                    self.all_content = response.data.content;
                })
                .catch(function(response){
                    console.dir(response);
                    toaster.pop('error', "Error", "There was an error processing your request");
                });

            self.Save = function () {
                console.log(self.content);

                var update_obj = {};
                update_obj['content_title'] = self.content.content_title;
                update_obj['content_text'] = self.content.content_text;
                update_obj['word_limit'] = self.content.word_limit;

                if(self.content._id == ''){
                    DataService.AddContent(update_obj)
                        .then(function(response){
                            console.dir(response.data);
                            update_obj['_id'] = response.data;
                            self.all_content.push(update_obj);

                            // Summarize Text
                            self.SummarizeText(update_obj['_id'].$oid,update_obj);
                        })
                        .catch(function(response){
                            console.dir(response);
                            toaster.pop('error', "Error", "There was an error processing your request");
                        });
                }else{
                    DataService.UpdateContent(self.content._id.$oid,update_obj)
                        .then(function(response){
                            console.dir(response.data);
                            var row = _.find(self.all_content, function(o) { return o._id.$oid == self.content._id.$oid; });
                            row.content_title = self.content.content_title;
                            row.content_text = self.content.content_text;
                            row.word_limit = self.content.word_limit;

                            // Summarize Text
                            self.SummarizeText(self.content._id.$oid,row);
                        })
                        .catch(function(response){
                            console.dir(response);
                            toaster.pop('error', "Error", "There was an error processing your request");
                        });
                }

                //self.Cancel();
            }

            self.SummarizeText = function (_id,row) {
                console.log(_id);

                DataService.SummarizeText(_id,row['word_limit'])
                    .then(function(response){
                        console.dir(response.data);
                        var summary = response.data;
                        row['excerpts'] = summary['excerpts'];
                        row['keywords'] = summary['keywords'];

                        self.ViewContent(row);
                    })
                    .catch(function(response){
                        console.dir(response);
                        toaster.pop('error', "Error", "There was an error processing your request");
                    });
            }
        })
})();