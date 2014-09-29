var app = app || {};
app.viewmodels = app.viewmodels || {};

(function (scope) {
    var location = {};
    var currentDownloadedSoundLocation = {};

    scope.newSound = kendo.observable({
        reccord: function () {
            var that = this;
            var error = function (error) {
                navigator.notification.alert("Unfortunately we could not add the audio file");
            };

            var geoConfig = {
                enableHighAccuracy: true
            };
            var geoSuccess = function (data) {
                location = {
                    longitude: data.coords.longitude,
                    latitude: data.coords.latitude
                };
                navigator.notification.beep(1);
                navigator.device.capture.captureAudio(function (mediaFiles) {
                    var options = new FileUploadOptions();
                    var ft = new FileTransfer();
                    var fileURI = mediaFiles[0].fullPath;
                    var uploadUrl = window.everlive.Files.getUploadUrl();
                    navigator.notification.alert(fileURI);

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
                            navigator.notification.alert('Audio File successfully uploaded');

                        }, error);
                    }, function (error) {
                        navigator.notification.alert("Sorry! Something went wrong. Please try again.");
                    }, options);

                }, { limit: 1 });

            };

            navigator.geolocation.getCurrentPosition(geoSuccess, error, geoConfig);
        },

        title: ''
    });
}(app.viewmodels));