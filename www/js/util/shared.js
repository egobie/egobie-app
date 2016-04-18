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

        var cars = {};
        var makers = [];

        var payments = {};

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

        var userServices = [];

        // Email Reg
        var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

            getColors: function() {
                return colors;
            },

            getCars: function(scope) {
                if (user.id) {
                    var _hide = this.hideLoading;
                    this.showLoading();

                    setTimeout(function() {
                    $http
                        .post(url.cars, {
                            user_id: user.id
                        }, {
                            headers: headers
                        })
                        .success(function(data, status, headers, config) {
                            _hide();
                            cars = {};
                            for (var i = 0; data && i < data.length; i++) {
                                cars[data[i].id] = data[i];
                            }
                            scope.cars = cars;
                        })
                        .error(function(data, status, headers, config) {
                            $ionicPopup.alert({
                                title: data
                            });
                        });
                    }, 1000);
                }

                return cars;
            },

            addCar: function(car) {
                cars[car.id] = car;
                refreshScope();
            },

            deleteCar: function(id) {
                delete cars[id];
                refreshScope();
            },

            getMakers: function(scope) {
                if (makers.length === 0) {
                    setTimeout(function() {
                    $http
                        .get(url.carMaker, {
                            headers: headers
                        })
                        .success(function(data, status, headers, config) {
                            makers = data;
                            scope.makers = makers;
                        })
                        .error(function(data, status, headers, config) {
                            $ionicPopup.alert({
                                title: data
                            });
                        });
                    }, 1000);
                }

                return makers;
            },

            getPayments: function(scope) {
                if (user.id) {
                    var _hide = this.hideLoading;
                    this.showLoading();

                    setTimeout(function() {
                    $http
                        .post(url.payments, {
                            user_id: user.id
                        }, {
                            headers: headers
                        })
                        .success(function(data, status, headers, config) {
                            _hide();
                            payments = {};
                            for (var i = 0; data && i < data.length; i++) {
                                payments[data[i].id] = data[i];
                            }
                            scope.payments = payments;
                        })
                        .error(function(data, status, headers, config) {
                            $ionicPopup.alert({
                                title: data
                            });
                        });
                    }, 1000);
                }

                return payments;
            },

            addPayment: function(payment) {
                payments[payment.id] = payment;
                refreshScope();
            },

            deletePayment: function(id) {
                delete payments[id];
                refreshScope();
            },

            getUserServices: function(scope) {
                if (user.id) {
                    var _hide = this.hideLoading;
                    this.showLoading();

                    setTimeout(function() {
                    $http
                        .post(url.userServices, {
                            user_id: user.id,
                            user_token: user.token
                        }, {
                            headers: headers
                        })
                        .success(function(data, status, headers, config) {
                            _hide();
                            userServices = data;
                            scope.userServices = userServices;

                            for (var i = 0; i < scope.userServices.length; i++) {
                                if (scope.userServices[i].status === "DONE") {
                                    scope.done.push(scope.userServices[i]);
                                } else if (scope.userServices[i].status === "IN_PROGRESS") {
                                    scope.inProgress.push(scope.userServices[i]);
                                } else if (scope.userServices[i].status === "RESERVED") {
                                    scope.reservation.push(scope.userServices[i]);
                                }
                            }
                        })
                        .error(function(data, status, headers, config) {
                            $ionicPopup.alert({
                                title: data
                            });
                        });
                    }, 1000);
                }

                return userServices;
            },

            testEmail: function(email) {
                return regEmail.test(email);
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