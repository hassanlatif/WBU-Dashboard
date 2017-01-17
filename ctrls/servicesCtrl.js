app.controller('servicesController', ['$scope','$stateParams', '$state', '$interval', 'servicesAlarmData',
	function($scope, $stateParams, $state, $interval, servicesAlarmData) {

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

	var periodicRefresh = $interval(function () {
		$state.reload(); 
	}, 300000);


	$scope.$on('$destroy', function() {
		$interval.cancel(periodicRefresh);
	});


}]);