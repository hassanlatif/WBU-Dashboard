
app.controller('circuitMetricsController', [ '$scope', '$stateParams', '$state', '$interval', 'circuitMetricsData', 
	function($scope, $stateParams, $state, $interval, circuitMetricsData) {

		var serviceCatId = $stateParams.serviceCatId;
		var serviceTypeId = $stateParams.serviceTypeId;		
		var customerNameId = $stateParams.customerNameId;		
		var circuitId = $stateParams.circuitId;

		$scope.serviceCatId = serviceCatId;
		$scope.serviceTypeId = serviceTypeId;
		$scope.customerNameId = customerNameId;
		$scope.circuitId = circuitId;

		var gaugesData =  jsonPath(circuitMetricsData, "$.metrics." + circuitId)[0];

		///Availability Gauge///
		var availabilityVal = google.visualization.arrayToDataTable([
			['Label', 'Value'],
			['Availability', gaugesData.Availability],
			]);

		var availabilityOpts = {
			width: 200, height: 200,
			greenFrom: 95, greenTo: 100,
			yellowFrom:90, yellowTo: 95,
			redFrom: 0, redTo: 90,
			minorTicks: 5,
		};

		var chart = new google.visualization.Gauge(document.getElementById('availability_gauge'));
		chart.draw(availabilityVal, availabilityOpts);		

		///Capacity Gauge///
		var capacityVal = google.visualization.arrayToDataTable([
			['Label', 'Value'],
			['Capacity', gaugesData.Capacity],
			]);

		var capacityOpts = {
			width: 200, height: 200,
			greenFrom: 95, greenTo: 100,
			yellowFrom:90, yellowTo: 95,
			redFrom: 0, redTo: 90,
			minorTicks: 5,
		};

		var chart = new google.visualization.Gauge(document.getElementById('capacity_gauge'));
		chart.draw(capacityVal, capacityOpts);		

		///Total Packet Drop Gauge///
		var totalPacketDropVal = google.visualization.arrayToDataTable([
			['Label', 'Value'],
			['Capacity', gaugesData.TotalPacketDrop],
			]);

		var totalPacketDropOpts = {
			width: 200, height: 200,
			greenFrom: 95, greenTo: 100,
			yellowFrom:90, yellowTo: 95,
			redFrom: 0, redTo: 90,
			minorTicks: 5,
		};

		var chart = new google.visualization.Gauge(document.getElementById('totalPacketDrop_gauge'));
		chart.draw(totalPacketDropVal, totalPacketDropOpts);		

		///Total Error In Gauge///
		var totalErrorInVal = google.visualization.arrayToDataTable([
			['Label', 'Value'],
			['Capacity', gaugesData.TotalErrorIN],
			]);

		var totalErrorInOpts = {
			width: 200, height: 200,
			greenFrom: 95, greenTo: 100,
			yellowFrom:90, yellowTo: 95,
			redFrom: 0, redTo: 90,
			minorTicks: 5,
		};

		var chart = new google.visualization.Gauge(document.getElementById('totalErrorIn_gauge'));
		chart.draw(totalErrorInVal, totalErrorInOpts);		

		$interval(function () {

			$state.reload(); 

		}, 300000);


	}]);
