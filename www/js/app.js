var app = angular.module('Template', []);

app.controller('MainController', function($scope, $http){

    $scope.currentNav = 1;
    var navMap = {
        1: [],
        2: [1],
        3: [1,2],
        4: [1,2],
        5: [1,2,4]
    };

    $scope.types = [
        {id: 1, name: 'Обычное меню'},
        {id: 2, name: 'комбо-обеды'}
    ];
    $scope.currentType = $scope.types[0];

    /* load data */
    $scope.items = [];
    $scope.combo = [];
    $scope.categories = {};
    $http.get("data/items.json").then(function(res){
        $scope.items = res.data.items;
        $scope.categories = res.data.categories;
        _.each(res.data.combo, function(combo){
            var line = _.map(combo, function(id){
                return _.findWhere($scope.items, {id: id});
            });
            $scope.combo.push(line);
        });
    });


    /* make days grid */
    moment.locale('ru');
    $scope.days = [];
    for(var i = 0; i < 7; i++) {
        var d = moment().add(i, 'days');
        $scope.days.push({
            day: d.format('D'),
            month: d.format('MMMM'),
            title: 'Нет заказа',
            savedPrice: 0,
            items: []
        });
    }
    $scope.active = $scope.days[0];

    $scope.calcCost = function(day){
        var cost = 0;
        _.each(day.items, function(item){
            cost += item.price;
        });
        return cost;
    };

    $scope.comboCost = function(items){
        var cost = 0;
        _.each(items, function(item){
            cost += item.price;
        });
        return cost;
    };
    $scope.comboWeight = function(items){
        var cost = 0;
        _.each(items, function(item){
            cost += item.weight;
        });
        return cost;
    };

    $scope.selectDay = function(day){
        $scope.active = day;
    };

    $scope.superClick = function(day){

    };

    $scope.add = function(item){
        $scope.active.items.push(angular.copy(item));
    };

    $scope.addCombo = function(items){
        _.each(items, $scope.add);
    };

    $scope.selectType = function(type){
        $scope.currentType = type;
    };

    $scope.navSelect = function(num){
        $scope.currentNav = num;
    };

    $scope.navClass = function(num){
        return {
            pointer: true,
            active: $scope.currentNav == num,
            complete: navMap[$scope.currentNav].indexOf(num) > -1
        }
    };

    $scope.removeItem = function(list, index){
        list.splice(index, 1);
    };

    $scope.orderButtonShow = function(type, day){

        var cost = $scope.calcCost(day);
        if(!cost)
            return false;

        if(type == 1) {
            return (day.savedPrice != cost || day.savedPrice == 0);
        } else {
            return !(day.savedPrice != cost || day.savedPrice == 0);
        }

    };

    $scope.order = function(day){
        day.savedPrice = $scope.calcCost(day);
    };    

    $scope.orderEnd = function(day){
        alert('Вы сделали заказ');
    }



});