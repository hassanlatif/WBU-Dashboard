google.load('visualization', '1', {packages:['corechart']});

var app = angular.module('app', ['ngRoute','app.directive.ngRepeatFinished']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
			// route for the home page
			.when('/', {
				templateUrl : 'pages/services.html',
				//controller  : 'appController' //to avoid calling twice
			}) //remove semi-colon when extending routes

			// route for the about page
			.when('/customers/:customerId', {
				templateUrl : 'pages/customers.html',
				controller  : 'customerController'
			});

			//$locationProvider.html5Mode(true); -- for pretty URLS


		}]);

app.controller('appController', ['$scope', '$location', '$http','$routeParams', '$route', '$window', 
	function($scope, $location, $http, $routeParams, $route, $window) {

	//var serviceCategories;
	//var servicesAlarms;

		serviceCat = '*';

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



$scope.drawCustomerCharts = function(customerId){
			//alert(customerId);
			$location.path('/customers/' + customerId);
		}

	}]);




app.controller('customerController', [ '$scope', '$location', '$routeParams', 
	function($scope, $location, $routeParams) {

		var chartsData = [{	id: 'circuit_1',value: 'customer1'}, { id: 'circuit_2',	value: 'customer2'},
		{id: 'circuit_3',value: 'customer3'}, {	id: 'circuit_4',value: 'customer4'},
		{id: 'circuit_5',value: 'customer5'	}];

		$scope.data = chartsData;
			// Create the data table.
			var chartData = new google.visualization.DataTable();
			chartData.addColumn('string', 'Circuits');
			chartData.addColumn('number', 'NumCircuits');
			chartData.addRows([
				['Outage', 3],
				['Degradation', 1],
				['Non-Service Affecting', 3]
				]);

		// Set chart options
		var options = {
			'title':'Customer Name 1',
			'width':320,
			'height':260,
			colors: ['red', 'orange', '#59b20a'],
			pieHole: 0.4,
			pieSliceTextStyle: {color: 'white', fontSize: '11'},
			titleTextStyle: { color: '#007DB0', fontSize: '13'},
			legend: {'position': 'none'},

		};

		$scope.$on('drawCustomerCharts', function(ngRepeatFinishedEvent) {
			//alert("Showing circuits for customer: " + $routeParams.customerId);

			for (i=0; i <chartsData.length; i++){
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].id));
				chart.draw(chartData, options);
			}
		});

		$scope.drawCircuitCharts = function(circuitId){
			//alert(circuitId);

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