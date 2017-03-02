app.controller('servicesController', ['$scope','$stateParams', '$state', '$interval', 'servicesAlarmData', 'refreshPeriod',
	function($scope, $stateParams, $state, $interval, servicesAlarmData, refreshPeriod) {

		var customerNameId = $stateParams.customerNameId;
		$scope.customerNameId = customerNameId;

		$scope.infoMessage = "";
		var chartsData = [];
		console.log("customerNameId", customerNameId);


		chartsData = jsonPath(servicesAlarmData, "$.customers.*.[?(@.customerName == \""+ customerNameId +"\")]");

		if (chartsData.length > 0) {
			$scope.data = chartsData;	
			$scope.infoMessage = ""
		}
		else {
			$scope.infoMessage = "All alarms clear for " + customerNameId;
		}

		$scope.$on('drawServiceCharts', function(ngRepeatFinishedEvent) {

			var options = {
				'width':320,
				'height':260,
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
				options.title = chartsData[i].serviceType;
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].serviceType));

				var chartData = google.visualization.arrayToDataTable([
					['Type', 'Count'],
					['Affected', chartsData[i].badCircuits],
					['Non-Affected', chartsData[i].goodCircuits]
					]);

				chart.draw(chartData, options);
			};
		});

		$scope.drawCircuitsCharts = function(customerNameParam, serviceTypeParam){

			$state.go('circuits', {customerNameId:customerNameParam, serviceTypeId: serviceTypeParam});
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