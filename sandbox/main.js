 "use strict";

 google.load('visualization', '1', {packages: ['corechart']});

 var myApp = angular.module("app",["google-chart", "ui.bootstrap"]);

 myApp.controller("IndexCtrl",function($scope){  

    $scope.chartsData = [];

    $scope.chartsData = [
    {
        "badCircuits": 25,
        "customerName": "BANGLADESH (TRAC)",
        "goodCircuits": 138
    },
    {
        "badCircuits": 20,
        "customerName": "KDDI CORPORATION",
        "goodCircuits": 0
    },
    {
        "badCircuits": 19,
        "customerName": "VIVA  - Kuwait",
        "goodCircuits": 270
    },
    {
        "badCircuits": 10,
        "customerName": "Jordan Telecom Group Orange)",
        "goodCircuits": 62
    },
    {
        "badCircuits": 10,
        "customerName": "Pella Telecommunication Ltd",
        "goodCircuits": 73
    },
    {
        "badCircuits": 10,
        "customerName": "Sudanese Mobile TeleCo-Zain",
        "goodCircuits": 15
    },
    {
        "badCircuits": 8,
        "customerName": "IBASIS NETHERLANDS BV",
        "goodCircuits": 118
    },
    {
        "badCircuits": 7,
        "customerName": "INDIA (VODAFON)",
        "goodCircuits": 14
    }
    ];


    $scope.page = 1;
    $scope.itemsPerPage = 4;

    $scope.pageChanged = function(){
        console.log($scope.page)

    }


});