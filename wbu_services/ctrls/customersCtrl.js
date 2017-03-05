app.controller('customersController', [ '$scope', '$stateParams', '$state', '$interval', 'customersAlarmData', 'refreshPeriod',
	function($scope, $stateParams, $state, $interval, customersAlarmData, refreshPeriod) {

		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;

		$scope.serviceTypeId = serviceTypeId;
		$scope.serviceCatId = serviceCatId;

		$scope.currentPage = 1;
		$scope.itemsPerPage = 8;
		$scope.infoMessage = "";

		var data = [];		

		data = jsonPath(customersAlarmData, "$.customers." + serviceTypeId + ".*");

		if (data.length > 0 ) {

			$scope.dataWindow = data.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage));
		}
		else {
			
			$scope.infoMessage = "All " + serviceTypeId + " alarms cleared for " + serviceCatId + " service";			
		}

		$scope.totalItems = data.length;

		$scope.pageChanged = function() {
			console.log('Page changed to: ' + $scope.currentPage);
			$scope.dataWindow = data.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage));
		};

		$scope.$on('drawCustomerCharts', function(ngRepeatFinishedEvent) {

			var chartsData = []; 

			if (data.length > 0 ){

				chartsData = data.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage));			
			}

			var options = {
				'width':290,
				'height':209,
				colors: ['red', '#59b20a'],
				pieHole: 0.4,
				pieSliceText: 'percentage',
        		sliceVisibilityThreshold: 0.0001,
				pieSliceTextStyle: {color: 'Black', fontSize: '12', bold: true},
				titleTextStyle: { color: '#007DB0', fontSize: '13'},
				legend: {'position': 'bottom'},
				slices: { 1: {offset: 0.05}},
				tooltip: {
		          showColorCode: true,
		          text: 'percentage'
		       	},
				vAxis : {
					format: 'decimal'
				}
		       	
			};

			for (i=0; i <chartsData.length; i++){
				options.title = chartsData[i].customerName;
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].customerName));

				var chartData = google.visualization.arrayToDataTable([
					['Type', 'Count'],
					[chartsData[i].badCircuits.toString(), chartsData[i].badCircuits],
					[chartsData[i].goodCircuits.toString(), chartsData[i].goodCircuits]
					]);

				chart.draw(chartData, options);
			};

		});

		$scope.drawCircuitCharts = function(customerNameParam, serviceTypeParam){

			$state.go('circuits', {customerNameId: customerNameParam, serviceTypeId: serviceTypeParam, serviceCatId: serviceCatId});
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