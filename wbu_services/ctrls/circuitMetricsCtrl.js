
app.controller('circuitMetricsController', [ '$scope', '$stateParams', '$state', '$interval', 'circuitMetricsData', 'refreshPeriod',
	function($scope, $stateParams, $state, $interval, circuitMetricsData, refreshPeriod) {
		
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
		$scope.iFrameURL = "https://172.21.24.173:16311/ibm/console/webtop/eventviewer/eventViewer.jsp?sql=%22TNSQM_ResourceName%20like%20%27" + circuitId + "%27%22&transientname=All&viewname=All&viewtype=global&datasource=NCOMS";

		console.log($scope.iFrameURL);

		var gaugesData = jsonPath(circuitMetricsData, "$.metrics." + circuitId)[0];

		console.log(gaugesData);

		$scope.gaugesDataStatus =  gaugesData;

		if (gaugesData) {

			drawCircuitMetrics();
			$scope.port = gaugesData.port;
			$scope.slot = gaugesData.slot;
			$scope.ni = gaugesData.ni;		
			$scope.capacity = gaugesData.capacity;	
		}
		else {

			$scope.infoMessage = "Alarm cleared for " + circuitId ;						
		}

		function drawCircuitMetrics() {

			///Availability Gauge///
			var availabilityV = NaN;
			var availabilityF = "N/A";
			if (gaugesData.availability != null)
			{
				availabilityV = gaugesData.availability;
				availabilityF = availabilityV;
			}
			var availabilityVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Availability (%)', {v: availabilityV, f: availabilityF}]
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
			var capacityV = NaN;
			var capacityF = "N/A";
			if (gaugesData.capacity != null && gaugesData.totalBpsAvail != null) {

				capacityV = +(((gaugesData.trafficIn/gaugesData.capacity)*100).toFixed(2));
				capacityF = capacityV;
			}


			var capacityVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Utilization (%)', {v: capacityV, f: capacityF}]
				]);

			var capacityOpts = {
				width: 170, height: 170,				
				greenFrom:0, greenTo: 33.33,		
				yellowFrom:33.33, yellowTo: 66.66,	
  		        redFrom: 66.66, redTo: 100,
				minorTicks: 10,
				max: 100, min: 0
			};

			var chart = new google.visualization.Gauge(document.getElementById('capacity_gauge'));
			chart.draw(capacityVal, capacityOpts);		

			///Total Packet Drop Gauge///
			var packetDropV = NaN;
			var packetDropF = "N/A";
			if (gaugesData.totalPacketDrop != null)
			{
				packetDropV = gaugesData.totalPacketDrop;
				packetDropF = packetDropV;
			}
			var totalPacketDropVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Packet Drop (pkt/s)', {v: packetDropV, f: packetDropF}]
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
			var totalErrorINV = NaN;
			var totalErrorINF = "N/A";
			if (gaugesData.totalErrorIn != null)
			{
				totalErrorINV = gaugesData.totalErrorIn;
				totalErrorINF = totalErrorINV;
			}
			var totalErrorInVal = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Error In (%)', {v: totalErrorINV, f: totalErrorINF}]
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
	        	title: "Number of Tickets:",
				titleTextStyle: {
					color: '#501F6E',
					fontName: 'Calibri',
					fontSize: 17,
					bold: true
				},
	        	width: 270,
	        	height: 170,
	        	bar: {groupWidth: "75%"},
	        	legend: { position: "none" },
				backgroundColor: 'White',
                vAxis: {
						minValue:0,
                        viewWindow: {
							min: 0
                        }
                }
				//colors: ['#e0440e', '#e6693e', '#ec8f6e']
      		};

			var barChart = new google.visualization.ColumnChart(document.getElementById("tickets_chart"));
      		barChart.draw(ticketsVal, ticketsOpts);

		}


		var currentRefreshTime = refreshPeriod.syncDateTime.currentDateTime;
		var nextRefreshTime = refreshPeriod.syncDateTime.nextDateTime;
		var nextRefreshPeriod = 60; //Math.floor((nextRefreshTime - new Date().getTime())/1000);

		$scope.refreshDate = new Date(currentRefreshTime);
		$scope.counter = nextRefreshPeriod;

		var periodicRefresh = $interval(function () {
			$state.reload(); 
		}, nextRefreshPeriod * 1000);

		var counterInterval = $interval(function(){
			$scope.counter--;
		}, 1000);

		$scope.$on('$destroy', function() {
			$interval.cancel(periodicRefresh);
			$interval.cancel(counterInterval);
		});


}]);
