(function () {
    var app;

    window.APP = {
        models: {
            home: {
                title: 'Home'
            },
            sounds: {
                title: 'Sounds'
            },
            pictures: {
                title: 'Pictures'
            }
        }
    };

    document.addEventListener('deviceready', function () {
        var networkState = navigator.network.connection.type;
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.NONE] = 'No network connection';

        if (networkState === states[Connection.NONE]) {
            navigator.notification.alert('Active network connection is needed for this app');
        }

        window.everlive = new Everlive("DFFH77PjPzvO7vLe");
        navigator.splashscreen.hide();

        app = new kendo.mobile.Application(document.body, {
            transition: 'slide',
            initial: 'views/home.html'
        });

    }, false);
}());