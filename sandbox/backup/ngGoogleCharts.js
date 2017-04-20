"use strict";

var googleChart = googleChart || angular.module("google-chart",[]);

googleChart.directive("googleChart",function(){  
    return{
        restrict : "A",
        link: function(scope, elem, attr){
            console.log(scope);
            console.log("attr.ngModel", scope['dtable'][attr.ngModel]);
            var dt = scope['dtable'][attr.ngModel].dataTable;

            var options = {};
            if(scope['dtable'][attr.ngModel].title)
                options.title = scope['dtable'][attr.ngModel].title;

            var googleChart = new google.visualization[attr.googleChart](elem[0]);
            googleChart.draw(dt,options)
        }
    }
});