// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular
    .module('app', ['ionic', 'ngCordova',
        'app.sign',
        'app.sign.in',
        'app.sign.up',
        'app.sign.reset',

        'app.tutorial',
        'app.menu',

        'app.home',
        'app.home.resident',
        'app.home.resident.demand',
        'app.home.resident.reservation',

        'app.home.mall',
        'app.home.business',

        'app.service',
        'app.service.detail',

        'app.setting',
        'app.setting.user',
        'app.setting.password',
        'app.setting.home',
        'app.setting.work',

        'app.car',
        'app.car.add',
        'app.car.edit',

        'app.myservice',
        'app.myservice.history',
        'app.myservice.reservation',

        'app.notification',
        'app.coupon',

        'app.payment',
        'app.payment.add',
        'app.payment.edit',

        'app.about',
        'app.about.feedback',

        'app.task',
        'app.task.fleet',
        'app.task.residential',

        'util.shared',
        'util.url',
        'util.request',
        'util.localStorage'
    ])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova.plugins.Keyboard) {
                window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            }

            // Open link
            window.open = window.cordova.InAppBrowser.open;

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                window.StatusBar.styleDefault();
            }

            // Enable background mode
            window.cordova.plugins.backgroundMode.enable();

            window.cordova.plugins.notification.local.registerPermission(function (granted) {
                
            });

            window.cordova.plugins.notification.badge.set(0);
        });
    });