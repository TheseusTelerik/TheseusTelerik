var app = app || {};
app.viewmodels = app.viewmodels || {};

(function (scope) {
    scope.addPicture = kendo.observable({
        //TODO: implement
        savePicture: function () {
            console.log('Saved')
        }
    });
}(app.viewmodels));