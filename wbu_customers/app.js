google.load('visualization', '1', {packages:['corechart']});
google.load('visualization', '1', {packages:['gauge']});
google.load('visualization', '1', {packages:['bar']});

'use strict';

var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'app.directive.ngRepeatFinished']);

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


var module = angular.module('app.directive.ngRepeatFinished', [])
.directive('onFinishRender', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit(attr.onFinishRender);
				});
			}
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

