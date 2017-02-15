
app.controller('circuitMetricsController', [ '$scope', '$stateParams', '$state', '$interval', 'circuitMetricsData', 'RefreshPeriod',
	function($scope, $stateParams, $state, $interval, circuitMetricsData, RefreshPeriod) {

		var serviceCatId = $stateParams.serviceCatId;
		var serviceTypeId = $stateParams.serviceTypeId;		
		var customerNameId = $stateParams.customerNameId;		
		var circuitId = $stateParams.circuitId;
		var affectedCkts = $stateParams.affectedCkts;

		$scope.serviceCatId = serviceCatId;
		$scope.serviceTypeId = serviceTypeId;
		$scope.customerNameId = customerNameId;
		$scope.circuitId = circuitId;
		$scope.affectedCkts = affectedCkts;

		console.log("Total number of affected circuits: " + affectedCkts[0].circuitId);

		$scope.selectAffectedCkt = function(affectedCktParam) {
			$state.go('circuitMetrics', {circuitId: affectedCktParam})
		};

		$scope.infoMessage = "";

		$scope.iFrameURL = "/ibm/console/webtop/cgi-bin/WBUFilteredAEL.cgi?DS=NCOMS&VIEW=All&FILTER=TNSQM_ResourceName%20like%20:sq:" + circuitId + ":sq:";

		console.log($scope.iFrameURL);

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
				['Availability (%)', gaugesData.availability]
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
				['Capacity (bps)', capacityPercent]
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
				['Packet Drop (pkt/s)', gaugesData.totalPacketDrop]
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
				['Error In (%)', gaugesData.totalErrorIn]
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

			///Trouble Tickets Chart///
			var ticketsVal = google.visualization.arrayToDataTable([
          		['Severity', 'Tickets', { role: 'style' }],
          		['Outage', gaugesData.totalS1Tickets, '#DC3912'],
          		['Degradation', gaugesData.totalS2Tickets, '#FF9900'],
          		['Non-Affecting', gaugesData.totalS3Tickets, '#F9ED02']
        	]);


      		var ticketsOpts = {
	        	title: "Number of Trouble Tickets",
	        	width: 320,
	        	height: 170,
	        	bar: {groupWidth: "75%"},
	        	legend: { position: "none" },
				backgroundColor: 'White',
				//colors: ['#e0440e', '#e6693e', '#ec8f6e']
      		};

			var barChart = new google.visualization.ColumnChart(document.getElementById("tickets_chart"));
      		barChart.draw(ticketsVal, ticketsOpts);

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
