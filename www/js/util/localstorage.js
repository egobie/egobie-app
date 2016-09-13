angular.module('util.localStorage', ['ngCordova'])

    .service('egobieLocalStorage', function() {
        return {
            get: function(key) {
                return window.localStorage.getItem(key) || "";
            },
            set: function(key, value) {
                window.localStorage.setItem(key, value + "");
            },
            remove: function(key) {
                var oldValue = window.localStorage.getItem(key) || "";
                window.localStorage.removeItem(key);
                return oldValue;
            },
            clear: function() {
                window.localStorage.clear();
            }
        };
    });