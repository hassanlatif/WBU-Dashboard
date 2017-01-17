app.controller('customersController', [ '$scope', '$stateParams', '$state', '$interval', 'customersAlarmData',
	function($scope, $stateParams, $state, $interval, customersAlarmData) {

		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;

		$scope.serviceTypeId = serviceTypeId;
		$scope.serviceCatId = serviceCatId;

		$scope.currentPage = 1;
		$scope.itemsPerPage = 4;
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
				'width':320,
				'height':260,
				colors: ['red', '#59b20a'],
				pieHole: 0.4,
				pieSliceTextStyle: {color: 'white', fontSize: '11'},
				titleTextStyle: { color: '#007DB0', fontSize: '13'},
				legend: {'position': 'none'},

			};

			for (i=0; i <chartsData.length; i++){
				options.title = chartsData[i].customerName;
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].customerName));

				var chartData = google.visualization.arrayToDataTable([
					['Type', 'Count'],
					['Bad circuits', chartsData[i].badCircuits],
					['Good circuits', chartsData[i].goodCircuits]
					]);

				chart.draw(chartData, options);
			};

		});

		$scope.drawCircuitCharts = function(customerNameParam, serviceTypeParam){
			console.log("customerNameParam", customerNameParam);
			console.log("serviceTypeParam", serviceTypeParam);
			$state.go('circuits', {customerNameId: customerNameParam, serviceTypeId: serviceTypeParam, serviceCatId: serviceCatId});
		}

		var periodicRefresh = $interval(function () {			
			console.log(" Customers refresh called."); //Test below with live data
			//$state.go('customers', {serviceTypeId: serviceTypeId, serviceCatId: serviceCatId});
			$state.reload(); 

		}, 60000);

		$scope.$on('$destroy', function() {
    		$interval.cancel(periodicRefresh);
		});

	}]);