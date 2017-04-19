 "use strict";

google.load('visualization', '1', {packages: ['corechart']});

var myApp = angular.module("app",["google-chart"]);

myApp.controller("IndexCtrl",function($scope){  

    $scope.dtable = {};
    $scope.dtable.data1 = {};
    $scope.dtable.data1.dataTable = new google.visualization.DataTable();
    $scope.dtable.data1.dataTable.addColumn("string","Name")
    $scope.dtable.data1.dataTable.addColumn("number","Qty")
    $scope.dtable.data1.dataTable.addRow(["Test",1]);
    $scope.dtable.data1.dataTable.addRow(["Test2",2]);
    $scope.dtable.data1.dataTable.addRow(["Test3",3]);
    $scope.dtable.data1.title="My Pie"

    console.log($scope.dtable)

    $scope.dtable.data2 = {};
    $scope.dtable.data2.dataTable = new google.visualization.DataTable();
    $scope.dtable.data2.dataTable.addColumn("string","Name")
    $scope.dtable.data2.dataTable.addColumn("number","Qty")
    $scope.dtable.data2.dataTable.addRow(["Test",1]);
    $scope.dtable.data2.dataTable.addRow(["Test2",2]);
    $scope.dtable.data2.dataTable.addRow(["Test3",3]);

    console.log($scope.dtable)


    $scope.dtable.data3 = {};
    $scope.dtable.data3.dataTable = new google.visualization.DataTable();
    $scope.dtable.data3.dataTable.addColumn("string","Name")
    $scope.dtable.data3.dataTable.addColumn("number","Qty")
    $scope.dtable.data3.dataTable.addRow(["Test",1]);
    $scope.dtable.data3.dataTable.addRow(["Test2",2]);
    $scope.dtable.data3.dataTable.addRow(["Test3",3]);

    console.log($scope.dtable)    
});