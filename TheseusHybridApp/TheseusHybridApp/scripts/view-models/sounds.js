var app = app || {};
app.viewmodels = app.viewmodels || {};

(function (scope) {
    var location = {};
    var currentDownloadedSoundLocation = {};

    scope.allSounds = function () {
        var error = function (error) {
            navigator.notification.alert("Unable to get location");
        };
        var geoConfig = {
            enableHighAccuracy: true
        };
        var geoSuccess = function (data) {
            location = {
                longitude: data.coords.longitude,
                latitude: data.coords.latitude
            };

            window.everlive.data('Sounds').get()
               .then(function (data) {
                   var files = [];
                   data.result.forEach(function (file) {
                       $.ajax({
                           type: "GET",
                           url: 'http://api.everlive.com/v1/DFFH77PjPzvO7vLe/Files/' + file.Sound,
                           contentType: "application/json",
                       }).then(function (soundData) {
                           currentDownloadedSoundLocation = {
                               longitude: file.Location.longitude,
                               latitude: file.Location.latitude
                           };
                           console.log(currentDownloadedSoundLocation)
                           var dlat = (currentDownloadedSoundLocation.latitude - location.latitude) / 180 * Math.PI;
                           var dlon = (currentDownloadedSoundLocation.longitude - location.longitude) / 180 * Math.PI;
                           var x = (dlon) * Math.cos((location.latitude + currentDownloadedSoundLocation.latitude) / 2 / 180 * Math.PI);
                           var d = Math.sqrt(x * x + dlat * dlat) * 6371
                           console.log(d);

                           files.push({
                               'imageUrl': soundData.Result.Uri,
                               'location': file.Location,
                               'title': file.Title,
                               'distance': d
                           });
                       })
                       .then(function () {
                           //files.Location.forEach(function (file) {
                           //    console.log(file.location)
                           //});

                           $("#sounds").kendoMobileListView({
                               dataSource: files,
                               template: "<li ><div class='list-pics'>#=data.title#</div><div class='list-pics'>'#= data.distance #' kilometers away</div><div class='list-pics'><audio controls=\"controls\"><source src='#= data.imageUrl #' width='75%'/></audio></div></li>",

                           });
                       });
                   });
               });
        };

        navigator.geolocation.getCurrentPosition(geoSuccess, error, geoConfig);
        console.log('rec');
    },

    scope.sounds = kendo.observable({
        reccord: function () {
            var that = this;
            console.log('new rec')
            var error = function (error) {
                navigator.notification.alert("Unfortunately we could not add the sound");
            };

            var geoConfig = {
                enableHighAccuracy: true
            };
            var geoSuccess = function (data) {
                location = {
                    longitude: data.coords.longitude,
                    latitude: data.coords.latitude
                };
                console.log(location);
                navigator.device.capture.captureAudio(function (mediaFiles) {
                    console.log('capture audio')

                    var options = new FileUploadOptions();
                    var ft = new FileTransfer();
                    var fileURI = mediaFiles[0].fullPath;
                    var uploadUrl = window.everlive.Files.getUploadUrl();
                    alert(fileURI);

                    options.fileKey = "file";
                    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
                    options.mimeType = "audio/wav";
                    options.headers = window.everlive.buildAuthHeader();

                    ft.upload(fileURI, uploadUrl, function (resp) {
                        var data = JSON.parse(resp.response);
                        var uploadedFileId = data.Result[0].Id;
                        var uploadedFileUri = data.Result[0].Uri;
                        window.everlive.data('Sounds').create({
                            'Sound': uploadedFileId,
                            'Location': location,
                            'Title': that.get('title'),
                        }, function (data) {
                            navigator.notification.vibrate(1500);
                            alert('Audio File successfully uploaded');
                           
                        }, error);
                    }, function (error) {
                        alert("Sorry! Something went wrong. Please try again.");
                    }, options);

                }, { limit: 1 });

            };

            navigator.geolocation.getCurrentPosition(geoSuccess, error, geoConfig);
        },

        title: ''
    });
}(app.viewmodels));