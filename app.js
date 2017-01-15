google.load('visualization', '1', {packages:['corechart']});

var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'app.directive.ngRepeatFinished']);

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
		url: '/customers',
		params: {
			serviceCatId: null,
			serviceTypeId: null
		},
		templateUrl: 'views/customers.html',
		controller: 'customersController',
		resolve: {
			customersAlarmData: ['AlarmsDataService', function (AlarmsDataService) {
				console.log(AlarmsDataService.getCustomerLevelAlarms());
				return AlarmsDataService.getCustomerLevelAlarms();
			}]
		}   
	})
	.state('circuits', {
		url: '/circuits',
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
}]);


app.factory('AlarmsDataService', ['$http', function($http) {
	return {
		getServiceLevelAlarms: function() {
			return $http.get('/json/service_level_alarms.json').then(function(response) {
				return response.data;
			}, function(){console.log("Failed to fetch service level alarms;")});
		},

		getCustomerLevelAlarms: function() {
			return $http.get('/json/customer_level_alarms.json').then(function(response) {
				return response.data;
			}, function(){console.log("Failed to fetch service level alarms;")});
		},

		getCircuitLevelAlarms: function() {
			return $http.get('/json/circuit_level_alarms.json').then(function(response) {
				return response.data;
			}, function(){console.log("Failed to fetch circuit level alarms;")});
		}

	};
}])


app.controller('servicesController', ['$scope', '$location', '$http','$stateParams', '$state',  'servicesAlarmData',
	function($scope, $location, $http, $stateParams, $state, servicesAlarmData) {

		var serviceCatOptions = {
			"All" : 0,
			"Voice" : 0,
			"Data" : 0,
			"Capacity" : 0
		};

		var serviceCat = $stateParams.serviceCatId;

		if (serviceCat == 'Voice')
			serviceCatOptions.Voice = 1;
		else if (serviceCat == 'Data')
			serviceCatOptions.Data = 1;
		else if (serviceCat == 'Capacity')
			serviceCatOptions.Capacity = 1;
		else {
			serviceCatOptions.All = 1;
			serviceCat = '*';
		}

		$scope.serviceCatOptions = serviceCatOptions;
	//if (serviceCat == 'All')  //Check with Hussain for All case

	$scope.selectServiceCat = function(serviceCatParam) {
		$state.go('services', {serviceCatId: serviceCatParam})
	};

	var chartsData = jsonPath(servicesAlarmData, "$.services." + serviceCat + ".*");

	$scope.data = chartsData;

	$scope.$on('drawServiceCharts', function(ngRepeatFinishedEvent) {

		var options = {
			'width':320,
			'height':260,
			colors: ['red', 'orange', '#59b20a'],
			pieHole: 0.4,
			pieSliceTextStyle: {color: 'white', fontSize: '11'},
			titleTextStyle: { color: '#007DB0', fontSize: '13'},
			legend: {'position': 'none'},

		};

		for (i=0; i <chartsData.length; i++){
			options.title = chartsData[i].serviceType;
			var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].serviceType));

			var chartData = google.visualization.arrayToDataTable([
				['Type', 'Count'],
				['Outage', chartsData[i].alarmsSeverity1],
				['Degradation', chartsData[i].alarmsSeverity2]
				]);

			chart.draw(chartData, options);
		};
	});

	$scope.drawCustomerCharts = function(serviceTypeId){
			//alert(customerId);
		if (serviceCat == '*')  //Check with Hussain for All case
			serviceCat = 'All';

		$state.go('customers', {serviceTypeId: serviceTypeId, serviceCatId: serviceCat});
	}

}]);


app.controller('customersController', [ '$scope', '$location', '$http', '$stateParams', '$state', '$filter', 'customersAlarmData',
	function($scope, $location, $http, $stateParams, $state, $filter, customersAlarmData) {

		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;
		$scope.serviceTypeId = serviceTypeId;
		$scope.serviceCatId = serviceCatId;

		$scope.currentPage = 1;
		$scope.itemsPerPage = 4;

		var data = jsonPath(customersAlarmData, "$.customers." + serviceTypeId + ".*");
		$scope.totalItems = data.length;

		$scope.dataWindow = data.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage));
		//var chartsData = $scope.dataWindow;

		$scope.pageChanged = function() {
			console.log('Page changed to: ' + $scope.currentPage);
			$scope.dataWindow = data.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage));
		};


		$scope.$on('drawCustomerCharts', function(ngRepeatFinishedEvent) {

			var chartsData = data.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage));

			var options = {
				'width':320,
				'height':260,
				colors: ['red', 'orange', '#59b20a'],
				pieHole: 0.4,
				pieSliceTextStyle: {color: 'white', fontSize: '11'},
				titleTextStyle: { color: '#007DB0', fontSize: '13'},
				legend: {'position': 'none'},

			};

			for (i=0; i <chartsData.length; i++){
				options.title = chartsData[i].customerName;
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].customerName));

				var chartData = google.visualization.arrayToDataTable([
					['Type', 'Count'],
					['Outage', chartsData[i].alarmsSeverity1],
					['Degradation', chartsData[i].alarmsSeverity2]
					]);

				chart.draw(chartData, options);
			};

		});

		$scope.drawCircuitCharts = function(customerNameParam, serviceTypeParam){

			$state.go('circuits', {customerNameId: customerNameParam, serviceTypeId: serviceTypeParam, serviceCatId: serviceCatId});
		}

	}]);


app.controller('circuitsController', [ '$scope', '$location','$http', '$stateParams', '$state', 'circuitsAlarmData',
	function($scope, $location, $http, $stateParams, $state, circuitsAlarmData) {

		var customerNameId = $stateParams.customerNameId;
		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;

		$scope.serviceCatId = serviceCatId;
		$scope.serviceTypeId = serviceTypeId;
		$scope.customerNameId = customerNameId;

		var chartsData =  jsonPath(circuitsAlarmData, "$.circuits." + customerNameId + "[?(@.serviceType == " + "'" + serviceTypeId + "')]");
		$scope.data = chartsData;

		$scope.$on('drawCircuitMetrics', function(ngRepeatFinishedEvent) {

			var options = {
				'width':320,
				'height':260,
				colors: ['red', 'orange', '#59b20a'],
				pieHole: 0.4,
				pieSliceTextStyle: {color: 'white', fontSize: '11'},
				titleTextStyle: { color: '#007DB0', fontSize: '13'},
				legend: {'position': 'none'},

			};

			for (i=0; i <chartsData.length; i++){
				options.title = chartsData[i].circuitId;
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].circuitId));

				var chartData = google.visualization.arrayToDataTable([
					['Type', 'Count'],
					['Outage', chartsData[i].alarmsSeverity1],
					['Degradation', chartsData[i].alarmsSeverity2],
					['Non-Service Affecting', chartsData[i].alarmsSeverity3]
					]);

				chart.draw(chartData, options);
			};

		});

		$scope.drawCircuitMetrics = function(customerNameId){
			//alert(circuitId);
			console.log(customerNameId);
		}

	}]);


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


