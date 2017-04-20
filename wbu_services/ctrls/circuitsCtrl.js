	
app.controller('circuitsController', [ '$scope', '$stateParams', '$state', '$interval', 'circuitsAlarmData', 'refreshPeriod',
	function($scope, $stateParams, $state, $interval, circuitsAlarmData, refreshPeriod) {

		var customerNameId = $stateParams.customerNameId;
		var serviceTypeId = $stateParams.serviceTypeId;
		var serviceCatId = $stateParams.serviceCatId;

		$scope.serviceCatId = serviceCatId;
		$scope.serviceTypeId = serviceTypeId;
		$scope.customerNameId = customerNameId;

		$scope.page = 1;
		$scope.itemsPerPage = 8;
		$scope.infoMessage = "";

		var data = [];

		data =  jsonPath(circuitsAlarmData, "$.circuits." + customerNameId + ".[?(@.serviceType == \""+ serviceTypeId + "\")]");		

		if (data.length > 0 ) {

			$scope.chartsData = data;
			$scope.infoMessage = ""
		}
		else {

			$scope.infoMessage = "All " + serviceTypeId + " alarms cleared for " + customerNameId;			
		}

		$scope.pageChanged = function() {
			// console.log('Circuits Page changed to: ' + $scope.page);
		};


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
