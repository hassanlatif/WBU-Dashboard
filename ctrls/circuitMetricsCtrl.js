
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

		$scope.iFrameURL = "https://172.21.24.118:16311/ibm/console/webtop/cgi-bin/SLAFilteredAEL.cgi?DS=NCOMS&VIEW=SLA_Dashboard&FILTER=TNSQM_ResourceName%20like%20:sq:" + circuitId + ":sq:";

		var gaugesData = jsonPath(circuitMetricsData, "$.metrics." + circuitId)[0];
		//console.log(gaugesData);

		$scope.gaugesDataStatus =  gaugesData;

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
				['Availability', gaugesData.availability]
				]);

			var availabilityOpts = {
				width: 170, height: 170,				
				redFrom: 99.95, redTo: 99.98,		
				yellowFrom:99.98, yellowTo: 99.99,	
        		greenFrom: 99.99, greenTo: 100,
				minorTicks: 10, 
				max: 100, min: 99.97,
				animation:{
       			 duration: 1000,
     			   easing: 'out',
      			}
			};

			var chart = new google.visualization.Gauge(document.getElementById('availability_gauge'));
			chart.draw(availabilityVal, availabilityOpts);		

			///Capacity Gauge///
			var capacityPercent;

			if (gaugesData.capacity && gaugesData.totalBpsAvail) {

				capacityPercent = ((gaugesData.capacity/gaugesData.totalBpsAvail)*100);
			}

			console.log(capacityPercent);


			var capacityVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Capacity', capacityPercent]
				]);

			var capacityOpts = {
				width: 170, height: 170,				
				redFrom:97, redTo: 98,		
				yellowFrom:98, yellowTo: 99,	
  		        greenFrom: 99, greenTo: 100,
				minorTicks: 10,
				max: 100, min: 97
			};

			var chart = new google.visualization.Gauge(document.getElementById('capacity_gauge'));
			chart.draw(capacityVal, capacityOpts);		

			///Total Packet Drop Gauge///
			var totalPacketDropVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Packet Drop', gaugesData.totalPacketDrop]
				]);

			var totalPacketDropOpts = {
				width: 170, height: 170,				
				redFrom: 20, redTo: 30,		
				yellowFrom:10, yellowTo: 20,	
       		    greenFrom: 0, greenTo: 10,
				minorTicks: 10,
				max: 30, min: 0
			};

			var chart = new google.visualization.Gauge(document.getElementById('totalPacketDrop_gauge'));
			chart.draw(totalPacketDropVal, totalPacketDropOpts);		

			///Total Error In Gauge///
			var totalErrorInVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Error In', gaugesData.totalErrorIn]
				]);

			var totalErrorInOpts = {
				width: 170, height: 170,				
				redFrom: 1, redTo: 2,		
				yellowFrom:0.5, yellowTo: 1,	
	    	    greenFrom: 0, greenTo: 0.5,
				minorTicks: 10,
				max: 1.5, min: 0
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
