app.controller('customersController', [ '$scope', '$stateParams', '$state', '$interval', 'customersAlarmData', 'refreshPeriod',
	function($scope, $stateParams, $state, $interval, customersAlarmData, refreshPeriod) {

		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;

		$scope.serviceTypeId = serviceTypeId;
		$scope.serviceCatId = serviceCatId;

		$scope.page = 1;
		$scope.itemsPerPage = 8;
		$scope.infoMessage = "";

		var data = [];		

		data = jsonPath(customersAlarmData, "$.customers." + serviceTypeId + ".*");

		if (data.length > 0) {
			$scope.chartsData = data;
			$scope.infoMessage = ""
		}
		else {
			$scope.infoMessage = "All alarms clear for " + serviceTypeId + " service.";
		}

		$scope.pageChanged = function() {
			// console.log('Customers Page changed to: ' + $scope.page);
		};

		$scope.drawCircuitCharts = function(customerNameParam, serviceTypeParam){
			$state.go('circuits', {customerNameId: customerNameParam, serviceTypeId: serviceTypeParam, serviceCatId: serviceCatId});
		};

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