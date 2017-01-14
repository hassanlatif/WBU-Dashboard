google.load('visualization', '1', {packages:['corechart']});

var app = angular.module('app', ['ui.router','app.directive.ngRepeatFinished']);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.otherwise('/');
	$stateProvider
	.state('services', {
		url: '/',
		params: {
			serviceCatId: 'All'
		},
		templateUrl: 'views/services.html',
		controller: 'servicesController'
	})
	.state('customers', {
		url: '/customers',
		params: {
			serviceCatId: null,
			serviceTypeId: null
		},
		templateUrl: 'views/customers.html',
		controller: 'customersController'
	})
	.state('circuits', {
		url: '/circuits',
		params: {
			serviceCatId: null,
			serviceTypeId: null,
			customerNameId: null
		},
		templateUrl : 'views/circuits.html',
		controller  : 'circuitsController'      
	})
}]);

app.controller('servicesController', ['$scope', '$location', '$http','$stateParams', '$state',  
	function($scope, $location, $http, $stateParams, $state) {

	//var serviceCategories;
	//var servicesAlarms;
	var serviceCatOptions = {
		"All" : 0,
		"Voice" : 0,
		"Data" : 0,
		"Capacity" : 0
	};

	$("#serviceCatSelector").prop( "disabled", false );
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

	//console.log(serviceCat);
	$http.get('/json/service_level_alarms.json')
	.success(function(data) {
		//angular.extend(_this, data);
		//========Need this to fetch data to call ng-repeat -- Need to replace multiple calls with factory =======//
		//console.log(serviceCat);
		$scope.data = jsonPath(data, "$.services." + serviceCat + ".*");
		//console.log($scope.data);
		//defer.resolve(); // Find out the reason for using
	})
	.error(function() {
		console.log("Failed to fetch service alarms data.");
		//defer.reject('could not find someFile.json');
	});


	$scope.$on('drawServiceCharts', function(ngRepeatFinishedEvent) {

		//console.log(ngRepeatFinishedEvent);

		$http.get('/json/service_level_alarms.json')
		.success(function(data) {
			//angular.extend(_this, data);  <----
			var chartsData = jsonPath(data, "$.services."+serviceCat+".*");
			//console.log($scope.data);

			// Set chart options
			var options = {
				'width':320,
				'height':260,
				colors: ['red', 'orange', '#59b20a'],
				pieHole: 0.4,
				pieSliceTextStyle: {color: 'white', fontSize: '11'},
				titleTextStyle: { color: '#007DB0', fontSize: '13'},
				legend: {'position': 'none'},

			};

			//alert(customerData);   <----
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

			//defer.resolve(); // Find out the reason for using
		})
		.error(function() {
			console.log("Failed to fetch data.");
		//defer.reject('could not find someFile.json');
	});

	});

	$scope.drawCustomerCharts = function(serviceTypeId){
			//alert(customerId);
		if (serviceCat == '*')  //Check with Hussain for All case
			serviceCat = 'All';

		$state.go('customers', {serviceTypeId: serviceTypeId, serviceCatId: serviceCat});
	}

}]);


app.controller('customersController', [ '$scope', '$location', '$http', '$stateParams', '$state',
	function($scope, $location, $http, $stateParams, $state) {

		$("#serviceCatSelector").prop( "disabled", true );

		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;
		$scope.serviceTypeId = serviceTypeId;
		$scope.serviceCatId = serviceCatId;
		//console.log(serviceTypeId);

		$http.get('/json/customer_level_alarms.json')
		.success(function(data) {
			//angular.extend(_this, data);
			//========Need this to fetch data to call ng-repeat -- Need to replace multiple calls with factory =======//
			$scope.data = jsonPath(data, "$.customers." + serviceTypeId + ".*");
			console.log($scope.data);
			//defer.resolve(); // Find out the reason for using
		})
		.error(function() {
			console.log("Failed to fetch service alarms data.");
			//defer.reject('could not find someFile.json');
		});		

		$scope.$on('drawCustomerCharts', function(ngRepeatFinishedEvent) {
				//alert("Showing circuits for customer: " + $routeParams.customerId);

				$http.get('/json/customer_level_alarms.json')
				.success(function(data) {
				//angular.extend(_this, data);  <----
				var chartsData = jsonPath(data, "$.customers." + serviceTypeId + ".*");
				//console.log(chartsData);

				// Set chart options
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

				//defer.resolve(); // Find out the reason for using
			})
				.error(function() {
					console.log("Failed to fetch data.");
			//defer.reject('could not find someFile.json');
		});
			});

		$scope.drawCircuitCharts = function(customerNameParam, serviceTypeParam){
			//alert(circuitId);
			//console.log(customerNameId);
			//console.log(serviceTypeId);
			$state.go('circuits', {customerNameId: customerNameParam, serviceTypeId: serviceTypeParam, serviceCatId: serviceCatId});
		}

	}]);



app.controller('circuitsController', [ '$scope', '$location','$http', '$stateParams', '$state',
	function($scope, $location, $http, $stateParams, $state) {

		$("#serviceCatSelector").prop( "disabled", true );
		var customerNameId = $stateParams.customerNameId;
		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;

		$scope.serviceCatId = serviceCatId;
		$scope.serviceTypeId = serviceTypeId;
		$scope.customerNameId = customerNameId;

		$http.get('/json/circuit_level_alarms.json')
		.success(function(data) {
			//angular.extend(_this, data);
			//========Need this to fetch data to call ng-repeat -- Need to replace multiple calls with factory =======//
			//console.log(serviceTypeId);
			$scope.data = jsonPath(data, "$.circuits." + customerNameId + "[?(@.serviceType == " + "'" + serviceTypeId + "')]");

			//str = "$.circuits." + customerNameId + "[?(@.serviceType == " + "'" + serviceTypeId + "')]";

			console.log($scope.data);
			//console.log(str);
			//defer.resolve(); // Find out the reason for using
		})
		.error(function() {
			console.log("Failed to fetch service alarms data.");
			//defer.reject('could not find someFile.json');
		});		

		$scope.$on('drawCircuitMetrics', function(ngRepeatFinishedEvent) {
				//alert("Showing circuits for customer: " + $routeParams.customerId);

				$http.get('/json/circuit_level_alarms.json')
				.success(function(data) {
				//angular.extend(_this, data);  <----
				var chartsData = jsonPath(data, "$.circuits." + customerNameId + "[?(@.serviceType == " + "'" + serviceTypeId + "')]");
				console.log(chartsData);

				// Set chart options
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

				//defer.resolve(); // Find out the reason for using
			})
				.error(function() {
					console.log("Failed to fetch data.");
			//defer.reject('could not find someFile.json');
		});
			});

		$scope.drawCircuitMetrics = function(customerNameId){
			//alert(circuitId);
			console.log(customerNameId);
			//$location.path('/circuits/' + customerNameId + '/' + serviceTypeId);
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