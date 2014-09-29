var app = app || {};
app.viewmodels = app.viewmodels || {};

(function (scope) {
    var FILES_REPOSITORY = 'http://api.everlive.com/v1/DFFH77PjPzvO7vLe/Files/';

    var location = {};
    var currentDownloadedPicLocation = {};

    scope.allPictures = function () {
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

            window.everlive.data('Pics').get()
               .then(function (data) {
                   var files = [];
                   data.result.forEach(function (file) {
                       $.ajax({
                           type: "GET",
                           url: FILES_REPOSITORY + file.Pic,
                           contentType: "application/json",
                       }).then(function (picData) {
                           currentDownloadedPicLocation = {
                               longitude: file.Location.longitude,
                               latitude: file.Location.latitude
                           };
                           console.log(currentDownloadedPicLocation)
                           var dlat = (currentDownloadedPicLocation.latitude - location.latitude) / 180 * Math.PI;
                           var dlon = (currentDownloadedPicLocation.longitude - location.longitude) / 180 * Math.PI;
                           var x = (dlon) * Math.cos((location.latitude + currentDownloadedPicLocation.latitude) / 2 / 180 * Math.PI);
                           var d = Math.sqrt(x * x + dlat * dlat) * 6371
                           console.log(d);

                           files.push({
                               'imageUrl': picData.Result.Uri,
                               'location': file.Location,
                               'title': file.Title,
                               'distance': d
                           });
                       })
                       .then(function () {
                           $("#images").kendoMobileListView({
                               dataSource: files,
                               template: "<li ><div class='list-pics'>#=data.title#</div><div class='list-pics'>#= data.distance # kilometers away</div><div class='list-pics'><img src=#= data.imageUrl # width='75%'/></div></li>",

                           });
                       });
                   });
               });
        };

        navigator.geolocation.getCurrentPosition(geoSuccess, error, geoConfig);
    }
}(app.viewmodels));