
app.controller('circuitsController', [ '$scope', '$stateParams', '$state', '$interval', 'circuitsAlarmData',
	function($scope, $stateParams, $state, $interval, circuitsAlarmData) {

		var customerNameId = $stateParams.customerNameId;
		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;

		$scope.serviceCatId = serviceCatId;
		$scope.serviceTypeId = serviceTypeId;
		$scope.customerNameId = customerNameId;

		var chartsData =  jsonPath(circuitsAlarmData, "$.circuits." + customerNameId + "[?(@.serviceType == " + "'" + serviceTypeId + "')]");
		$scope.data = chartsData;

		$scope.$on('drawCircuitMetrics', function(ngRepeatFinishedEvent) {

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

		});

		$scope.drawCircuitMetrics = function(circuitIdParam){

			//console.log(circuitIdParam);
			$state.go('circuitMetrics', {serviceCatId: serviceCatId, 
				serviceTypeId: serviceTypeId, 		
				customerNameId: customerNameId, 							
				circuitId: circuitIdParam});
		}


		$interval(function () {
			
			$state.reload(); 

		}, 300000);


	}]);
