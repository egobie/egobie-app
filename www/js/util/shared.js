angular.module("util.shared", ["util.url"])

    .service("shared", function($rootScope, $window, $ionicPopup, $ionicLoading, $http, $q, url) {
        var headers = {
            "Egobie-Id": "",
            "Egobie-Token": ""
        };

        var user = {
            id: "",
            token: "",
            username: "",
            email: "",
            coupon: "",
            phone: "",
            first: "",
            last: "",
            middle: "",
            home_state: "",
            home_city: "",
            home_zip: "",
            home_street: "",
            work_state: "",
            work_city: "",
            work_zip: "",
            work_street: ""
        };

        var states = {
            "AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas",
            "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia",
            "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii",
            "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky",
            "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts",
            "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana",
            "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico",
            "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio",
            "OK": "Oklahoma", "OR": "Oregon","PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island",
            "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
            "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
        };

        var colors = [
            'WHITE', 'BLACK', 'SILVER', 'GRAY', 'RED', 'BLUE', 'BROWN', 'YELLOW', 'GOLD', 'GREEN', 'PINK', 'OTHERS'
        ];

        var userCars = {};
        var userPayments = {};
        var userServices = [];
        var userHistories = {};
        var carMakers = [];
        var carModels = {};
        var services = {};

        var carWash = [];
        var oilChange = [];
        var detailing = [];

        var serviceNames = {
            "CAR_WASH": "Car Wash",
            "OIL_CHANGE": "Lube Service",
            "DETAILING": "Detailing"
        };

        // Email Reg
        var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var regCoupon = /^([A-Z0-9]{5})$/;

        var years = [];
        var _current_year = new Date().getFullYear();

        // 1999 - 2016
        for (var i = 1999; i <= _current_year; i++) {
            years.push(i);
        }

        $window.rootScopes = $window.rootScopes || [];
        $window.rootScopes.push($rootScope);

        if (!!$window.shared) {
            return $window.shared;
        }

        function refreshScope() {
            angular.forEach($window.rootScopes, function(scope) {
                if(!scope.$$phase) {
                    scope.$apply();
                }
            });
        }

        $window.shared = {
            minUsername: 5,
            maxUsername: 16,
            minPassword: 8,
            maxPassword: 20,

            refreshUser: function(u) {
                user.id = u.id;
                user.token = u.password;
                user.username = u.username;
                user.first = u.first_name;
                user.last = u.last_name;
                user.middle = u.middle_name;
                user.email = u.email;
                user.phone = u.phone_number;
                user.coupon = u.coupon;

                user.home_state = u.home_address_state;
                user.home_city = u.home_address_city;
                user.home_zip = u.home_address_zip;
                user.home_street = u.home_address_street;

                user.work_state = u.work_address_state;
                user.work_city = u.work_address_city;
                user.work_zip = u.work_address_zip;
                user.work_street = u.work_address_street;

                headers["Egobie-Id"] = user.id;
                headers["Egobie-Token"] = user.token;

                refreshScope();
            },

            refreshUserToken: function(token) {
                user.token = token;
                headers["Egobie-Token"] = user.token;
                refreshScope();
            },

            refreshHome: function(address) {
                user.home_state = address.state;
                user.home_city = address.city;
                user.home_zip = address.zip;
                user.home_street = address.street;

                refreshScope();
            },

            refreshWork: function(address) {
                user.work_state = address.state;
                user.work_city = address.city;
                user.work_zip = address.zip;
                user.work_street = address.street;

                refreshScope();
            },

            getUser: function() {
                return user;
            },

            getHeaders: function() {
                return headers;
            },

            getYears: function() {
                return years;
            },

            getStates: function() {
                return states;
            },

            getStateName: function(state) {
                return states[state];
            },

            getColors: function() {
                return colors;
            },

            addServices: function(data) {
                if (data) {
                    Array.prototype.forEach.call(data, function(service) {
                        service.basic = [];
                        service.free = [];
                        service.extra = [];
                        service.advance = [];

                        if (service.items) {
                            Array.prototype.forEach.call(service.items, function(item) {
                                if (item.startsWith("+++")) {
                                    service.advance.push(item.substring(3));
                                } else if (item.startsWith("++")) {
                                    service.extra.push(item.substring(2));
                                } else if (item.startsWith("+")){
                                    service.free.push(item.substring(1));
                                } else {
                                    service.basic.push(item);
                                }
                            });
                        }

                        services[service.id] = service;
                        // Used for selection
                        services[service.id].checked = false;

                        if (service.type === "CAR_WASH") {
                            carWash.push(service);
                        } else if (service.type === "OIL_CHANGE") {
                            oilChange.push(service);
                        } else if (service.type === "DETAILING") {
                            detailing.push(service);
                        }
                    });

                    console.log(services);
                }
            },

            getCarWashServices: function() {
                return carWash;
            },

            getOilChangeServices: function() {
                return oilChange;
            },

            getDetailingServices: function() {
                return detailing;
            },

            getServices: function() {
                return services;
            },

            getServiceNames: function() {
                return serviceNames;
            },

            getService: function(id) {
                return services[id];
            },

            getUserHistory: function(id) {
                var history = userHistories[id];

                if (history) {
                    var temp = {
                        start: history.start_time,
                        end: history.end_time,
                        price: history.price,
                        account_name: userPayments[history.user_payment_id]['account_name'],
                        account_number: userPayments[history.user_payment_id]['account_number'],
                        account_type: userPayments[history.user_payment_id]['account_type'],
                        plate: userCars[history.user_car_id]['plate'],
                        state: userCars[history.user_car_id]['state'],
                        year: userCars[history.user_car_id]['year'],
                        color: userCars[history.user_car_id]['color'],
                        maker: userCars[history.user_car_id]['maker'],
                        model: userCars[history.user_car_id]['model'],
                        services: []
                    };

                    Array.prototype.forEach.call(history.services, function(id) {
                        temp.services.push(services[id]);
                    });

                    return temp;
                }
            },

            getUserHistories: function() {
                return userHistories;
            },

            addUserHistories: function(histories) {
                if (histories) {
                    Array.prototype.forEach.call(histories, function(history) {
                        userHistories[history.id] = history;
                    });
                }
            },

            getUserServices: function() {
                return userServices;
            },

            addUserServices: function(services) {
                userServices = services;
            },

            getCarMakers: function() {
                return carMakers;
            },

            addCarMakers: function(makers) {
                carMakers = makers;
            },

            addCarModels: function(models) {
                if (models) {
                    Array.prototype.forEach.call(models, function(model) {
                        if (!carModels.hasOwnProperty(model.maker_id)) {
                            carModels[model.maker_id] = [];
                        }
                        carModels[model.maker_id].push(model);
                    });
                }
            },

            getCarModels: function(makerId) {
                return carModels[makerId] || [];
            },

            getUserCars: function() {
                return userCars;
            },

            addUserCars: function(cars) {
                if (cars) {
                    Array.prototype.forEach.call(cars, function(car) {
                        userCars[car.id] = car;
                    });
                }
            },

            addUserCar: function(car) {
                userCars[car.id] = car;
                // For selection use
                userCars[car.id].checked = false;
            },

            deleteUserCar: function(id) {
                delete userCars[id];
            },

            getUserPayments: function() {
                return userPayments;
            },

            addUserPayments: function(payments) {
                if (payments) {
                    Array.prototype.forEach.call(payments, function(payment) {
                        userPayments[payment.id] = payment;
                        // For selection use
                        userPayments[payment.id].checked = false;
                    });
                }
            },

            addUserPayment: function(payment) {
                userPayments[payment.id] = payment;
                userPayments[payment.id].account_number = payment.account_number.substr(-4, 4);
            },

            deleteUserPayment: function(id) {
                delete userPayments[id];
            },

            testEmail: function(email) {
                return regEmail.test(email);
            },

            testCoupon: function(coupon) {
                return regCoupon.test(coupon);
            },

            showLoading: function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>',
                    hideOnStateChange: true,
                    duration: 5000
                });
            },

            hideLoading: function() {
                $ionicLoading.hide();
            },

            alert: function(data) {
                $ionicPopup.alert({
                    title: data
                });
                console.log(data);
            }
        };

        return $window.shared;
    });