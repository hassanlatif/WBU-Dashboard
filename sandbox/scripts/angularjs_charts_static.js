google.load('visualization', '1', {packages:['corechart']});

var app = angular.module('app', []);

app.controller('appController', function($scope) {

	var chartsData = [{
		id: 'chart_1',
		value: 'piechart1'
	}, {
		id: 'chart_2',
		value: 'piechart2'
	},{
		id: 'chart_3',
		value: 'piechart3'
	}, {
		id: 'chart_4',
		value: 'piechart4'
	},{
		id: 'chart_5',
		value: 'piechart3'
	}, {
		id: 'chart_6',
		value: 'piechart4'
	}];

	$scope.data = chartsData;
			// Create the data table.
			var chartData = new google.visualization.DataTable();
			chartData.addColumn('string', 'Circuits');
			chartData.addColumn('number', 'NumCircuits');
			chartData.addRows([
				['Outage', 3],
				['Degradation', 1],
				['Non-Service Affecting', 3]
				]);

		// Set chart options
		var options = {
			'title':'serviceName',
			'width':320,
			'height':260,
			colors: ['red', 'orange', '#59b20a'],
			pieHole: 0.4,
			pieSliceTextStyle: {color: 'white', fontSize: '11'},
			titleTextStyle: { color: '#007DB0', fontSize: '13'},
			legend: {'position': 'none'},

		};

		$scope.drawServicesChart = function(){

			for (i=0; i <chartsData.length; i++){
				var chart = new google.visualization.PieChart(document.getElementById(chartsData[i].id));
				chart.draw(chartData, options);
			}

		}


		$scope.drawCustomerCharts = function(customerId){

			alert(customerId);
		}


	});

