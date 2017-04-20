app.controller('servicesController', ['$scope','$stateParams', '$state', '$interval', 'servicesAlarmData', 'refreshPeriod',
	function($scope, $stateParams, $state, $interval, servicesAlarmData, refreshPeriod) {

		var customerNameId = $stateParams.customerNameId;
		$scope.customerNameId = customerNameId;

		$scope.infoMessage = "";
		console.log("customerNameId", customerNameId);

		var data = [];
		data = jsonPath(servicesAlarmData, "$.customers.*.[?(@.customerName == \""+ customerNameId +"\")]");

		if (data.length > 0) {
			$scope.chartsData = data;
			$scope.infoMessage = ""
		}
		else {
			$scope.infoMessage = "All alarms clear for " + serviceCat + " service.";
		}

		$scope.pageChanged = function() {
			// console.log('Services Page changed to: ' + $scope.page);
		};

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