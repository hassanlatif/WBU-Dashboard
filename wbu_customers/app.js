google.load('visualization', '1', {packages:['corechart']});
google.load('visualization', '1', {packages:['gauge']});
google.load('visualization', '1', {packages:['bar']});

'use strict';

var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'google-chart']);

//app.constant('BasePath', "/ibm/console/webtop/WBU-Dashboard/wbu_customers/");
app.constant('BasePath', "");
//app.constant('RefreshPeriod', 300);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.otherwise('/');
	$stateProvider
	.state('customers', {
		url: '/',
		templateUrl: 'views/customers.html',
		controller: 'customersController',
		resolve: {
			customersAlarmData: ['AlarmsDataService', function (AlarmsDataService) {
				//console.log(AlarmsDataService.getCustomerLevelAlarms());
				return AlarmsDataService.getCustomerLevelAlarms();
			}],
			refreshPeriod: ['AlarmsDataService', function (AlarmsDataService) {
				//console.log(AlarmsDataService.getAlarmsRefreshTime());
				return AlarmsDataService.getAlarmsRefreshTime();
			}]
		}   
	})
	.state('services', {
		//url: '/services',
		params: {
			customerNameId: null
		},
		templateUrl: 'views/services.html',
		controller: 'servicesController',
		resolve: {
			servicesAlarmData: ['AlarmsDataService', function (AlarmsDataService) {
				//console.log(AlarmsDataService.getServiceLevelAlarms());
				return AlarmsDataService.getServiceLevelAlarms();
			}],
			refreshPeriod: ['AlarmsDataService', function (AlarmsDataService) {
				//console.log(AlarmsDataService.getAlarmsRefreshTime());
				return AlarmsDataService.getAlarmsRefreshTime();
			}]
		}   

	})
	.state('circuits', {
		//url: '/circuits',
		params: {
			customerNameId: null,
			serviceTypeId: null
		},
		templateUrl : 'views/circuits.html',
		controller  : 'circuitsController',
		resolve: {
			circuitsAlarmData: ['AlarmsDataService', function (AlarmsDataService) {
				return AlarmsDataService.getCircuitLevelAlarms();
			}],
			refreshPeriod: ['AlarmsDataService', function (AlarmsDataService) {
				//console.log(AlarmsDataService.getAlarmsRefreshTime());
				return AlarmsDataService.getAlarmsRefreshTime();
			}]
		}    
	})
	.state('circuitMetrics', {
		//url: '/circuitMetrics',
		params: {

			customerNameId: null,
			serviceTypeId: null,
			circuitId: null,
			affectedCkts: null
		},
		templateUrl : 'views/circuit_metrics.html',
		controller  : 'circuitMetricsController',
		resolve: {
			circuitMetricsData: ['AlarmsDataService', function (AlarmsDataService) {
				return AlarmsDataService.getCircuitMetrics();
			}],
			refreshPeriod: ['AlarmsDataService', function (AlarmsDataService) {
				//console.log(AlarmsDataService.getAlarmsRefreshTime());
				return AlarmsDataService.getAlarmsRefreshTime();
			}]
		}    
	})

}]);


app.factory('AlarmsDataService', ['$http', 'BasePath', function($http, BasePath) {
	return {

		getServiceLevelAlarms: function() {
			return $http.get(BasePath + 'json/customers_services.json').then(function(response) {
				return response.data;
			}, function(){console.log("Failed to fetch service level alarms;")});
		},

		getCustomerLevelAlarms: function() {
			return $http.get(BasePath + 'json/customers_alarms.json').then(function(response) {
				return response.data;
			}, function(){console.log("Failed to fetch customer level alarms;")});
		},

		getCircuitLevelAlarms: function() {
			return $http.get(BasePath + 'json/circuits.json').then(function(response) {
				return response.data;
			}, function(){console.log("Failed to fetch circuit level alarms;")});
		},

		getCircuitMetrics: function() {
			return $http.get(BasePath + 'json/circuit_metrics.json').then(function(response) {
				return response.data;
			}, function(){console.log("Failed to fetch circuit metrics;")});
		},
		
		getAlarmsRefreshTime: function() {
			return $http.get(BasePath + 'json/refresh_time.json').then(function(response) {
				return response.data;
			}, function(){console.log("Failed to fetch alarms refresh time;")});
		}		


	};
}])


var googleChart = angular.module("google-chart",[])
.directive("googleChart",function(){  
	return{
		restrict : "A",
		link: function(scope, elem, attr){

            // console.log("scope[attr.ngModel]", scope[attr.ngModel]);
			// console.log("scope.itemsType", scope.itemsType);
			// console.log("attr.googleChart", attr.googleChart);
            
            var data = scope[attr.ngModel];
            var dataArray = [];

            var options = {
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
            	},
            	vAxis : {
            		format: 'decimal'
            	}

            };

            if (attr.itemsType==='services'){
            	dataArray = [
            	['Type', 'Count'],
            	[data.badCircuits.toString(), data.badCircuits],
            	[data.goodCircuits.toString(), data.goodCircuits]
            	];

            	options.title = data.serviceType;
            	options.width = 320;
            	options.height = 260;
            	options.colors = ['red', '#59b20a'];

            }
            else if (attr.itemsType==='customers') {
            	dataArray = [
            	['Type', 'Count'],
            	[data.badCircuits.toString(), data.badCircuits],
            	[data.goodCircuits.toString(), data.goodCircuits]
            	];

            	options.title = data.customerName;
            	options.width = 290;
            	options.height = 209;
            	options.colors = ['red', '#59b20a'];
            }
            else if (attr.itemsType==='circuits') {
            	dataArray = [
            	['Type', 'Count'],
            	[data.alarmsClear.toString(), data.alarmsClear],
            	[data.alarmsCritical.toString(), data.alarmsCritical],
            	[data.alarmsMajor.toString(), data.alarmsMajor],
            	[data.alarmsMinor.toString(), data.alarmsMinor],
            	[data.alarmsWarning.toString(), data.alarmsWarning],
            	[data.alarmsIndeterminate.toString(), data.alarmsIndeterminate]
            	];

            	options.title = data.circuitId;
            	options.width = 290;
            	options.height = 206;
            	options.colors = ['#59b20a', 'red', 'orange', 'yellow', 'blue', 'grey'];
            }

            var dataTable = google.visualization.arrayToDataTable(dataArray);
            var googleChart = new google.visualization[attr.googleChart](elem[0]);
            googleChart.draw(dataTable,options)
        }
    }
});



app.filter('formatTimer', function() {
  return function(input)
    {
        function z(n) {return (n<10? '0' : '') + n;}
        var seconds = input % 60;
        var minutes = Math.floor(input / 60);
        //var hours = Math.floor(minutes / 60);        
        return (z(minutes)+':'+z(seconds));
    };
});

