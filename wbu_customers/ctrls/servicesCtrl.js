app.controller('servicesController', ['$scope','$stateParams', '$state', '$interval', 'servicesAlarmData',
	function($scope, $stateParams, $state, $interval, servicesAlarmData) {

		var customerNameId = $stateParams.customerNameId;
		$scope.customerNameId = customerNameId;

		$scope.infoMessage = "";
		var chartsData = [];

		chartsData = jsonPath(servicesAlarmData, "$.customers.*.[?(@.customerName == '"+ customerNameId +"')]");

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
				pieSliceTextStyle: {color: 'white', fontSize: '11'},
				titleTextStyle: { color: '#007DB0', fontSize: '13'},
				legend: {'position': 'none'},

			};

			for (i=0; i <chartsData.length; i++){
				options.title = chartsData[i].serviceType;
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].serviceType));

				var chartData = google.visualization.arrayToDataTable([
					['Type', 'Count'],
					['Bad circuits', chartsData[i].badCircuits],
					['Good circuits', chartsData[i].goodCircuits]
					]);

				chart.draw(chartData, options);
			};
		});

		$scope.drawCircuitsCharts = function(customerNameParam, serviceTypeParam){

			$state.go('circuits', {customerNameId:customerNameParam, serviceTypeId: serviceTypeParam});
		}

		var periodicRefresh = $interval(function () {
			$state.reload(); 
		}, 60000);


		$scope.$on('$destroy', function() {
			$interval.cancel(periodicRefresh);
		});


	}]);