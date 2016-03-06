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
    $scope.days = [];
    for(var i = 0; i < 7; i++) {
        var d = moment().add(i, 'days');
        $scope.days.push({
            day: d.format('D'),
            month: d.format('MMMM'),
            selected: i == 0,
            title: 'Нет заказа',
            items: []
        });
    }

    $scope.calcCost = function(day){
        var cost = 0;
        _.each(day.items, function(item){
            cost += item.price;
        });
        return cost;
    };

    $scope.selectDay = function(day){
        _.each($scope.days, function(d){
            d.selected = false;
        });
        day.selected = true;
    }



});