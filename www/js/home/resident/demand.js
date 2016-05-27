angular.module('app.home.resident.demand', ['ionic', 'app.home.resident', 'util.shared', 'util.url'])

    .controller('demandCtrl', function($scope, $state, $http, shared, url,
            orderService, orderCar, orderPayment, orderOpening, orderAddon, order, demandOrder) {
        shared.goOndemand();

        $scope.services = orderService.services;
        $scope.getTime = shared.getTime;

        $scope.selectService = function() {
            shared.openService();
            $state.go('menu.home.residentService');
        };

        $scope.unselectService = function($event, service) {
            shared.unselectService(service.id);

            if (service.id in orderService.index) {                
                orderService.services[orderService.index[service.id]].checked = false;
            }
        };

        $scope.gotoDemandOrder = function() {
            for (var i in $scope.services) {
                if ($scope.services[i].checked) {
                    demandOrder.services.push($scope.services[i].id);
                }
            }

            if (demandOrder.services.length === 0) {
                shared.alert("Please choose services");
                return;
            }

            shared.showLoading();
            $http
                .post(url.ondemand, shared.getRequestBody({
                    services: demandOrder.services
                }))
                .success(function(data, status, headers, config) {
                    orderOpening.id = data["id"];
                    orderOpening.day = data["day"];
                    orderOpening.start = shared.getTime(data["start"]);
                    orderOpening.end = shared.getTime(data["end"]);
                    orderOpening.diff = data["diff"];

                    $state.go("menu.home.demandOrder");
                })
                .error(function(data, status, headers, config) {
                    if (data === "NO") {
                        shared.hideLoading();
                        shared.alert("Not Available");
                    }
                });
        };

        $scope.gotoDemand = function() {
            demandOrder.clear();
            orderOpening.clear();
            order.clear();
            $scope.$ionicGoBack();
        };

        $scope.goHome = function() {
            demandOrder.clear();
            orderService.clear();
            orderAddon.clear();
            orderCar.clear();
            orderPayment.clear();
            orderOpening.clear();
            order.clear();
            $scope.$ionicGoBack();
        };
    })

    .controller('demandOrderCtrl', function($scope, orderService, order) {
        order.clear();

        for (var i in orderService.services) {
            if (orderService.services[i].checked) {
                order.price += orderService.services[i].price;
                order.time += orderService.services[i].time;
            }
        }

        $scope.order = order;
    })

    .controller('demandOpeningCtrl', function($scope, $http, $interval, shared, url,
            orderOpening, demandOrder) {
        $scope.opening = orderOpening;

        $scope.$on('$destroy', function() {
            if (demandOrder.interval) {
                $interval.cancel(demandOrder.interval);
            }
        });

        demandOrder.interval = $interval(function() {
            $http
                .post(url.ondemand, shared.getRequestBody({
                    services: demandOrder.services
                }))
                .success(function(data, status, headers, config) {
                    orderOpening.id = data["id"];
                    orderOpening.day = data["day"];
                    orderOpening.start = shared.getTime(data["start"]);
                    orderOpening.end = shared.getTime(data["end"]);
                    orderOpening.diff = data["diff"];

                    $scope.opening = orderOpening;
                })
                .error(function(data, status, headers, config) {
                    if (data === "NO") {
                        $scope.gotoDemand();
                        shared.alert("Not Available");
                    }
                });
        }, 30000);
    });
