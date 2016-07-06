angular.module('util.request', ['util.shared', 'util.url'])

    .service('requestUserCars', function($http, shared, url) {
        var userCars = null;
        var promise = null;

        if (shared.isResidential()) {
            promise = $http
                .post(url.cars, shared.getRequestBody({}))
                .success(function(data, status, headers, config) {
                    userCars = data;
                    shared.addUserCars(userCars);
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        }

        return {
            promise: promise,
            getData: function() {
                return userCars;
            }
        };
    })

    .service('requestServices', function($http, shared, url) {
        var services = null;
        var promise = null;
        
        if (shared.isResidential()) {
            promise = $http
                .post(url.services, shared.getRequestBody({}))
                .success(function(data, status, headers, config) {
                    services = data;
                    shared.addServices(data);
                })
                .error(function(data, status, headers, config) {
                    shared.alert(data);
                });
        }

        return {
            promise: promise,
            getData: function() {
                return services;
            }
        };
    })

    .service('requestCarMakers', function($http, shared, url) {
        var carMakers = null;
        var promise = null;

        if (shared.isResidential()) {
            promise = $http
                .post(url.carMaker, shared.getRequestBody({}))
                .success(function(data, status, headers, config) {
                    carMakers = data;
                    shared.addCarMakers(carMakers);
                })
                .error(function(data, status, headers, config) {
                    shared.alert(data);
                });
        }

        return {
            promise: promise,
            getData: function() {
                return carMakers;
            }
        };
    })

    .service('requestCarModels', function($http, shared, url) {
        var carModels = null;
        var promise = null;

        if (shared.isResidential()) {
            promise = $http
                .post(url.carModel, shared.getRequestBody({}))
                .success(function(data, status, headers, config) {
                    carModels = data;
                    shared.addCarModels(carModels);
                })
                .error(function(data, status, headers, config) {
                    shared.alert(data);
                });
        }

        return {
            promise: promise,
            getData: function() {
                return carModels;
            }
        };
    })

    .service('requestUserPayments', function($http, shared, url) {
        var userPayments = null;
        var promise = null;

        if (shared.isResidential()) {
            promise = $http
                .post(url.payments, shared.getRequestBody({}))
                .success(function(data, status, headers, config) {
                    userPayments = data;
                    shared.addUserPayments(userPayments);
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        }

        return {
            promise: promise,
            getData: function() {
                return userPayments;
            }
        };
    })

    .service('requestDiscount', function($http, shared, url) {
        var promise = null;

        if (shared.isResidential()) {
            promise = $http
                .post(url.discount, shared.getRequestBody({}))
                .success(function(data, status, headers, config) {
                    
                })
                .error(function(data, status, headers, config) {
                    shared.alert(data);
                });
        }
        
        return {
            promise: promise
        };
    });