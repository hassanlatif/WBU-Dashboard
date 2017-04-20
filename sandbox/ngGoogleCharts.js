"use strict";

var googleChart = googleChart || angular.module("google-chart",[]);

googleChart.directive("googleChart",function(){  
    return{
        restrict : "A",
        link: function(scope, elem, attr){

            // console.log("scope[attr.ngModel]", scope[attr.ngModel]);

            var data = scope[attr.ngModel];

            var dataTable = google.visualization.arrayToDataTable([
                ['Type', 'Count'],
                [data.badCircuits.toString(), data.badCircuits],
                [data.goodCircuits.toString(), data.goodCircuits]
                ]);

            var options = {
                'width':290,
                'height':209,
                colors: ['red', '#59b20a'],
                pieHole: 0.4,
                pieSliceText: 'percentage',
                sliceVisibilityThreshold: 0.0001,
                pieSliceTextStyle: {color: 'Black', fontSize: '12', bold: true},
                titleTextStyle: { color: '#007DB0', fontSize: '13'},
                legend: {'position': 'bottom'},
                slices: { 1: {offset: 0.05}},
                tooltip: {
                  showColorCode: true,
                  text: 'percentage'
                }
            };
                            
            options.title = data.customerName;

            var googleChart = new google.visualization[attr.googleChart](elem[0]);
            googleChart.draw(dataTable,options)
        }
    }
});