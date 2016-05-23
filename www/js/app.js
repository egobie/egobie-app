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

        'app.history',
        'app.history.history',
        'app.history.reservation',

        'app.notification',
        'app.coupon',

        'app.payment',
        'app.payment.add',
        'app.payment.edit',

        'app.about',
        'app.about.feedback',

        'app.task',

        'util.shared',
        'util.url',
        'util.request'
    ])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                // Enable background mode
                cordova.plugins.backgroundMode.enable();
                // Open link
                window.open = cordova.InAppBrowser.open;
            }
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })