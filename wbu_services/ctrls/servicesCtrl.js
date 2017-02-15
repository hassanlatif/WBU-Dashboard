app.controller('servicesController', ['$scope','$stateParams', '$state', '$interval', '$timeout', 'servicesAlarmData', 'RefreshPeriod',
	function($scope, $stateParams, $state, $interval, $timeout, servicesAlarmData, RefreshPeriod) {

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
		else 
			serviceCatOptions.All = 1;

		$scope.serviceCatOptions = serviceCatOptions;

		$scope.selectServiceCat = function(serviceCatParam) {
			$state.go('services', {serviceCatId: serviceCatParam})
		};

		$scope.infoMessage = "";
		var chartsData = [];

		chartsData = jsonPath(servicesAlarmData, "$.services." + serviceCat + ".*");

		if (chartsData.length > 0) {
			$scope.data = chartsData;
			$scope.infoMessage = ""
		}
		else {
			$scope.infoMessage = "All alarms clear for " + serviceCat + " service.";
		}

		$scope.$on('drawServiceCharts', function(ngRepeatFinishedEvent) {

			var options = {
				'width':320,
				'height':260,
				colors: ['red', '#59b20a'],
				pieHole: 0.4,
				pieSliceText: 'value-and-percentage',
				sliceVisibilityThreshold: 0.0001,
				pieSliceTextStyle: {color: 'Black', fontSize: '12', bold: true},
				titleTextStyle: {color: '#007DB0', fontSize: '13'},
				legend: {'position': 'bottom'},
				slices: { 1: {offset: 0.05}},
				tooltip: {
					showColorCode: true,
					text: 'value-and-percentage'
				},
			};

			for (i=0; i <chartsData.length; i++){
				options.title = chartsData[i].serviceType;
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].serviceType));

				var chartData = google.visualization.arrayToDataTable([
					['Type', 'Count'],
					['Affected', chartsData[i].badCircuits],
					['Non-Affected', chartsData[i].goodCircuits]
					]);

				chart.draw(chartData, options);
			};
		});

		$scope.drawCustomerCharts = function(serviceTypeId){

			$state.go('customers', {serviceTypeId: serviceTypeId, serviceCatId: serviceCat});
		}

		var periodicRefresh = $interval(function () {
			$state.reload(); 
		}, RefreshPeriod * 1000);

		$scope.refreshDate = new Date();

		$scope.counter = RefreshPeriod; 	

		var counterInterval = $interval(function(){
			$scope.counter--;
		}, 1000);


		$scope.$on('$destroy', function() {
			$interval.cancel(periodicRefresh);
			$interval.cancel(counterInterval);
		});


	}]);