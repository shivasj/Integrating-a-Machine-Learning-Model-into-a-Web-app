(function() {
    'use strict';
    angular.module('textsummarizer.app.menu', [])
        .directive('appMenu', function () {
            var now = new Date();
            var ticks = now.getTime();

            // <app-menu></app-menu>
            return {
                restrict: 'E',
                templateUrl: 'components/menu/menu.html?'+ticks,
                link: function (scope, element, attrs) {
                    $(".hamburger").click(function(event) {

                        $(".top-menu").toggleClass("top-animate");
                        $(".mid-menu").toggleClass("mid-animate");
                        $(".bottom-menu").toggleClass("bottom-animate");
                        if($("#nav-container").hasClass("menu-close")){
                            $("#nav-container" ).animate({ "left": "0px" }, "310" );
                            $("#nav-container").removeClass("menu-close");
                            $("#nav-container").addClass("menu-open");

                        }
                        else{
                            $("#nav-container").removeClass("menu-open");
                            $("#nav-container").addClass("menu-close");
                            $("#nav-container" ).animate({ "left": "-300px" }, "310" );
                        }
                        //event.stopPropagation();
                    });
                    $("body").click(function(){
                        //console.log("body click");
                        //if($("#nav-container").hasClass("menu-open")){
                        //    $("#nav-container" ).animate({ "left": "-300px" }, "310" );
                        //    $(".top-menu").toggleClass("top-animate");
                        //    $(".mid-menu").toggleClass("mid-animate");
                        //    $(".bottom-menu").toggleClass("bottom-animate");
                        //    $("#nav-container").removeClass("menu-open");
                        //    $("#nav-container").addClass("menu-close");
                        //}
                    })
                    $(".custom-drop li").click(function() {
                        console.log(this);
                        if($(this).children().length>1){

                        }
                        else{
                            $("#nav-container").removeClass("menu-open");
                            $("#nav-container").addClass("menu-close");
                            $("#nav-container" ).animate({ "left": "-300px" }, "310" );
                            $(".top-menu").toggleClass("top-animate");
                            $(".mid-menu").toggleClass("mid-animate");
                            $(".bottom-menu").toggleClass("bottom-animate");
                        }
                    });
                }
            };
        })

})();

