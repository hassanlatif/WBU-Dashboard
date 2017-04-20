app.controller('servicesController', ['$scope','$stateParams', '$state', '$interval', '$timeout', 'servicesAlarmData', 'refreshPeriod',
	function($scope, $stateParams, $state, $interval, $timeout, servicesAlarmData, refreshPeriod) {

		var serviceCatOptions = {
			"All" : 0,
			"Voice" : 0,
			"Data" : 0,
			"Capacity" : 0
		};

		var serviceCat = $stateParams.serviceCatId;

		if (serviceCat == 'Voice')
			serviceCatOptions.Voice = 1;
		else if (serviceCat == 'Data')
			serviceCatOptions.Data = 1;
		else if (serviceCat == 'Capacity')
			serviceCatOptions.Capacity = 1;
		else 
			serviceCatOptions.All = 1;

		$scope.serviceCatOptions = serviceCatOptions;

		$scope.selectServiceCat = function(serviceCatParam) {
			$state.go('services', {serviceCatId: serviceCatParam})
		};

		$scope.infoMessage = "";
		var data = [];

		data = jsonPath(servicesAlarmData, "$.services." + serviceCat + ".*");

		if (data.length > 0) {
			$scope.chartsData = data;
			$scope.infoMessage = ""
		}
		else {
			$scope.infoMessage = "All alarms clear for " + serviceCat + " service.";
		}

		$scope.drawCustomerCharts = function(serviceTypeId){

			$state.go('customers', {serviceTypeId: serviceTypeId, serviceCatId: serviceCat});
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