
app.controller('circuitsController', [ '$scope', '$stateParams', '$state', '$interval', 'circuitsAlarmData', 'refreshPeriod',
	function($scope, $stateParams, $state, $interval, circuitsAlarmData, refreshPeriod) {

		var customerNameId = $stateParams.customerNameId;
		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;

		$scope.serviceCatId = serviceCatId;
		$scope.serviceTypeId = serviceTypeId;
		$scope.customerNameId = customerNameId;

		$scope.currentPage = 1;
		$scope.itemsPerPage = 8;
		$scope.infoMessage = "";

		var data = [];

		console.log("customerNameId", customerNameId);
		console.log("serviceTypeId", serviceTypeId);

		data =  jsonPath(circuitsAlarmData, "$.circuits." + customerNameId + ".[?(@.serviceType == \""+ serviceTypeId + "\")]");		
		console.log("Data", data)


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
				'width':290,
				'height':206,
				//colors: ['#59b20a', 'red', 'orange'],
				colors: ['#59b20a', 'red', 'orange', 'yellow', 'blue', 'grey'],
				pieHole: 0.4,
				pieSliceText: 'value-and-percentage',
        		sliceVisibilityThreshold: 0.0001,
				pieSliceTextStyle: {color: 'Black', fontSize: '12', bold: true},
				titleTextStyle: { color: '#007DB0', fontSize: '13'},
				legend: {'position': 'right'},
				slices: { 1: {offset: 0.05}},
				tooltip: {
		          showColorCode: true,
		          text: 'value-and-percentage'
		       	},
				vAxis : {
					format: 'decimal'
				}
		       	

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
				circuitId: circuitIdParam,
				affectedCkts: data});
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
