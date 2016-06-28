angular.module("util.map", ["util.url"])

    .service('map', function($window, shared) {

        var map = null;

        if (!!$window.map) {
            return $window.map;
        }

        $window.map = {

            createMap: function(element, mapOptions) {
                if (!map) {
                    mapOptions.zoomControl = false;
                    mapOptions.mapTypeControl = false;
                    mapOptions.scaleControl = false;
                    mapOptions.streetViewControl = false;
                    mapOptions.rotateControl = false;
                    mapOptions.fullscreenControl = false;

                    map = new window.google.maps.Map(element, mapOptions);
                    // Add Location Control
                    this.addLocationButton(map);
                    // Create marker
                    new window.google.maps.Marker({
                        position: mapOptions.center,
                        map: map
                    });
                }
            },

            getMap: function() {
                return map;
            },

            addLocationButton: function(map) {
                var control = document.createElement('div');
                var first = document.createElement('button');
                var second = document.createElement('div');

                first.appendChild(second);
                control.appendChild(first);
                control.index = 1;
                control.className = "egobie-map-control-location";

                first.addEventListener('click', function() {
                    if (navigator.geolocation) {
                        shared.showLoading();

                        navigator.geolocation.getCurrentPosition(function(position) {
                            shared.hideLoading();
                            map.setCenter(new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                        }, function(error) {
                            shared.alert("Error getting location - ", error);
                        });
                    }
                });

                console.log(control);
                map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(control);
            }
        };

        return $window.map;
    });