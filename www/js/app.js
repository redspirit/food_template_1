var app = angular.module('Template', []);

app.controller('MainController', function($scope, $http){

    $scope.currentNav = 1;
    var navMap = {
        1: [],
        2: [1],
        3: [1,2],
        4: [1,2],
        5: [1,2,4],
        6: [1,2,4,5],
        7: [1,2,3]
    };

    $scope.navMap = {
        1: [
            {type: 'soup', next: 2, showIn: 1},
            {type: 'salad', next: 2, showIn: 1}
        ],
        2: [
            {type: 'soup', next: 4, showIn: 2},
            {type: 'salad', next: 4, showIn: 2}
        ],
        4: [
            {type: 'second', next: 5, showIn: 4},
            {type: 'separate', next: 7, final: true, showIn: 3}
        ],
        5: [
            {type: 'garnish', next: 6, final: true, showIn: 5}
        ]
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
    $scope.prepareCategories = [];
    $http.get("data/items.json").then(function(res){
        $scope.items = res.data.items;
        $scope.categories = res.data.categories;
        //_.each(res.data.combo, function(combo){
        //    var line = _.map(combo, function(id){
        //        return _.findWhere($scope.items, {id: id});
        //    });
        //    $scope.combo.push(line);
        //});

        _.each($scope.navMap, function(rule, step){
            _.each(rule, function(ruleItem){
                $scope.prepareCategories.push({
                    step: parseInt(step),
                    type: ruleItem.type,
                    showIn: ruleItem.showIn,
                    next: ruleItem.next,
                    final: ruleItem.final,
                    name: $scope.categories[ruleItem.type]
                });
            });
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
            items: [],
            comboStack: {},
            comboList: [],
            comboTotal: 0
        });
    }
    $scope.active = $scope.days[0];

    $scope.calcCost = function(day){
        var cost = day.comboTotal;
        _.each(day.items, function(item){
            cost += item.price;
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
    };

    $scope.comboNext = function(item, cat){

        //console.log("item", item);
        console.log("cat", cat);

        $scope.active.comboStack[cat.showIn] = item;
        if(cat.showIn == 4)
            delete $scope.active.comboStack[3];
        if(cat.showIn == 3) {
            delete $scope.active.comboStack[4];
            delete $scope.active.comboStack[5];
        }

        $scope.currentNav = cat.next;

        if(cat.final)
            console.log('Final');

    };

    $scope.comboTotal = function(stack){
        var total = 0;
        _.each(stack, function(val, key){
            total += val.price;
        });
        return total;
    };
    $scope.comboWeight = function(stack){
        var cost = 0;
        _.each(stack, function(val, key){
            cost += val.weight;
        });
        return cost;
    };
    $scope.addCombo = function(stack){
        $scope.active.comboList = [];
        _.each(stack, function(val, key){
            $scope.active.comboList.push(val);
        });
        $scope.active.comboTotal = $scope.comboTotal(stack);
    };
    $scope.comboClear = function(day){
        day.comboList = [];
        day.comboStack = {};
        day.comboTotal = 0;
        $scope.currentNav = 1;
    };

});