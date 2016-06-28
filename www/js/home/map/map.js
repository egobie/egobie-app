angular.module('app.map', ['ionic'])

    .controller('mapCtrl', function($scope, $cordovaGeolocation) {
        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            var latLng = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: window.google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new window.google.maps.Map(document.getElementById("map"), mapOptions);
 
        }, function(error){
          console.log(error);
        });
    });