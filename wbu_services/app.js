google.load('visualization', '1', {packages:['corechart']});
google.load('visualization', '1', {packages:['gauge']});
google.load('visualization', '1', {packages:['bar']});

'use strict';

var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'app.directive.ngRepeatFinished']);

//app.constant('BasePath', "/ibm/console/webtop/WBU-Dashboard/wbu_services/");
app.constant('BasePath', "");
app.constant('RefreshPeriod', '300');

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.otherwise('/');
	$stateProvider
	.state('services', {
		url: '/',
		params: {
			serviceCatId: 'All'
		},
		templateUrl: 'views/services.html',
		controller: 'servicesController',
		resolve: {
			servicesAlarmData: ['AlarmsDataService', function (AlarmsDataService) {
				//console.log(AlarmsDataService.getServiceLevelAlarms());
				return AlarmsDataService.getServiceLevelAlarms();
			}]
		}   

	})
	.state('customers', {
		//url: '/customers',
		params: {
			serviceCatId: null,
			serviceTypeId: null
		},
		templateUrl: 'views/customers.html',
		controller: 'customersController',
		resolve: {
			customersAlarmData: ['AlarmsDataService', function (AlarmsDataService) {
				//console.log(AlarmsDataService.getCustomerLevelAlarms());
				return AlarmsDataService.getCustomerLevelAlarms();
			}]
		}   
	})
	.state('circuits', {
		//url: '/circuits',
		params: {
			serviceCatId: null,
			serviceTypeId: null,
			customerNameId: null
		},
		templateUrl : 'views/circuits.html',
		controller  : 'circuitsController',
		resolve: {
			circuitsAlarmData: ['AlarmsDataService', function (AlarmsDataService) {
				return AlarmsDataService.getCircuitLevelAlarms();
			}]
		}    
	})
	.state('circuitMetrics', {
		//url: '/circuitMetrics',
		params: {
			serviceCatId: null,
			serviceTypeId: null,
			customerNameId: null,
			circuitId: null,
			affectedCkts: null
		},
		templateUrl : 'views/circuit_metrics.html',
		controller  : 'circuitMetricsController',
		resolve: {
			circuitMetricsData: ['AlarmsDataService', function (AlarmsDataService) {
				return AlarmsDataService.getCircuitMetrics();
			}]
		}    
	})

}]);


app.factory('AlarmsDataService', ['$http', 'BasePath', function($http, BasePath) {
	return {

		getServiceLevelAlarms: function() {
			return $http.get(BasePath + 'json/services.json').then(function(response) {
				return response.data;
			}, function(){console.log("Failed to fetch service level alarms;")});
		},

		getCustomerLevelAlarms: function() {
			return $http.get(BasePath + 'json/customers_services.json').then(function(response) {
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
        return (z(minutes)+':'+z(seconds));
    };
});

