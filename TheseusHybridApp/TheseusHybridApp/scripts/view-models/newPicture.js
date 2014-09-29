var app = app || {};
app.viewmodels = app.viewmodels || {};

(function (scope) {
    var location = {};
    var currentDownloadedPicLocation = {};

    scope.newPicture = kendo.observable({
        addPicture: function () {
            var that = this;
            var picSuccess = function (data) {
                var id;
                window.everlive.Files.create({
                    Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
                    ContentType: "image/jpeg",
                    base64: data
                },
                    function (picData) {
                        window.everlive.data('Pics').create({
                            'Pic': picData.result.Id,
                            'Location': location,
                            'Title': that.get('title'),
                        }, function (data) {
                            navigator.notification.vibrate(1500);
                            navigator.notification.alert('Picture successfully uploaded');

                        }, error);
                    }, error);


            };
            var error = function (error) {
                navigator.notification.alert("Unfortunately we could not add the image");
            };
            var picConfig = {
                destinationType: Camera.DestinationType.DATA_URL,
                targetHeight: 600,
                targetWidth: 600
            };
            var geoConfig = {
                enableHighAccuracy: true
            };
            var geoSuccess = function (data) {
                location = {
                    longitude: data.coords.longitude,
                    latitude: data.coords.latitude
                };

                navigator.camera.getPicture(picSuccess, error, picConfig);
            };

            navigator.geolocation.getCurrentPosition(geoSuccess, error, geoConfig);
        },

        title: ''
    });
}(app.viewmodels));