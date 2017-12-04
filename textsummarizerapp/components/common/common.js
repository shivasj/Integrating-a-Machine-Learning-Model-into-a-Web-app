(function() {
    'use strict';
    angular.module('textsummarizer.app.common', [])
        .controller('confirmmodalController', function ($uibModalInstance, valid) {
            var self = this;

            self.valid = valid;
            self.ok = function () {
                $uibModalInstance.close();
            };

            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        })
        .directive('switch', function () {
            return {
                restrict: 'AE'
                , replace: true
                , transclude: true
                , template: function (element, attrs) {
                    var html = '';
                    html += '<span';
                    html += ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
                    html += attrs.ngModel ? ' ng-click="' + attrs.disabled + ' ? ' + attrs.ngModel + ' : ' + attrs.ngModel + '=!' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '()"' : '"') : '';
                    html += ' ng-class="{ checked:' + attrs.ngModel + ', disabled:' + attrs.disabled + ' }"';
                    html += '>';
                    html += '<small></small>';
                    html += '<input type="checkbox"';
                    html += attrs.id ? ' id="' + attrs.id + '"' : '';
                    html += attrs.name ? ' name="' + attrs.name + '"' : '';
                    html += attrs.ngModel ? ' ng-model="' + attrs.ngModel + '"' : '';
                    html += ' style="display:none" />';
                    html += '<span class="switch-text">'; /*adding new container for switch text*/
                    html += attrs.on ? '<span class="on">' + attrs.on + '</span>' : ''; /*switch text on value set by user in directive html markup*/
                    html += attrs.off ? '<span class="off">' + attrs.off + '</span>' : ' ';  /*switch text off value set by user in directive html markup*/
                    html += '</span>';
                    return html;
                }
            }
        })
        .filter('ExistsInArray', function($filter){
            return function(list, arrayFilter, element1,element2){
                //console.log(arrayFilter);
                //console.log(element1+'-'+element2);
                if(arrayFilter){
                    return $filter("filter")(list, function(listItem){
                        //return arrayFilter.indexOf(listItem[element]) != -1;
                        return (_.findIndex(arrayFilter, function(o) { return listItem[element1] == o[element2]; }) != -1)
                    });

                    //return list;
                }else{
                    return list;
                }
            };
        })
        .filter('NotExistsInArray', function($filter){
            return function(list, arrayFilter, element1,element2){
                //console.log(arrayFilter);
                //console.log(element1+'-'+element2);
                if(arrayFilter){
                    return $filter("filter")(list, function(listItem){
                        //return arrayFilter.indexOf(listItem[element]) != -1;
                        return (_.findIndex(arrayFilter, function(o) { return listItem[element1] == o[element2]; }) == -1)
                    });

                    //return list;
                }else{
                    return list;
                }
            };
        })
        .filter('IsNotNull', function($filter){
            return function(list, columnname){
                //console.log(arrayFilter);
                //console.log(element1+'-'+element2);
                if(columnname){
                    return $filter("filter")(list, function(listItem){
                        //return (_.findIndex(arrayFilter, function(o) { return listItem[element1] == o[element2]; }) != -1)
                        return listItem[columnname] != '';
                    });

                }else{
                    return list;
                }
            };
        })
        .filter('percentage', ['$filter', function ($filter) {
            return function (input, decimals) {
                if(input < 0.01 && decimals ==0){
                    return $filter('number')(input * 100, 1) + '%';
                }else{
                    return $filter('number')(input * 100, decimals) + '%';
                }

            };
        }])
        .filter('shortNumber',function () {
            return function (number, fractionSize){
                if(number === null) return null;
                if(number === 0) return "0";
                if(number == NaN) return "";
                if(!number) return "";

                if(!fractionSize || fractionSize < 0)
                    fractionSize = 1;

                var abs = Math.abs(number);
                var rounder = Math.pow(10,fractionSize);
                var isNegative = number < 0;
                var key = '';
                var powers = [
                    {key: "Q", value: Math.pow(10,15)},
                    {key: "T", value: Math.pow(10,12)},
                    {key: "B", value: Math.pow(10,9)},
                    {key: "M", value: Math.pow(10,6)},
                    {key: "K", value: 1000},
                    {key: "", value: 1}
                ];

                for(var i = 0; i < powers.length; i++) {

                    var reduced = abs / powers[i].value;

                    reduced = Math.round(reduced * rounder) / rounder;

                    if(reduced >= 1){
                        abs = reduced;
                        key = powers[i].key;
                        break;
                    }
                }

                return (isNegative ? '-' : '') + abs + key;
            };
        })
        .filter('applyFilter', function($filter) {
            return function(value, filterName) {
                if(filterName === null) return value;
                if(!filterName) return value;

                // Check if we have arguments
                var filt = filterName.split(':');

                return $filter(filt[0])(value,filt[1]);
                //var fName = [].splice.call(arguments, 1, 1)[0];
                //return $filter(filterName).apply(null, value);
            };
        })
        .directive('uiFullscreen',function($document,$window){
            return {
                restrict: 'AC',
                template:'<i class="fa fa-expand fa-fw text" id="fullscreenexpand"></i><i class="fa fa-compress fa-fw text-active" id="fullscreencompress"></i>',
                link: function(scope, el, attr) {
                    el.addClass('hide');
                    $('#fullscreencompress').addClass('hide');

                    // disable on ie11
                    if (screenfull.enabled && !navigator.userAgent.match(/Trident.*rv:11\./)) {
                        el.removeClass('hide');
                    }
                    el.on('click', function(){
                        // var target;
                        // attr.target && ( target = $(attr.target)[0] );
                        // console.log(attr[0])
                        screenfull.toggle();
                    });
                    $document.on(screenfull.raw.fullscreenchange, function () {
                        console.log(screenfull.isFullscreen)
                        if(screenfull.isFullscreen){
                            //el.addClass('active');
                            $('#fullscreenexpand').addClass('hide');
                            $('#fullscreencompress').removeClass('hide');
                        }else{
                            //el.removeClass('active');
                            $('#fullscreencompress').addClass('hide');
                            $('#fullscreenexpand').removeClass('hide');
                        }
                    });

                }
            };
        })
        .service("$previousState",function ($state) {

            var history = [];

            var $previousState = {
                previous: function (state,stateParams) {
                    if(history.length > 1){
                        if(history[0].state == history[1].state){
                            return null;
                        }
                        return history[1];
                    }else{
                        return null;
                    }

                },
                record:function(){
                    //history.push({ state: $state.current.name, params: $state.params });
                    history.unshift({ state: $state.current.name, params: $state.params })
                    history = history.slice(0, 5);
                    console.log(history);
                },
                history : history
            }

            return $previousState;
        })
})();
