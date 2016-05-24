angular.module('app.home.resident', ['ionic', 'util.shared'])

    .service('orderOpening', function() {
        return {
            id: -1,
            day: "",
            start: "",
            end: "",
            diff: -1,

            clear: function() {
                this.id = -1;
                this.day = "";
                this.start = "";
                this.end = "";
                this.diff = -1;
            }
        };
    })

    .service('orderCar', function(shared) {
        return {
            cars: shared.getUserCars(),
            selected: {
                id: -1,
                plate: ''
            },
            clear: function() {
                for (var _id in this.cars) {
                    this.cars[_id].checked = false;
                }

                this.selected = {
                    id: -1,
                    plate: ''
                };
            }
        };
    })

    .service('orderService', function(shared) {
        var _i = 0;
        var _temp = shared.getServices();
        var obj = {
            index: {},
            services: [],
            clear: function() {
                var charge = null;
                var addons = null;

                for (var _j = 0; _j < this.services.length; _j++) {
                    this.services[_j].checked = false;

                    charge = this.services[_j].charge;
                    addons = this.services[_j].addons;

                    if (charge) {
                        for (var i = 0; i < charge.length; i++) {
                            charge[i].amount = 1;
                        }
                    }

                    if (addons) {
                        for (var i = 0; i < addons.length; i++) {
                            addons[i].amount = 1;
                        }
                    }
                }
            }
        };

        for (var _id in _temp) {
            obj.index[_id] = _i;
            obj.services.push(_temp[_id]);
            _i++;
        }

        return obj;
    })

    .service('orderPayment', function(shared) {
        return {
            selected: {
                id: -1,
                account_number: ''
            },
            payments: shared.getUserPayments(),
            clear: function() {
                for (var _id in this.payments) {
                    this.payments[_id].checked = false;
                }

                this.selected = {
                    id: -1,
                    account_number: ''
                };
            }
        };
    })

    .service('order', function(shared) {
        return {
            price: 0,
            time: 0,
            getRealPrice: function() {
                if (this.price <= 0) {
                    return "";
                }

                var discount = shared.getUser().discount;

                if (discount > 0) {
                    return (this.price * 1.07 * 0.9).toFixed(2);
                } else {
                    return (this.price * 1.07).toFixed(2);
                }
            },
            getRealTime: function() {
                var hour = Math.floor(this.time / 60);
                var mins = this.time % 60;

                if (this.time <= 0) {
                    return "";
                } else if (hour < 1) {
                    return mins + " mins";
                } else if (hour < 2) {
                    return (hour + " hour ") + (mins === 0 ? "" : mins + " mins");
                } else {
                    return hour + " hours " + (mins === 0 ? "" : mins + " mins");
                }
            },
            clear: function() {
                this.price = 0;
                this.time = 0;
            }
        };
    })

    .service('orderAddon', function(order) {
        return {
            addons: {},
            add: function(addons) {
                for (var i = 0; i < addons.length; i++) {
                    if (addons[i].name in this.addons) {
                        this.addons[addons[i].name].count += 1;
                    } else {
                        this.addons[addons[i].name] = {
                            count: 0,
                            addon: null
                        };
                        this.addons[addons[i].name].count = 1;
                        this.addons[addons[i].name].checked = false;
                        this.addons[addons[i].name].addon = addons[i];
                    }
                }
            },
            remove: function(addons) {
                for (var i = 0; i < addons.length; i++) {
                    if (addons[i].name in this.addons) {
                        this.addons[addons[i].name].count -= 1;

                        if (this.addons[addons[i].name].count <= 0) {
                            if (this.addons[addons[i].name].checked) {
                                order.price -= this.addons[addons[i].name].addon.price * this.addons[addons[i].name].addon.amount;
                                order.time -= this.addons[addons[i].name].addon.time;
                                this.addons[addons[i].name].addon.amount = 1;
                            }

                            delete this.addons[addons[i].name];
                        }
                    }
                }
            },
            clear: function() {
                this.addons = {};
            }
        };
    })

    .service('demandOrder', function($interval) {
        return {
            services: [],
            interval: null,
            clear: function() {
                if (this.interval) {
                    $interval.cancel(this.interval);
                }

                this.services = [];
                this.interval = null;
            }
        };
    })

    .config(function($stateProvider) {

        $stateProvider

            .state('menu.home.demand', {
                url: '/resident/demand',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/demand/index.html'
                    }
                }
            })

            .state('menu.home.demandOrder', {
                url: '/resident/demand/order',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/demand/order.html'
                    }
                }
            })

            .state('menu.home.reservation', {
                url: '/resident/reservation',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/reservation/index.html'
                    }
                }
            })

            .state('menu.home.residentCar', {
                url: '/resident/reservation/car',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/car.html'
                    }
                }
            })

            .state('menu.home.residentService', {
                url: '/resident/reservation/service',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/service.html'
                    }
                }
            })

            .state('menu.home.residentAddon', {
                url: '/resident/reservation/addon',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/addon.html'
                    }
                }
            })

            .state('menu.home.residentPayment', {
                url: '/resident/reservation/payment',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/payment.html'
                    }
                }
            });
    })

    .controller('navigationCtrl', function($scope, $state, $ionicModal, shared) {
        var user = shared.getUser();

        $scope.showEditUser = function() {
            $ionicModal.fromTemplateUrl('templates/setting/user.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.editUserModal = modal;
                $scope.editUserModal.show();
            });
        };

        $scope.gotoOnDemand = function() {
            if (!user.first || !user.phone) {
                $scope._egobie = "menu.home.demand";
                $scope.showEditUser();
            } else {
                $state.go("menu.home.demand");
            }
        };

        $scope.gotoReservation = function() {
            if (!user.first || !user.phone) {
                $scope._egobie = "menu.home.reservation";
                $scope.showEditUser();
            } else {
                $state.go("menu.home.reservation");
            }
        };
    });
