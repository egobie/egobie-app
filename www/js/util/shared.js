angular.module("util.shared", ["util.url"])

    .service("shared", function($rootScope, $window, $ionicPopup, $ionicLoading, $ionicHistory, $interval, $http, $state, url) {

        var user = {
            id: "",
            token: "",
            username: "",
            email: "",
            coupon: "",
            discount: 0,
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

        var weeks = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];

        var months = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];

        var cardTypes = [{
            name: 'American Express',
            pattern: /^3[47]/,
            valid_length: [15]
        }, {
            name: 'Visa Electron',
            pattern: /^(4026|417500|4508|4844|491(3|7))/,
            valid_length: [16]
        }, {
            name: 'Visa',
            pattern: /^4/,
            valid_length: [16]
        }, {
            name: 'MasterCard',
            pattern: /^5[1-5]/,
            valid_length: [16]
        }, {
            name: 'Discover',
            pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
            valid_length: [16]
        }];

        var userCars = {};
        var userPayments = {};
        var carMakers = [];
        var carModels = {};
        var services = {};

        var menuScope = null;

        var carWash = [];
        var oilChange = [];
        var detailing = [];

        var serviceNames = {
            "CAR_WASH": "Car Wash",
            "OIL_CHANGE": "Lube Service",
            "DETAILING": "Detailing"
        };

        var userTasks = [];
        var fleetTasks = [];
        var taskInterval = null;

        var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var regCoupon = /^([A-Z0-9]{5})$/;
        var regPhone = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;

        var years = [];
        var _current_year = new Date().getFullYear();

        // 1980 - 2016
        for (var i = _current_year; i >= 1980; i--) {
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
            unratedHistory: 0,

            refreshUser: function(u) {
                user.id = u.id;
                user.type = u.type;
                user.token = u.password;
                user.username = u.username;
                user.first = u.first_name;
                user.last = u.last_name;
                user.middle = u.middle_name;
                user.email = u.email;
                user.phone = u.phone_number;
                user.coupon = u.coupon;
                user.discount = u.discount;

                user.home_state = u.home_address_state;
                user.home_city = u.home_address_city;
                user.home_zip = u.home_address_zip;
                user.home_street = u.home_address_street;

                user.work_state = u.work_address_state;
                user.work_city = u.work_address_city;
                user.work_zip = u.work_address_zip;
                user.work_street = u.work_address_street;

                refreshScope();
            },

            refreshUserToken: function(token) {
                user.token = token;

                refreshScope();
            },

            getUser: function() {
                return user;
            },

            isResidential: function() {
                return user.type === "RESIDENTIAL";
            },

            useDiscount: function() {
                if (user.discount > 0) {
                    user.discount--;
                }

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

            getRequestBody: function(body) {
                body.user_id = user.id;
                body.user_token = user.token;

                return body;
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

            addServices: function(data) {
                var self = this;

                if (data) {
                    Array.prototype.forEach.call(data, function(service) {
                        service.free = service.free || [];
                        service.charge = service.charge || [];
                        service.addons = service.addons || [];
                        services[service.id] = service;
                        // Used for selection
                        services[service.id].checked = false;
                        services[service.id].full_type = self.getServiceType(services[service.id].type);

                        if (service.type === "CAR_WASH") {
                            carWash.push(service);
                        } else if (service.type === "OIL_CHANGE") {
                            oilChange.push(service);
                        } else if (service.type === "DETAILING") {
                            detailing.push(service);
                        }
                    });
                }
            },

            getServiceType: function(type) {
                if (type === "CAR_WASH") {
                    return "Car Wash";
                } else if (type === "OIL_CHANGE") {
                    return "Oil & Filter";
                } else if (type === "DETAILING") {
                    return "Detailing";
                }

                return "";
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

            readService: function(id) {
                $http
                    .post(url.readService + id, this.getRequestBody({}))
                    .success(function(data, status, headers, config) {
                        
                    })
                    .error(function(data, status, headers, config) {
                        this.alert("send read for service - " + data);
                    });
            },

            demandService: function(ids) {
                $http
                    .post(url.demandService, this.getRequestBody({
                        services: ids
                    }))
                    .success(function(data, status, headers, config) {
                        
                    })
                    .error(function(data, status, headers, config) {
                        this.alert("send demand for service - " + data);
                    });
            },

            demandAddons: function(ids) {
                $http
                    .post(url.demandAddon, this.getRequestBody({
                        addons: ids
                    }))
                    .success(function(data, status, headers, config) {
                        
                    })
                    .error(function(data, status, headers, config) {
                        this.alert("send demand for Addons - " + data);
                    });
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
                        car.full_state = states[car.state].toUpperCase();
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
                refreshScope();
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
                refreshScope();
            },

            demandOpening: function(id) {
                $http
                    .post(url.demandOpening + id, this.getRequestBody({}))
                    .success(function(data, status, headers, config) {
                        
                    })
                    .error(function(data, status, headers, config) {
                        this.alert("send demand for opening - " + data);
                    });
            },

            getUnratedHistory: function() {
                return this.unratedHistory;
            },

            loadTasks: function(animation) {
                if (this.isResidential()) {
                    return;
                }

                var self = this;

                if (animation) {
                    this.showLoading();

                    if (taskInterval) {
                        $interval.cancel(taskInterval);
                    }

                    taskInterval = $interval(function() {
                        self.loadTasks(false);
                    }, 600000);
                }

                $http
                    .post(url.tasks, this.getRequestBody({}))
                    .success(function(data, status, headers, config) {
                        self.hideLoading();
                        var user = 0;
                        var fleet = 0;

                        userTasks = data.user_tasks || [];
                        fleetTasks = data.fleet_tasks || [];

                        if (userTasks) {
                            Array.prototype.forEach.call(userTasks, function(task) {
                                if (task.status === "RESERVED") {
                                    user++;
                                }
                            });
                        }

                        if (fleetTasks) {
                            Array.prototype.forEach.call(fleetTasks, function(task) {
                                if (task.status === "RESERVED") {
                                    fleet++;
                                }
                            });
                        }

                        if (user * fleet !== 0) {
                            self.notify("New Tasks", user + " tasks for residential. " + fleet + 
                                    "tasks for fleet");
                        }

                        window.cordova.plugins.notification.badge.set(user + fleet);
                        menuScope.badge.task = user + fleet;
                    })
                    .error(function(data, status, headers, config) {
                        self.hideLoading();
                        self.alert(data);
                    });
            },

            getUserTasks: function() {
                return userTasks;
            },
            
            getFleetTasks: function() {
                return fleetTasks;
            },

            testEmail: function(email) {
                return regEmail.test(email);
            },

            testCoupon: function(coupon) {
                return regCoupon.test(coupon);
            },

            testPhone: function(phone) {
                return regPhone.test(phone);
            },

            testCreditCard: function(accountNumber) {
                if (accountNumber) {
                    var len = ("" + accountNumber).length;

                    for (var i in cardTypes) {
                        if (cardTypes[i].pattern.test(accountNumber) && cardTypes[i].valid_length.indexOf(len) >= 0) {
                            return cardTypes[i].name;
                        }
                    }
                }

                return "invalid";
            },

            processOpening: function(openings) {
                if (openings) {
                    Array.prototype.forEach.call(openings, function(opening) {
                        var d = new Date(opening.day);
                        d.setDate(d.getDate() + 1);

                        opening.year = d.getFullYear();
                        opening.month = months[d.getMonth()];
                        opening.weekday = weeks[d.getDay()];
                        opening.date = d.getDate() < 10 ? ("0" + d.getDate()) : d.getDate();
                    });
                }

                return openings;
            },

            getTime: function(t) {
                var sufix = "";

                if (t % 1 === 0) {
                    sufix = ":00";
                } else {
                    t -= 0.5;
                    sufix = ":30";
                }

                if (t < 10) {
                    return "0" + t + sufix + " A.M";
                } else if (t < 12) {
                    return t + sufix + " A.M";
                } else {
                    return t + sufix + " P.M";
                }
            },

            showLoading: function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>',
                    hideOnStateChange: true,
                    duration: 10000
                });
            },

            hideLoading: function() {
                $ionicLoading.hide();
            },

            alert: function(data) {
                $ionicPopup.alert({
                    title: data
                });
//                console.log(data);
            },

            notify: function(title, message) {
                // Vibrate 1s
                //$cordovaVibration.vibrate(1000);
                cordova.plugins.notification.local.schedule({
                    id: 1,
                    title: title,
                    text: message,
                    sound: "res://platform_default"
                }).then(function (result) {
                    
                });
            },

            setMenuScope: function(scope) {
                menuScope = scope;
            },

            goHome: function() {
                $http.post(url.goHome, this.getRequestBody({}));
            },

            goNotification: function() {
                $http.post(url.goNotification, this.getRequestBody({}));
            },

            goService: function() {
                $http.post(url.goService, this.getRequestBody({}));
            },

            goHistory: function() {
                $http.post(url.goHistory, this.getRequestBody({}));
            },

            goCoupon: function() {
                $http.post(url.goCoupon, this.getRequestBody({}));
            },

            goCar: function() {
                $http.post(url.goCar, this.getRequestBody({}));
            },

            goPayment: function() {
                $http.post(url.goPayment, this.getRequestBody({}));
            },

            goSetting: function() {
                $http.post(url.goSetting, this.getRequestBody({}));
            },

            goAbout: function() {
                $http.post(url.goAbout, this.getRequestBody({}));
            },

            goReservation: function() {
                $http.post(url.goReservation, this.getRequestBody({}));
            },

            goOndemand: function() {
                $http.post(url.goOndemand, this.getRequestBody({}));
            },

            openRating: function() {
                $http.post(url.openRating, this.getRequestBody({}));
            },

            openFeedback: function() {
                $http.post(url.openFeedback, this.getRequestBody({}));
            },

            openService: function() {
                $http.post(url.openService, this.getRequestBody({}));
            },

            openExtra: function() {
                $http.post(url.openExtra, this.getRequestBody({}));
            },

            openDate: function() {
                $http.post(url.openDate, this.getRequestBody({}));
            },

            openCar: function() {
                $http.post(url.openCar, this.getRequestBody({}));
            },

            openPayment: function() {
                $http.post(url.openPayment, this.getRequestBody({}));
            },

            readHistory: function() {
                $http.post(url.readHistory, this.getRequestBody({}));
            },

            clickOpening: function(opening) {
                $http.post(url.clickOpening, this.getRequestBody({
                    data: opening
                }));
            },

            reloadOpening: function() {
                $http.post(url.reloadOpening, this.getRequestBody({}));
            },

            unselectService: function(id) {
                $http.post(url.unselectService, this.getRequestBody({
                    data: id + ""
                }));
            },

            unselectExtra: function(id) {
                $http.post(url.unselectExtra, this.getRequestBody({
                    data: id + ""
                }));
            },

            signOut: function() {
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache().then(function() {
                    user = {
                        id: "",
                        token: "",
                        username: "",
                        email: "",
                        coupon: "",
                        discount: 0,
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

                    userCars = {};
                    userPayments = {};
                    carMakers = [];
                    carModels = {};
                    services = {};

                    carWash = [];
                    oilChange = [];
                    detailing = [];

                    years = [];

                    $state.go('sign.in');
                });
            }
        };

        return $window.shared;
    });