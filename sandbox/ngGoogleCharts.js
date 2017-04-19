"use strict";

var googleChart = googleChart || angular.module("google-chart",[]);

googleChart.directive("googleChart",function(){  
    return{
        restrict : "A",
        link: function(scope, elem, attr){

            //console.log("scope[attr.ngModel]", scope[attr.ngModel]);

            var dt = scope[attr.ngModel]['table'];

            var options = {};
                options.title = scope[attr.ngModel]['title'];

            var googleChart = new google.visualization[attr.googleChart](elem[0]);
             googleChart.draw(dt,options)
        }
    }
});