var app = app || {};
app.viewmodels = app.viewmodels || {};

(function (scope) {
    scope.allPictures = function () {
        window.everlive.data('Pics').get()
                .then(function (data) {
                    var files = [];
                    data.result.forEach(function (file) {
                        $.ajax({
                            type: "GET",
                            url: 'http://api.everlive.com/v1/DFFH77PjPzvO7vLe/Files/' + file.Pic,
                            //headers: { "Authorization" : "Bearer your-access-token-here" },
                            contentType: "application/json",
                        }).then(function (picData) {
                            files.push({
                                'imageUrl': picData.Result.Uri,
                                'location': file.Location
                            });
                        })
                        .then(function () {
                            $("#images").kendoMobileListView({
                                dataSource: files,
                                template: "<img src='#= data.imageUrl #'>",

                            });
                        });
                    });
                });
    }

    scope.pictures = kendo.observable({
        addPicture: function () {
            console.log('Saved')
            var location = {};

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
                            'Location': location
                        }, function (data) {
                            console.log(data);
                        }, error);
                    }, error);
            };
            var error = function (error) {
                navigator.notification.alert("Unfortunately we could not add the image");
            };
            var picConfig = {
                destinationType: Camera.DestinationType.DATA_URL,
                targetHeight: 300,
                targetWidth: 300
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
                console.log(location);
            };

            navigator.geolocation.getCurrentPosition(geoSuccess, error, geoConfig);
        },

        title: 'All Pictures',
    });
}(app.viewmodels));