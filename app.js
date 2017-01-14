google.load('visualization', '1', {packages:['corechart']});

var app = angular.module('app', ['ngRoute','app.directive.ngRepeatFinished']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
			// route for the home page
			.when('/', {
				templateUrl : 'views/services.html',
				//controller  : 'appController' //to avoid calling twice
			}) //remove semi-colon when extending routes
			.when('/customers/:serviceTypeId', {
				templateUrl : 'views/customers.html',
				controller  : 'customerController'
			})

			.when('/circuits/:customerNameId/:serviceTypeId', {
				templateUrl : 'views/circuits.html',
				controller  : 'circuitController'
			});

		//locationProvider.html5Mode(true); //for pretty URLS


		}]);

app.controller('appController', ['$scope', '$location', '$http','$routeParams', '$route',  
	function($scope, $location, $http, $routeParams, $route) {

	//var serviceCategories;
	//var servicesAlarms;
	$("#serviceCatSelector").prop( "disabled", false );
    var serviceCat = '*';

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


	$scope.selectServiceType = function(serviceCat) {


	 	if (serviceCat == 'Voice')
	 	{
	 		console.log('Voice');
	 		$('div[name=Voice]').show(); 
	 		$('div[name=Capacity]').hide(); 
	 		$('div[name=Data]').hide();

	 	}
	 	else if (serviceCat == 'Data')
	 	{
	 		console.log('Data');
	 		$('div[name=Voice]').hide(); 
	 		$('div[name=Capacity]').hide(); 
	 		$('div[name=Data]').show(); 	

	 	}
	 	else if (serviceCat == 'Capacity')
	 	{
	 		console.log('Capacity');
	 		$('div[name=Voice]').hide(); 
	 		$('div[name=Capacity]').show(); 
	 		$('div[name=Data]').hide();

	 	}
	 	else
	 	{
	 		console.log('All');
	 		$('div[name=Voice]').show(); 
	 		$('div[name=Capacity]').show(); 
	 		$('div[name=Data]').show();	 		
	 	}

	};

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
		$location.path('/customers/' + serviceTypeId);
	}

	}]);


app.controller('customerController', [ '$scope', '$location', '$routeParams', '$http',
	function($scope, $location, $routeParams, $http) {

		$("#serviceCatSelector").prop( "disabled", true );
		var serviceTypeId = $routeParams.serviceTypeId;
		console.log(serviceTypeId);

		$http.get('/json/customer_level_alarms.json')
		.success(function(data) {
			//angular.extend(_this, data);
			//========Need this to fetch data to call ng-repeat -- Need to replace multiple calls with factory =======//
			console.log(serviceTypeId);
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

		$scope.drawCircuitCharts = function(customerNameId, serviceTypeId){
			//alert(circuitId);
			//console.log(customerNameId);
			//console.log(serviceTypeId);
			$location.path('/circuits/' + customerNameId + '/' + serviceTypeId);
		}

	}]);



app.controller('circuitController', [ '$scope', '$location', '$routeParams', '$http',
	function($scope, $location, $routeParams, $http) {

		$("#serviceCatSelector").prop( "disabled", true );
		var customerNameId = $routeParams.customerNameId;
		var serviceTypeId = $routeParams.serviceTypeId;

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

		$scope.drawCircuitMetrics = function(circuitId){
			//alert(circuitId);
			console.log(circuitId);
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