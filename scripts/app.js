google.load('visualization', '1', {packages:['corechart']});

var app = angular.module('app', ['ngRoute','app.directive.ngRepeatFinished']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'appController'
			}) //remove semi-colon when extending routes

			// route for the about page
			.when('/customers/:customerId', {
				templateUrl : 'pages/customers.html',
				controller  : 'customerController'
			});

		}]);

app.controller('appController', ['$scope', '$location', function($scope, $location) {

	var chartsData = [{
		id: 'customer_1',
		value: 'service1'
	}, {
		id: 'customer_2',
		value: 'service2'
	},{
		id: 'customer_3',
		value: 'service3'
	}, {
		id: 'customer_4',
		value: 'service4'
	},{
		id: 'customer_5',
		value: 'service5'
	}, {
		id: 'customer_6',
		value: 'service6'
	}];

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
			'title':'Service Name',
			'width':320,
			'height':260,
			colors: ['red', 'orange', '#59b20a'],
			pieHole: 0.4,
			pieSliceTextStyle: {color: 'white', fontSize: '11'},
			titleTextStyle: { color: '#007DB0', fontSize: '13'},
			legend: {'position': 'none'},

		};

		$scope.$on('drawServiceCharts', function(ngRepeatFinishedEvent) {

			for (i=0; i <chartsData.length; i++){
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].id));
				chart.draw(chartData, options);
			}
		});

		$scope.drawCustomerCharts = function(customerId){

			//alert(customerId);
			$location.path('/customers/' + customerId);
		}

	}]);




app.controller('customerController', [ '$scope', '$location', '$routeParams', 
	function($scope, $location, $routeParams) {

	var chartsData = [{
		id: 'circuit_1',
		value: 'customer1'
	}, {
		id: 'circuit_2',
		value: 'customer2'
	},{
		id: 'circuit_3',
		value: 'customer3'
	}, {
		id: 'circuit_4',
		value: 'customer4'
	},{
		id: 'circuit_5',
		value: 'customer5'
	}];

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
			'title':'Customer Name',
			'width':320,
			'height':260,
			colors: ['red', 'orange', '#59b20a'],
			pieHole: 0.4,
			pieSliceTextStyle: {color: 'white', fontSize: '11'},
			titleTextStyle: { color: '#007DB0', fontSize: '13'},
			legend: {'position': 'none'},

		};

		$scope.$on('drawCustomerCharts', function(ngRepeatFinishedEvent) {
			alert("Showing circuits for customer: " + $routeParams.customerId);

			for (i=0; i <chartsData.length; i++){
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].id));
				chart.draw(chartData, options);
			}
		});

		$scope.drawCircuitCharts = function(customerId){
			alert(customerId);

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