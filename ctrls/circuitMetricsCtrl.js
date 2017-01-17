
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

		$scope.infoMessage = "";

		$scope.iFrameURL = "https://172.21.24.118:16311/ibm/console/webtop/cgi-bin/SLAFilteredAEL.cgi?DS=NCOMS&VIEW=SLA_Dashboard&FILTER=TNSQM_ResourceName%20like%20:sq:"+ circuitId +":sq:";

		var gaugesData = jsonPath(circuitMetricsData, "$.metrics." + circuitId)[0];
		//console.log(gaugesData);

		if (gaugesData) {

			drawCircuitMetrics();
		}
		else {

			$scope.infoMessage = "Alarm cleared for " + circuitId ;						
		}

		function drawCircuitMetrics() {

			///Availability Gauge///
			var availabilityVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Availability', gaugesData.availability],
				]);

			var availabilityOpts = {
				width: 200, height: 200,
				redFrom: 95, redTo: 99.98,		
				yellowFrom:99.98, yellowTo: 99.99,						
				greenFrom: 99.99, greenTo: 100,
				minorTicks: 5
			};

			var chart = new google.visualization.Gauge(document.getElementById('availability_gauge'));
			chart.draw(availabilityVal, availabilityOpts);		

			///Capacity Gauge///
			var capacityVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Capacity', gaugesData.capacity],
				]);

			var capacityOpts = {
				width: 200, height: 200,
				greenFrom: 0, greenTo: 0.5,
				yellowFrom: 0.5, yellowTo: 1,
				redFrom: 1, redTo: 2,
				minorTicks: 5,
			};

			var chart = new google.visualization.Gauge(document.getElementById('capacity_gauge'));
			chart.draw(capacityVal, capacityOpts);		

			///Total Packet Drop Gauge///
			var totalPacketDropVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Packet Drop', gaugesData.totalPacketDrop],
				]);

			var totalPacketDropOpts = {
				width: 200, height: 200,
				greenFrom: 0, greenTo: 10,
				yellowFrom:10, yellowTo: 20,
				redFrom: 20, redTo: 30,
				minorTicks: 5,
			};

			var chart = new google.visualization.Gauge(document.getElementById('totalPacketDrop_gauge'));
			chart.draw(totalPacketDropVal, totalPacketDropOpts);		

			///Total Error In Gauge///
			var totalErrorInVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Error In', gaugesData.totalErrorIn],
				]);

			var totalErrorInOpts = {
				width: 200, height: 200,
				greenFrom: 0, greenTo: 0.5,
				yellowFrom: 0.5, yellowTo: 1,
				redFrom: 1, redTo: 2,
				minorTicks: 5,
			};

			var chart = new google.visualization.Gauge(document.getElementById('totalErrorIn_gauge'));
			chart.draw(totalErrorInVal, totalErrorInOpts);		

		}

		var periodicRefresh = $interval(function () {
			$state.reload(); 
		}, 60000);


		$scope.$on('$destroy', function() {
			$interval.cancel(periodicRefresh);
		});


}]);
