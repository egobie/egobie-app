angular.module('util.request', ['util.shared', 'util.url'])

    .service('requestUserCars', function($http, shared, url) {
        var userCars = null;
        var promise = $http
            .post(url.cars, {
                user_id: shared.getUser().id
            }, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                userCars = data;
                shared.addUserCars(userCars);
            })
            .error(function(data, status, headers, config) {
                shared.hideLoading();
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return userCars;
            }
        };
    })

    .service('requestServices', function($http, shared, url) {
        var services = null;
        var promise = $http
            .get(url.services, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                services = data;
                shared.addServices(data);
            })
            .error(function(data, status, headers, config) {
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return services;
            }
        };
    })

    .service('requestCarMakers', function($http, shared, url) {
        var carMakers = null;
        var promise = $http
            .get(url.carMaker, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                carMakers = data;
                shared.addCarMakers(carMakers);
            })
            .error(function(data, status, headers, config) {
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return carMakers;
            }
        };
    })

    .service('requestUserPayments', function($http, shared, url) {
        var userPayments = null;
        var promise = $http
            .post(url.payments, {
                user_id: shared.getUser().id
            }, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                userPayments = data;
                shared.addUserPayments(userPayments);
            })
            .error(function(data, status, headers, config) {
                shared.hideLoading();
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return userPayments;
            }
        };
    })

    .service('requestUserServices', function($http, shared, url) {
        var userServices = null;
        var promise = $http
            .post(url.userServices, {
                user_id: shared.getUser().id,
                user_token: shared.getUser().token
            }, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                userServices = data;
                shared.addUserServices(userServices);
            })
            .error(function(data, status, headers, config) {
                shared.hideLoading();
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return userServices;
            }
        };
    })

    .service('requestUserHistories', function($http, shared, url) {
        var userHistories = null;
        var promise = $http
            .post(url.userHistories, {
                user_id: shared.getUser().id,
                user_token: shared.getUser().token,
                page: 0
            }, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                userHistories = data;
                shared.addUserHistories(userHistories);
            })
            .error(function(data, status, headers, config) {
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return userHistories;
            }
        };
    });