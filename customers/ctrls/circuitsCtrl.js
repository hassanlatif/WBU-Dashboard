
app.controller('circuitsController', [ '$scope', '$stateParams', '$state', '$interval', 'circuitsAlarmData',
	function($scope, $stateParams, $state, $interval, circuitsAlarmData) {

		var customerNameId = $stateParams.customerNameId;
		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;

		$scope.serviceCatId = serviceCatId;
		$scope.serviceTypeId = serviceTypeId;
		$scope.customerNameId = customerNameId;

		$scope.currentPage = 1;
		$scope.itemsPerPage = 4;
		$scope.infoMessage = "";

		var data = [];

		data =  jsonPath(circuitsAlarmData, "$.circuits." + customerNameId + "[?(@.serviceType == " + "'" + serviceTypeId + "')]");
		
		if (data.length > 0 ) {

			$scope.dataWindow = data.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage));
		}
		else {

			$scope.infoMessage = "All " + serviceTypeId + " alarms cleared for " + customerNameId;			
		}

		$scope.totalItems = data.length;

		$scope.pageChanged = function() {
			console.log('Page changed to: ' + $scope.currentPage);
			$scope.dataWindow = data.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage));
		};


		$scope.$on('drawCircuitMetrics', function(ngRepeatFinishedEvent) {

			var chartsData = []; 

			if (data.length > 0 ){

				chartsData = data.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage));			
			}

			var options = {
				'width':320,
				'height':260,
				//colors: ['#59b20a', 'red', 'orange'],
				colors: ['#59b20a', 'red', 'orange', 'yellow', 'blue', 'grey'],
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
					['Clear', chartsData[i].alarmsClear],
					['Critical', chartsData[i].alarmsCritical],
					['Major', chartsData[i].alarmsMajor],
					['Minor', chartsData[i].alarmsMinor],
					['Warning', chartsData[i].alarmsWarning],
					['Indeterminate', chartsData[i].alarmsIndeterminate]
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

		var periodicRefresh = $interval(function () {
			$state.reload(); 
		}, 60000);


		$scope.$on('$destroy', function() {
			$interval.cancel(periodicRefresh);
		});


	}]);
