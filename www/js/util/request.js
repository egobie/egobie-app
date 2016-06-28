angular.module('util.request', ['util.shared', 'util.url', 'util.map'])

    .service('requestUserPosition', function($cordovaGeolocation, shared, map) {
        var element = document.createElement("div");
        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };

        element.setAttribute("id", "map");
        element.setAttribute("data-tap-disabled", "true");

        var promise = $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            map.createMap(element, {
                center: new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 15,
                mapTypeId: window.google.maps.MapTypeId.ROADMAP
            });
 
        }, function(error){
          shared.alert("Error when getting user current location " + error);
        });

        return {
            promise: promise
        };
    })

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
            $http
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
            $http
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
            $http
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
            $http
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
    });