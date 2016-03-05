var app = angular.module('Template', []);

app.controller('MainController', function($scope, $http){

    /* load data */
    $scope.items = [];
    $http.get("data/items.json").then(function(res){
        $scope.items = res.data.items;
        console.log("items data", $scope.items);
    });

    /* make days grid */
    moment.locale('ru');
    $scope.timeGrid = [];
    for(var i = 0; i < 7; i++) {
        var d = moment().add(i, 'days');
        $scope.timeGrid.push({
            day: d.format('DD'),
            month: d.format('MMMM'),
            today: i == 0
        });
    }





});