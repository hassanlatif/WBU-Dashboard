app.controller('customersController', [ '$scope', '$stateParams', '$state', '$interval', 'customersAlarmData',
	function($scope, $stateParams, $state, $interval, customersAlarmData) {


		$scope.currentPage = 1;
		$scope.itemsPerPage = 12;
		$scope.infoMessage = "";

		var data = [];		

		data = jsonPath(customersAlarmData, "$.customers.*");

		if (data.length > 0 ) {

			$scope.dataWindow = data.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage));
		}
		else {
			
			$scope.infoMessage = "All alarms cleared for customers";			
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
				pieSliceText: 'value-and-percentage',
        		sliceVisibilityThreshold: 0.0001,
				pieSliceTextStyle: {color: 'Black', fontSize: '12', bold: true},
				titleTextStyle: { color: '#007DB0', fontSize: '13'},
				legend: {'position': 'bottom'},
				slices: { 1: {offset: 0.05}},
				tooltip: {
		          showColorCode: true,
		          text: 'value-and-percentage'
		       	},

			};

			for (i=0; i <chartsData.length; i++){
				options.title = chartsData[i].customerName;
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].customerName));

				var chartData = google.visualization.arrayToDataTable([
					['Type', 'Count'],
					['Affected', chartsData[i].badCircuits],
					['Non-Affected', chartsData[i].goodCircuits]
					]);

				chart.draw(chartData, options);
			};

		});

		$scope.drawCircuitCharts = function(customerNameParam){
			console.log('customerNameParam', customerNameParam);
			
			$state.go('services', {customerNameId: customerNameParam});
		}

		var periodicRefresh = $interval(function () {			
			//console.log(" Customers refresh called."); //Test below with live data
			//$state.go('customers', {serviceTypeId: serviceTypeId, serviceCatId: serviceCatId});
			$state.reload(); 

		}, 60000);

		$scope.$on('$destroy', function() {
    		$interval.cancel(periodicRefresh);
		});

	}]);